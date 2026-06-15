/**
 * ComplianceService — data-subject rights (SPEC §24.2 / Israeli Privacy Law).
 *
 * export: assemble everything held about the requesting person.
 * erase:  anonymize PII while retaining financial/tax records that the law
 *         requires us to keep (charges, payments, invoices stay, de-identified).
 */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(private readonly db: DbService) {}

  async exportPerson(tenantId: string, personId?: string) {
    if (!personId) throw new BadRequestException('No person associated with this account');

    const [person, assignments, charges, payments, tickets, conversations] = await Promise.all([
      this.db.query(
        `select id, full_name, phone_e164, email, claim_status, notification_prefs, created_at
         from people where id = $1 and tenant_id = $2`,
        [personId, tenantId],
      ),
      this.db.query(
        `select apartment_id, role, is_primary, is_occupant, is_bill_payer, valid_from, valid_to, status
         from apartment_assignments where person_id = $1 and tenant_id = $2`,
        [personId, tenantId],
      ),
      this.db.query(
        `select id, description, amount, currency, due_date, status, paid_amount
         from charges where billed_to_person_id = $1 and tenant_id = $2`,
        [personId, tenantId],
      ),
      this.db.query(
        `select id, amount, currency, method, status, captured_at
         from payments where paid_by_person_id = $1 and tenant_id = $2`,
        [personId, tenantId],
      ),
      this.db.query(
        `select id, title, category, status, opened_at, satisfaction_rating
         from service_tickets where opened_by_person_id = $1 and tenant_id = $2`,
        [personId, tenantId],
      ),
      this.db.query(
        `select id, channel, status, created_at from conversations where person_id = $1 and tenant_id = $2`,
        [personId, tenantId],
      ),
    ]);

    return {
      exported_at: new Date().toISOString(),
      person: person.rows[0] ?? null,
      apartment_assignments: assignments.rows,
      charges: charges.rows,
      payments: payments.rows,
      tickets: tickets.rows,
      conversations: conversations.rows,
    };
  }

  async erasePerson(tenantId: string, personId?: string) {
    if (!personId) throw new BadRequestException('No person associated with this account');

    // Anonymize PII in place. Financial rows reference person_id but carry no
    // direct PII once the person record is scrubbed, so they remain for the
    // legally-required retention period.
    const { rowCount } = await this.db.query(
      `update people
       set full_name = '[נמחק]', id_number_encrypted = null, phone_e164 = null,
           email = null, notification_prefs = '{}'::jsonb, claim_status = 'revoked',
           deleted_at = now(), updated_at = now()
       where id = $1 and tenant_id = $2 and deleted_at is null`,
      [personId, tenantId],
    );

    // Scrub free-text the person authored in conversations.
    await this.db.query(
      `update messages set body = '[נמחק]'
       where tenant_id = $1 and sender_type = 'resident'
         and conversation_id in (select id from conversations where person_id = $2 and tenant_id = $1)`,
      [tenantId, personId],
    );

    this.logger.log(`Erasure completed for person ${personId} (tenant ${tenantId})`);
    return { ok: true, anonymized: (rowCount ?? 0) > 0 };
  }
}
