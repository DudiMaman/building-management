/**
 * FilesService — Supabase Storage integration.
 *
 * When SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are present we upload to
 * the real bucket and produce time-limited signed URLs. Otherwise we
 * persist to a local on-disk cache (apps/api/.storage) and serve via
 * file:// URLs — sufficient for tests + dev without external creds.
 */
import { Injectable, Logger } from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DbService } from '../../db/db.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly supabase: SupabaseClient | null;
  private readonly localStorageDir = join(process.cwd(), '.storage');

  constructor(private readonly db: DbService) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.supabase = url && key ? createClient(url, key) : null;
    if (!this.supabase) {
      mkdirSync(this.localStorageDir, { recursive: true });
    }
  }

  /**
   * Create a File row + return an upload URL.
   * Frontend then PUTs the binary directly to that URL.
   */
  async createUploadIntent(
    tenantId: string,
    ownerUserId: string | null,
    ownerPersonId: string | null,
    bucket: string,
    path: string,
    mime: string,
    sizeBytes: number,
    piiTag: 'none' | 'pii' | 'financial' | 'sensitive' = 'none',
  ) {
    const { rows } = await this.db.query<{ id: string }>(
      `insert into files (tenant_id, owner_user_id, owner_person_id, bucket, path, mime, size_bytes, pii_tag)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
      [tenantId, ownerUserId, ownerPersonId, bucket, path, mime, sizeBytes, piiTag],
    );
    const fileId = rows[0]!.id;
    let uploadUrl: string;
    if (this.supabase) {
      const signed = await this.supabase.storage.from(bucket).createSignedUploadUrl(path);
      if (signed.error || !signed.data?.signedUrl) {
        throw new Error(`Supabase signed upload URL failed: ${signed.error?.message}`);
      }
      uploadUrl = signed.data.signedUrl;
    } else {
      uploadUrl = `local://${bucket}/${path}?intent=${fileId}`;
    }
    return { file_id: fileId, upload_url: uploadUrl };
  }

  /**
   * Upload a buffer server-side. Used by PDF generators (invoices, flyers)
   * where the binary is produced by the API and not the client.
   */
  async uploadBuffer(input: {
    tenantId: string;
    ownerUserId?: string | null;
    ownerPersonId?: string | null;
    bucket: string;
    path: string;
    mime: string;
    body: Buffer;
    piiTag?: 'none' | 'pii' | 'financial' | 'sensitive';
  }): Promise<{ file_id: string; signed_url: string }> {
    const sha = createHash('sha256').update(input.body).digest('hex');
    const { rows } = await this.db.query<{ id: string }>(
      `insert into files (tenant_id, owner_user_id, owner_person_id, bucket, path, mime, size_bytes, sha256, pii_tag)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id`,
      [
        input.tenantId,
        input.ownerUserId ?? null,
        input.ownerPersonId ?? null,
        input.bucket,
        input.path,
        input.mime,
        input.body.byteLength,
        sha,
        input.piiTag ?? 'none',
      ],
    );
    const fileId = rows[0]!.id;

    if (this.supabase) {
      const up = await this.supabase.storage
        .from(input.bucket)
        .upload(input.path, input.body, { contentType: input.mime, upsert: true });
      if (up.error) throw new Error(`Supabase upload failed: ${up.error.message}`);
      const signed = await this.supabase.storage
        .from(input.bucket)
        .createSignedUrl(input.path, 60 * 60 * 24 * 7);
      if (signed.error || !signed.data) throw new Error(`Supabase signed URL failed: ${signed.error?.message}`);
      return { file_id: fileId, signed_url: signed.data.signedUrl };
    }
    // Local fallback
    const localPath = join(this.localStorageDir, input.bucket, input.path);
    mkdirSync(join(this.localStorageDir, input.bucket, dirOf(input.path)), { recursive: true });
    writeFileSync(localPath, input.body);
    return { file_id: fileId, signed_url: `file://${localPath}` };
  }

  async getSignedUrl(fileId: string, expiresIn = 3600): Promise<string | null> {
    const { rows } = await this.db.query<{ bucket: string; path: string }>(
      `select bucket, path from files where id = $1 and deleted_at is null`,
      [fileId],
    );
    if (rows.length === 0) return null;
    const r = rows[0]!;
    if (this.supabase) {
      const signed = await this.supabase.storage.from(r.bucket).createSignedUrl(r.path, expiresIn);
      if (signed.error || !signed.data) return null;
      return signed.data.signedUrl;
    }
    return `file://${join(this.localStorageDir, r.bucket, r.path)}`;
  }
}

function dirOf(path: string): string {
  const idx = path.lastIndexOf('/');
  return idx === -1 ? '.' : path.slice(0, idx);
}
