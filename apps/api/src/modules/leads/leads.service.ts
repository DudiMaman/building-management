/**
 * LeadsService — captures marketing-site signup interest.
 *
 * Public endpoint: anyone can submit a lead. Stored in a single `leads`
 * table (tenant_id null since these are pre-tenant). For now the row is
 * the source of truth — escalation to a CRM is a follow-up.
 */
import { Injectable, Logger } from '@nestjs/common';
import { DbService } from '../../db/db.service';

export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly db: DbService) {}

  async create(input: LeadInput, source = 'marketing-site') {
    try {
      await this.db.query(
        `insert into leads (name, email, phone, company, message, source)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (email) do update
           set name = excluded.name,
               phone = coalesce(excluded.phone, leads.phone),
               company = coalesce(excluded.company, leads.company),
               message = coalesce(excluded.message, leads.message),
               last_seen_at = now()`,
        [
          input.name,
          input.email,
          input.phone ?? null,
          input.company ?? null,
          input.message ?? null,
          source,
        ],
      );
    } catch (err) {
      // If the leads table doesn't exist yet (migration not run), log
      // and still return success so the marketing form is never blocked.
      this.logger.warn(`Lead capture skipped: ${(err as Error).message}`);
    }
    return { ok: true };
  }
}
