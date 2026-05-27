/**
 * KbService — per-tenant knowledge base for the AI bot (SPEC §14.4).
 *
 * Ingestion:
 *   - Chunks raw text into ~500-token windows with 50-token overlap.
 *   - Inserts one kb_documents row + N kb_chunks rows.
 *
 * Retrieval:
 *   - Postgres full-text search via the `tsv` column (Hebrew-safe with the
 *     'simple' dictionary). Ranked with ts_rank_cd.
 *   - When OPENAI_API_KEY is set in the future, the embedding column
 *     becomes primary; tsv stays as a fallback / keyword exact-match path.
 *
 * The same module exposes ingestFromDocumentVersion() so the document
 * vault auto-publishes OCR'd text into the KB.
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DbService } from '../../db/db.service';

const CHUNK_SIZE = 500; // approx characters per chunk (we don't tokenize)
const CHUNK_OVERLAP = 50;
const MAX_CHUNK_SIZE = 1200; // hard ceiling per chunk

export interface KbDocument {
  id: string;
  title: string;
  source_url: string | null;
  source_file_id: string | null;
  created_at: string;
}

export interface KbSearchResult {
  document_id: string;
  document_title: string;
  chunk_id: string;
  chunk_index: number;
  content: string;
  rank: number;
  metadata: Record<string, unknown>;
}

@Injectable()
export class KbService {
  private readonly logger = new Logger(KbService.name);

  constructor(private readonly db: DbService) {}

  async listDocuments(tenantId: string): Promise<KbDocument[]> {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<KbDocument>(
        `select id, title, source_url, source_file_id, created_at
           from kb_documents order by created_at desc limit 200`,
      );
      return rows;
    });
  }

  async ingestText(input: {
    tenantId: string;
    title: string;
    content: string;
    sourceUrl?: string;
    sourceFileId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ document_id: string; chunks: number }> {
    if (!input.content || input.content.trim().length === 0) {
      throw new NotFoundException('Empty content — nothing to ingest');
    }
    const chunks = chunkText(input.content);
    return this.db.withTenantContext(
      { tenant_id: input.tenantId, role: 'mgmt_admin' },
      async (c) => {
        // Idempotency: if a kb_documents row already exists for this title +
        // source_file_id, replace its chunks rather than duplicate.
        const existing = await c.query<{ id: string }>(
          `select id from kb_documents
            where tenant_id = $1
              and ($2::uuid is null or source_file_id = $2)
              and title = $3
            limit 1`,
          [input.tenantId, input.sourceFileId ?? null, input.title],
        );
        let docId: string;
        if (existing.rows.length > 0) {
          docId = existing.rows[0]!.id;
          await c.query(`delete from kb_chunks where document_id = $1`, [docId]);
          await c.query(
            `update kb_documents set source_url = $1, metadata = $2::jsonb, updated_at = now() where id = $3`,
            [input.sourceUrl ?? null, JSON.stringify(input.metadata ?? {}), docId],
          );
        } else {
          const ins = await c.query<{ id: string }>(
            `insert into kb_documents (tenant_id, source_file_id, title, source_url, metadata)
             values ($1, $2, $3, $4, $5::jsonb)
             returning id`,
            [
              input.tenantId,
              input.sourceFileId ?? null,
              input.title,
              input.sourceUrl ?? null,
              JSON.stringify(input.metadata ?? {}),
            ],
          );
          docId = ins.rows[0]!.id;
        }

        for (let i = 0; i < chunks.length; i++) {
          await c.query(
            `insert into kb_chunks (tenant_id, document_id, chunk_index, content, metadata)
             values ($1, $2, $3, $4, $5::jsonb)`,
            [input.tenantId, docId, i, chunks[i], JSON.stringify(input.metadata ?? {})],
          );
        }
        return { document_id: docId, chunks: chunks.length };
      },
    );
  }

  /**
   * Pull the OCR'd text from a document_versions row and publish it into
   * the KB. Used by DocumentsService after OCR completes.
   */
  async ingestFromDocumentVersion(tenantId: string, versionId: string) {
    const meta = await this.db.query<{
      title: string;
      ocr_text: string | null;
      ai_summary: string | null;
      file_id: string;
    }>(
      `select d.title, dv.ocr_text, dv.ai_summary, dv.file_id
         from document_versions dv
         join documents d on d.id = dv.document_id
        where dv.id = $1 and dv.tenant_id = $2`,
      [versionId, tenantId],
    );
    if (meta.rows.length === 0) throw new NotFoundException('Version not found');
    const m = meta.rows[0]!;
    // Combine summary + OCR text so the summary always lands in the first chunk.
    const parts: string[] = [];
    if (m.ai_summary) parts.push(m.ai_summary);
    if (m.ocr_text) parts.push(m.ocr_text);
    const content = parts.join('\n\n').trim();
    if (!content) {
      this.logger.warn(`KB skip: no OCR text on version ${versionId}`);
      return { document_id: null, chunks: 0 };
    }
    return this.ingestText({
      tenantId,
      title: m.title,
      content,
      sourceFileId: m.file_id,
      metadata: { source: 'document_version', version_id: versionId },
    });
  }

  /**
   * Full-text search across the tenant's KB. Returns the top-N chunks
   * ranked by ts_rank_cd. Falls back to ILIKE when no tsvector match.
   */
  async search(tenantId: string, query: string, limit = 5): Promise<KbSearchResult[]> {
    if (!query.trim()) return [];
    const tsQuery = toTsQuery(query);

    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      // Primary: full-text search with prefix matching.
      const { rows: ftsRows } = await c.query<KbSearchResult>(
        `select c.id as chunk_id,
                c.document_id,
                c.chunk_index,
                c.content,
                c.metadata,
                d.title as document_title,
                ts_rank_cd(c.tsv, q.query) as rank
           from kb_chunks c
           join kb_documents d on d.id = c.document_id,
                to_tsquery('simple', $1) as q(query)
          where c.tsv @@ q.query
          order by rank desc
          limit $2`,
        [tsQuery, limit],
      );
      if (ftsRows.length > 0) return ftsRows;

      // Fallback: substring ILIKE — handles short queries the FTS prefix
      // logic doesn't cover well.
      const { rows: ilikeRows } = await c.query<KbSearchResult>(
        `select c.id as chunk_id,
                c.document_id,
                c.chunk_index,
                c.content,
                c.metadata,
                d.title as document_title,
                0.1 as rank
           from kb_chunks c
           join kb_documents d on d.id = c.document_id
          where c.content ilike $1
          order by c.chunk_index
          limit $2`,
        [`%${query.slice(0, 60)}%`, limit],
      );
      return ilikeRows;
    });
  }
}

