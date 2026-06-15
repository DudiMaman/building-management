/**
 * DocumentsService — building document vault per SPEC §39.
 *
 * Upload flow: existing File row referenced by file_id is attached as
 * version 1 (or N+1) of the Document. After persisting, runOcr() is
 * fired (non-blocking) to populate ocr_text / ai_summary / ai_metadata
 * via Claude vision. Failures don't block the upload — the row exists,
 * the file is in storage, OCR can be retried via the manual endpoint.
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { FilesService } from '../files/files.service';
import { KbService } from '../kb/kb.service';
import { analyzeDocument } from '@bm/ai';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { UploadDocument } from '@bm/shared';
import type { Document, DocumentVersion } from '@bm/db';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly db: DbService,
    private readonly files: FilesService,
    private readonly kb: KbService,
  ) {}

  async upload(
    tenantId: string,
    actorUserId: string,
    input: UploadDocument,
  ): Promise<{ document: Document; version: DocumentVersion }> {
    const result = await this.db.withTenantContext(
      { tenant_id: tenantId, role: 'mgmt_admin' },
      async (c) => {
        const docRes = await c.query<Document>(
          `insert into documents
            (tenant_id, building_id, apartment_id, title, category, description,
             expires_at, reminder_lead_days, tags, visibility)
           values ($1, $2, $3, $4, $5, $6, $7, $8, $9::text[], $10)
           returning *`,
          [
            tenantId,
            input.building_id,
            input.apartment_id ?? null,
            input.title,
            input.category,
            input.description ?? null,
            input.expires_at ?? null,
            input.reminder_lead_days,
            input.tags,
            input.visibility,
          ],
        );
        const doc = docRes.rows[0]!;

        const fileRes = await c.query<{ size_bytes: number; mime: string | null; sha256: string | null }>(
          `select size_bytes, mime, sha256 from files where id = $1`,
          [input.file_id],
        );
        if (fileRes.rows.length === 0) throw new NotFoundException('File not found');

        const verRes = await c.query<DocumentVersion>(
          `insert into document_versions
            (tenant_id, document_id, version_number, file_id, uploaded_by_user_id, size_bytes, mime, sha256)
           values ($1, $2, 1, $3, $4, $5, $6, $7)
           returning *`,
          [
            tenantId,
            doc.id,
            input.file_id,
            actorUserId,
            fileRes.rows[0]!.size_bytes,
            fileRes.rows[0]!.mime,
            fileRes.rows[0]!.sha256,
          ],
        );
        return { document: doc, version: verRes.rows[0]! };
      },
    );

    // Fire-and-forget OCR + AI summary. Caller doesn't wait on it.
    this.scheduleOcr(tenantId, result.version.id, input.title);

    return result;
  }

  async addVersion(
    tenantId: string,
    actorUserId: string,
    docId: string,
    fileId: string,
    notes?: string,
  ): Promise<DocumentVersion> {
    const ver = await this.db.withTenantContext(
      { tenant_id: tenantId, role: 'mgmt_admin' },
      async (c) => {
        const next = await c.query<{ next: number }>(
          `select coalesce(max(version_number), 0) + 1 as next from document_versions where document_id = $1`,
          [docId],
        );
        const fileRes = await c.query<{ size_bytes: number; mime: string | null; sha256: string | null }>(
          `select size_bytes, mime, sha256 from files where id = $1`,
          [fileId],
        );
        const { rows } = await c.query<DocumentVersion>(
          `insert into document_versions
            (tenant_id, document_id, version_number, file_id, uploaded_by_user_id, upload_notes, size_bytes, mime, sha256)
           values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
          [
            tenantId,
            docId,
            next.rows[0]!.next,
            fileId,
            actorUserId,
            notes ?? null,
            fileRes.rows[0]?.size_bytes ?? 0,
            fileRes.rows[0]?.mime ?? null,
            fileRes.rows[0]?.sha256 ?? null,
          ],
        );
        return rows[0]!;
      },
    );
    this.scheduleOcr(tenantId, ver.id);
    return ver;
  }

  async list(tenantId: string, buildingId: string, category?: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const conds = ['building_id = $1', `status = 'active'`];
      const params: any[] = [buildingId];
      if (category) {
        params.push(category);
        conds.push(`category = $${params.length}`);
      }
      const { rows } = await c.query(
        `select d.*, dv.size_bytes, dv.mime, dv.ai_summary
         from documents d
         left join document_versions dv on dv.id = d.current_version_id
         where ${conds.join(' and ')}
         order by d.created_at desc`,
        params,
      );
      return rows;
    });
  }

  async expiringSoon(tenantId: string, days: number = 30) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select * from documents
         where status = 'active'
           and expires_at is not null
           and expires_at - (reminder_lead_days || ' days')::interval <= current_date + ($1 || ' days')::interval
           and expires_at >= current_date
         order by expires_at`,
        [String(days)],
      );
      return rows;
    });
  }

  /**
   * Documents a resident may see in a building (SPEC §39.4 graded visibility).
   * Resolves the person's roles in the building (owner / bill-payer / occupant)
   * and returns docs matching their tier, plus any explicit per-person ACL
   * grant. `mgmt_only` is never returned.
   */
  async listForResident(tenantId: string, personId: string, buildingId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'resident' }, async (c) => {
      const { rows } = await c.query(
        `with myroles as (
           select
             coalesce(bool_or(aa.role = 'owner'), false) as is_owner,
             coalesce(bool_or(aa.is_bill_payer), false) as is_bill_payer,
             coalesce(bool_or(aa.is_occupant), false) as is_occupant
           from apartment_assignments aa
           join apartments a on a.id = aa.apartment_id
           where aa.tenant_id = $1 and aa.person_id = $2
             and aa.status = 'active' and a.building_id = $3
         )
         select d.id, d.title, d.category, d.visibility, d.expires_at,
                dv.size_bytes, dv.mime, dv.ai_summary
         from documents d
         cross join myroles
         left join document_versions dv on dv.id = d.current_version_id
         where d.tenant_id = $1 and d.building_id = $3 and d.status = 'active'
           and (
             d.visibility = 'building_public'
             or (d.visibility = 'all_occupants' and myroles.is_occupant)
             or (d.visibility = 'owners' and myroles.is_owner)
             or (d.visibility = 'bill_payers' and myroles.is_bill_payer)
             or exists (
               select 1 from document_acls acl
               where acl.document_id = d.id and acl.person_id = $2
             )
           )
         order by d.created_at desc`,
        [tenantId, personId, buildingId],
      );
      return rows;
    });
  }

  /**
   * Full-text search across OCR'd text + AI summaries (SPEC §39.5), using the
   * GIN tsvector index on document_versions; also matches document titles.
   */
  async search(tenantId: string, buildingId: string, query: string) {
    if (!query?.trim()) return [];
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select d.id, d.title, d.category, d.expires_at, dv.ai_summary,
                ts_rank(
                  to_tsvector('simple', coalesce(dv.ocr_text,'') || ' ' || coalesce(dv.ai_summary,'')),
                  plainto_tsquery('simple', $3)
                ) as rank
         from documents d
         join document_versions dv on dv.id = d.current_version_id
         where d.building_id = $1 and d.status = 'active'
           and (
             to_tsvector('simple', coalesce(dv.ocr_text,'') || ' ' || coalesce(dv.ai_summary,''))
               @@ plainto_tsquery('simple', $3)
             or d.title ilike '%' || $3 || '%'
           )
         order by rank desc nulls last, d.created_at desc
         limit 20`,
        [buildingId, tenantId, query.trim()],
      );
      return rows;
    });
  }

  /**
   * Scan for documents inside their reminder window and create a one-off
   * renewal task per document (SPEC §39.7). Idempotent: skips documents that
   * already have an open renewal task. Intended for a daily scheduled run.
   */
  async scanExpiries(tenantId: string): Promise<{ scanned: number; tasks_created: number }> {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows: docs } = await c.query<{
        id: string;
        building_id: string;
        title: string;
        category: string;
        expires_at: string;
      }>(
        `select id, building_id, title, category, expires_at from documents
         where status = 'active' and expires_at is not null
           and expires_at - (reminder_lead_days || ' days')::interval <= current_date
           and expires_at >= current_date`,
      );

      let created = 0;
      for (const doc of docs) {
        const existing = await c.query(
          `select 1 from tasks
           where tenant_id = $1 and status not in ('done', 'cancelled')
             and metadata ->> 'document_id' = $2 limit 1`,
          [tenantId, doc.id],
        );
        if (existing.rows.length > 0) continue;
        await c.query(
          `insert into tasks
            (tenant_id, building_id, source, title, description_md, category, priority, status, metadata)
           values ($1, $2, 'adhoc', $3, $4, 'other', 'med', 'todo', $5::jsonb)`,
          [
            tenantId,
            doc.building_id,
            `חידוש מסמך: ${doc.title}`,
            `המסמך "${doc.title}" (${doc.category}) פג בתאריך ${doc.expires_at}. נא לחדש.`,
            JSON.stringify({ kind: 'document_renewal', document_id: doc.id }),
          ],
        );
        created++;
      }
      this.logger.log(`Expiry scan for ${tenantId}: ${docs.length} due, ${created} renewal tasks created`);
      return { scanned: docs.length, tasks_created: created };
    });
  }

  // ---- OCR + AI summary ----

  /**
   * Schedule OCR + AI summary for a version. Non-blocking. In production
   * with BullMQ wired in, swap setImmediate for a queue.add(). For now
   * we run inline and log failures.
   */
  scheduleOcr(tenantId: string, versionId: string, titleHint?: string): void {
    setImmediate(() => {
      this.runOcr(tenantId, versionId, titleHint).catch((err) =>
        this.logger.warn(`OCR failed for version ${versionId}: ${(err as Error).message}`),
      );
    });
  }

  async runOcr(tenantId: string, versionId: string, titleHint?: string): Promise<{ source: string }> {
    const meta = await this.db.query<{
      file_id: string;
      mime: string | null;
      bucket: string;
      path: string;
      title: string;
    }>(
      `select dv.file_id, dv.mime, f.bucket, f.path, d.title
         from document_versions dv
         join files f on f.id = dv.file_id
         join documents d on d.id = dv.document_id
        where dv.id = $1 and dv.tenant_id = $2`,
      [versionId, tenantId],
    );
    if (meta.rows.length === 0) throw new NotFoundException('Version not found');
    const m = meta.rows[0]!;

    const bytes = await this.readFileBytes(m.bucket, m.path);
    if (!bytes) {
      this.logger.warn(`Skipping OCR for ${versionId}: file bytes unavailable`);
      return { source: 'unavailable' };
    }

    const analysis = await analyzeDocument({
      data: bytes,
      mime: m.mime ?? 'application/octet-stream',
      title: titleHint ?? m.title,
    });

    await this.db.query(
      `update document_versions
          set ocr_text = $1,
              ai_summary = $2,
              ai_metadata = $3::jsonb
        where id = $4`,
      [analysis.ocr_text, analysis.ai_summary, JSON.stringify(analysis.ai_metadata), versionId],
    );

    // Publish into the KB so the AI bot can cite this document. Best-
    // effort — failure here doesn't fail the OCR call.
    if (analysis.ocr_text || analysis.ai_summary) {
      try {
        await this.kb.ingestFromDocumentVersion(tenantId, versionId);
      } catch (err) {
        this.logger.warn(`KB ingest failed for ${versionId}: ${(err as Error).message}`);
      }
    }

    return { source: analysis.source };
  }

  /**
   * Read a file's bytes. Uses the local .storage/ fallback when Supabase
   * isn't configured (matches FilesService.uploadBuffer behavior). In
   * production the Supabase storage SDK call lives here.
   */
  private async readFileBytes(bucket: string, path: string): Promise<Buffer | null> {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const dl = await sb.storage.from(bucket).download(path);
        if (dl.error || !dl.data) return null;
        const arrayBuffer = await dl.data.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } catch (err) {
        this.logger.warn(`Supabase download failed: ${(err as Error).message}`);
        return null;
      }
    }
    const localPath = join(process.cwd(), '.storage', bucket, path);
    if (!existsSync(localPath)) return null;
    return readFileSync(localPath);
  }
}
