/**
 * ResidentService — resident-facing "me" reads for the mobile app (SPEC §9).
 * Everything is scoped to the authenticated person.
 */
import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class ResidentService {
  constructor(private readonly db: DbService) {}

  /** The resident's home context: building, balance, open ticket count. */
  async home(tenantId: string, personId: string) {
    const ctx = await this.db.query<{
      building_id: string | null;
      building_name: string | null;
      apartment_id: string | null;
      apartment_unit: string | null;
    }>(
      `select a.building_id, b.name as building_name, a.id as apartment_id, a.unit_number as apartment_unit
       from apartment_assignments aa
       join apartments a on a.id = aa.apartment_id
       join buildings b on b.id = a.building_id
       where aa.tenant_id = $1 and aa.person_id = $2 and aa.status = 'active'
       order by aa.is_primary desc
       limit 1`,
      [tenantId, personId],
    );
    const balance = await this.db.query<{ outstanding: string; open_charges: string }>(
      `select coalesce(sum(amount - paid_amount), 0)::text as outstanding,
              count(*)::text as open_charges
       from charges
       where tenant_id = $1 and billed_to_person_id = $2
         and status in ('pending','partial','overdue')`,
      [tenantId, personId],
    );
    const tickets = await this.db.query<{ open: string }>(
      `select count(*)::text as open from service_tickets
       where tenant_id = $1 and opened_by_person_id = $2
         and status not in ('resolved','closed','cancelled')`,
      [tenantId, personId],
    );
    return {
      ...(ctx.rows[0] ?? { building_id: null, building_name: null, apartment_id: null, apartment_unit: null }),
      outstanding: balance.rows[0]?.outstanding ?? '0',
      open_charges: Number(balance.rows[0]?.open_charges ?? 0),
      open_tickets: Number(tickets.rows[0]?.open ?? 0),
    };
  }

  /** Charges billed to the resident. */
  async charges(tenantId: string, personId: string) {
    const { rows } = await this.db.query(
      `select id, description, amount, paid_amount, currency, due_date, status
       from charges
       where tenant_id = $1 and billed_to_person_id = $2
       order by due_date desc nulls last`,
      [tenantId, personId],
    );
    return rows;
  }

  /** Tickets the resident opened. */
  async tickets(tenantId: string, personId: string) {
    const { rows } = await this.db.query(
      `select id, title, category, priority, status, opened_at, satisfaction_rating
       from service_tickets
       where tenant_id = $1 and opened_by_person_id = $2
       order by opened_at desc`,
      [tenantId, personId],
    );
    return rows;
  }
}
