/**
 * FlyersService — welcome flyer generation with QR code per SPEC §8.
 *
 * Generates a Hebrew A4 PDF plus a 1080×1080 square variant suitable for
 * social-media reposting. The Instagram-story (1080×1920) and OG (1200×630)
 * variants reuse the same source content; for now we emit the PDF and the
 * square PDF, both uploaded as files in Supabase Storage (or the local
 * fallback when no Supabase creds are present).
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { PdfService } from '../pdf/pdf.service';
import { FilesService } from '../files/files.service';

export interface FlyerVariants {
  pdf_url: string;
  ig_url: string;
  story_url: string;
  og_url: string;
  qr_payload: string;
}

@Injectable()
export class FlyersService {
  constructor(
    private readonly db: DbService,
    private readonly pdf: PdfService,
    private readonly files: FilesService,
  ) {}

  async generate(tenantId: string, buildingId: string): Promise<FlyerVariants> {
    const ctx = await this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<{
        name: string;
        claim_secret: string;
        address_line: string;
        tenant_name: string;
        tenant_phone: string | null;
      }>(
        `select b.name, b.claim_secret, b.address_line,
                t.name as tenant_name,
                t.billing_email as tenant_phone
           from buildings b
           join tenants t on t.id = b.tenant_id
          where b.id = $1`,
        [buildingId],
      );
      if (rows.length === 0) throw new NotFoundException('Building not found');
      return rows[0]!;
    });

    const appOrigin = process.env.APP_ORIGIN ?? 'https://app.building-management.co.il';
    const qrPayload = `${appOrigin}/claim?b=${buildingId}&s=${ctx.claim_secret}`;

    // Render A4 + square
    const a4 = await this.pdf.renderFlyer({
      tenant: { name: ctx.tenant_name, phone: ctx.tenant_phone },
      building: { name: ctx.name, address: ctx.address_line },
      qr_payload: qrPayload,
    });
    const square = await this.pdf.renderFlyerSquare({
      tenant: { name: ctx.tenant_name, phone: ctx.tenant_phone },
      building: { name: ctx.name, address: ctx.address_line },
      qr_payload: qrPayload,
    });

    const ts = Date.now();
    const a4Upload = await this.files.uploadBuffer({
      tenantId,
      bucket: 'flyers',
      path: `${buildingId}/${ts}-a4.pdf`,
      mime: 'application/pdf',
      body: a4,
    });
    const sqUpload = await this.files.uploadBuffer({
      tenantId,
      bucket: 'flyers',
      path: `${buildingId}/${ts}-square.pdf`,
      mime: 'application/pdf',
      body: square,
    });

    // Persist Flyer rows
    await this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      await c.query(
        `insert into flyers (tenant_id, building_id, variant, qr_payload, pdf_file_id)
         values ($1, $2, 'a4_print', $3, $4)
         on conflict do nothing`,
        [tenantId, buildingId, qrPayload, a4Upload.file_id],
      );
      await c.query(
        `insert into flyers (tenant_id, building_id, variant, qr_payload, image_file_id)
         values ($1, $2, 'instagram_square', $3, $4)
         on conflict do nothing`,
        [tenantId, buildingId, qrPayload, sqUpload.file_id],
      );
    });

    return {
      pdf_url: a4Upload.signed_url,
      ig_url: sqUpload.signed_url,
      story_url: sqUpload.signed_url,
      og_url: sqUpload.signed_url,
      qr_payload: qrPayload,
    };
  }
}
