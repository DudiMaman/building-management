import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { NotificationsService } from '../notifications/notifications.service';
import { classifyTicket } from '@bm/ai';
import type { CreateTicket } from '@bm/shared';
import type { ServiceTicket } from '@bm/db';

/** Default SLA resolution windows (hours) by priority — SPEC §18.5. */
const SLA_HOURS: Record<string, number> = { urgent: 4, high: 24, med: 72, low: 168 };

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    private readonly db: DbService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(tenantId: string, openedByPersonId: string | null, input: CreateTicket): Promise<ServiceTicket> {
    // Auto-classify if category=other
    let category = input.category;
    let priority = input.priority;
    if (category === 'other') {
      const result = await classifyTicket(input.description ?? input.title, input.photos);
      category = result.category;
      if (priority === 'med') priority = result.priority;
    }

    const slaDueAt = new Date(Date.now() + (SLA_HOURS[priority] ?? 72) * 3600_000).toISOString();

    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<ServiceTicket>(
        `insert into service_tickets
          (tenant_id, building_id, apartment_id, opened_by_person_id, intake_channel,
           title, description, category, priority, photos, status, sla_due_at, opened_at)
         values ($1, $2, $3, $4, 'app', $5, $6, $7, $8, $9::jsonb, 'new', $10, now())
         returning *`,
        [
          tenantId,
          input.building_id,
          input.apartment_id ?? null,
          openedByPersonId,
          input.title,
          input.description ?? null,
          category,
          priority,
          JSON.stringify(input.photos),
          slaDueAt,
        ],
      );
      return rows[0]!;
    });
  }

  async list(tenantId: string, buildingId?: string, status?: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const conds: string[] = [];
      const params: any[] = [];
      if (buildingId) { params.push(buildingId); conds.push(`building_id = $${params.length}`); }
      if (status) { params.push(status); conds.push(`status = $${params.length}`); }
      const where = conds.length ? `where ${conds.join(' and ')}` : '';
      const { rows } = await c.query(
        `select * from service_tickets ${where} order by opened_at desc`,
        params,
      );
      return rows;
    });
  }

  async findOne(tenantId: string, id: string): Promise<ServiceTicket> {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<ServiceTicket>(`select * from service_tickets where id = $1`, [id]);
      if (rows.length === 0) throw new NotFoundException();
      return rows[0]!;
    });
  }

  async updateStatus(tenantId: string, id: string, status: ServiceTicket['status'], note?: string) {
    const ticket = await this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const extras: string[] = [];
      const params: any[] = [id, status];
      if (status === 'resolved') extras.push(`resolved_at = now()`);
      if (status === 'closed') extras.push(`closed_at = now()`);
      if (note) { params.push(note); extras.push(`resolution_note = $${params.length}`); }
      const setExtra = extras.length ? `, ${extras.join(', ')}` : '';
      const { rows } = await c.query<ServiceTicket>(
        `update service_tickets set status = $2 ${setExtra} where id = $1 returning *`,
        params,
      );
      if (rows.length === 0) throw new NotFoundException();
      return rows[0]!;
    });

    // Prompt the opener to rate once the ticket closes (SPEC §18.6). Best-effort.
    if (status === 'closed' && ticket.opened_by_person_id) {
      try {
        await this.notifications.notifyPerson(
          tenantId,
          ticket.opened_by_person_id,
          'ticket_satisfaction',
          { ticket_id: String(ticket.id).slice(0, 8), title: ticket.title },
          { event_key: `ticket_satisfaction:${ticket.id}` },
        );
      } catch (err) {
        this.logger.warn(`Satisfaction prompt failed for ticket ${ticket.id}: ${(err as Error).message}`);
      }
    }
    return ticket;
  }

  /**
   * Find tickets whose SLA window has elapsed without resolution (SPEC §18.5).
   * Intended for a scheduled scan that escalates breaches.
   */
  async findSlaBreaches(tenantId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<ServiceTicket>(
        `select * from service_tickets
         where sla_due_at is not null and sla_due_at < now()
           and status not in ('resolved', 'closed', 'cancelled')
         order by sla_due_at asc`,
      );
      return rows;
    });
  }

  async rate(tenantId: string, id: string, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) throw new Error('rating 1-5');
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'resident' }, async (c) => {
      await c.query(`update service_tickets set satisfaction_rating = $2 where id = $1`, [id, rating]);
      if (comment) {
        await c.query(
          `insert into ticket_comments (tenant_id, ticket_id, body, visibility) values ($1, $2, $3, 'resident')`,
          [tenantId, id, comment],
        );
      }
      return { ok: true };
    });
  }
}