/**
 * Chunk text into ~CHUNK_SIZE-character windows with CHUNK_OVERLAP
 * overlap on both sides. Tries to break on paragraph / sentence
 * boundaries when possible so chunks read sensibly.
 */
export function chunkText(text: string): string[] {
  const clean = text.replace(/\r\n/g, '\n').trim();
  if (clean.length === 0) return [];
  if (clean.length <= CHUNK_SIZE) return [clean];

  const chunks: string[] = [];
  let pos = 0;
  while (pos < clean.length) {
    const end = Math.min(pos + CHUNK_SIZE, clean.length);
    let cut = end;
    // Prefer to end on paragraph / sentence / whitespace.
    if (end < clean.length) {
      const nearby = clean.slice(pos, Math.min(pos + MAX_CHUNK_SIZE, clean.length));
      const para = nearby.lastIndexOf('\n\n');
      const sentence = nearby.lastIndexOf('. ');
      const space = nearby.lastIndexOf(' ');
      cut = pos + (para > CHUNK_SIZE / 2
        ? para
        : sentence > CHUNK_SIZE / 2
        ? sentence + 1
        : space > CHUNK_SIZE / 2
        ? space
        : CHUNK_SIZE);
    }
    chunks.push(clean.slice(pos, cut).trim());
    if (cut >= clean.length) break;
    pos = Math.max(cut - CHUNK_OVERLAP, pos + 1);
  }
  return chunks.filter((c) => c.length > 0);
}

/**
 * Build a Postgres to_tsquery expression from a free-form query string.
 * Each whitespace-separated token becomes a prefix match joined with AND.
 * Stripped of characters that break tsquery syntax.
 */
function toTsQuery(query: string): string {
  return query
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}_-]/gu, ''))
    .filter((t) => t.length > 0)
    .map((t) => `${t}:*`)
    .join(' & ');
}
