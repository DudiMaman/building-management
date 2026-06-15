/**
 * ReportsService — financial + operational aggregations.
 * See SPEC §22.
 *
 * All queries run within the tenant's RLS context.
 */
import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class ReportsService {
  constructor(private readonly db: DbService) {}

  async collectionRate(tenantId: string, buildingId?: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const params: unknown[] = [];
      let where = '';
      if (buildingId) {
        params.push(buildingId);
        where = `where building_id = $${params.length}`;
      }
      const { rows } = await c.query(
        `select
           coalesce(sum(amount), 0)::text as billed,
           coalesce(sum(paid_amount), 0)::text as paid,
           count(*) as charge_count,
           count(*) filter (where status = 'paid') as paid_count,
           count(*) filter (where status = 'overdue') as overdue_count
         from charges
         ${where}`,
        params,
      );
      const row = rows[0] as { billed: string; paid: string; charge_count: string; paid_count: string; overdue_count: string };
      const billed = Number(row?.billed ?? 0);
      const paid = Number(row?.paid ?? 0);
      const rate = billed > 0 ? paid / billed : 0;
      return {
        billed: row?.billed ?? '0',
        paid: row?.paid ?? '0',
        rate,
        charge_count: Number(row?.charge_count ?? 0),
        paid_count: Number(row?.paid_count ?? 0),
        overdue_count: Number(row?.overdue_count ?? 0),
      };
    });
  }

  async arAging(tenantId: string, buildingId?: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const params: unknown[] = [];
      let where = `where status in ('pending','partial','overdue')`;
      if (buildingId) {
        params.push(buildingId);
        where += ` and building_id = $${params.length}`;
      }
      const { rows } = await c.query(
        `select
           sum(case when current_date - due_date <= 30 then amount - paid_amount else 0 end)::text as bucket_0_30,
           sum(case when current_date - due_date between 31 and 60 then amount - paid_amount else 0 end)::text as bucket_31_60,
           sum(case when current_date - due_date between 61 and 90 then amount - paid_amount else 0 end)::text as bucket_61_90,
           sum(case when current_date - due_date > 90 then amount - paid_amount else 0 end)::text as bucket_90_plus
         from charges
         ${where}`,
        params,
      );
      return (
        rows[0] ?? {
          bucket_0_30: '0',
          bucket_31_60: '0',
          bucket_61_90: '0',
          bucket_90_plus: '0',
        }
      );
    });
  }

  async openTickets(tenantId: string, buildingId?: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const params: unknown[] = [];
      let where = `where status not in ('resolved','closed')`;
      if (buildingId) {
        params.push(buildingId);
        where += ` and building_id = $${params.length}`;
      }
      const { rows } = await c.query(
        `select
           count(*) as total,
           count(*) filter (where priority = 'urgent') as urgent,
           count(*) filter (where priority = 'high') as high,
           count(*) filter (where sla_due_at < now()) as sla_breached
         from service_tickets
         ${where}`,
        params,
      );
      return rows[0] ?? { total: 0, urgent: 0, high: 0, sla_breached: 0 };
    });
  }

  async perPersonAr(tenantId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select
           p.id as person_id,
           p.full_name,
           coalesce(sum(c.amount - c.paid_amount), 0)::text as outstanding,
           count(c.id) filter (where c.status in ('pending','partial','overdue')) as open_charges
         from people p
         left join charges c
           on c.billed_to_person_id = p.id
          and c.status in ('pending','partial','overdue')
         group by p.id, p.full_name
         having coalesce(sum(c.amount - c.paid_amount), 0) > 0
         order by outstanding::numeric desc
         limit 200`,
      );
      return rows;
    });
  }

  /** Monthly cash flow: billed vs collected over the last N months (SPEC §22.2). */
  async cashFlow(tenantId: string, months = 12) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `with billed as (
           select to_char(date_trunc('month', due_date), 'YYYY-MM') as month,
                  sum(amount) as billed
           from charges
           where due_date >= date_trunc('month', current_date) - ($1 || ' months')::interval
           group by 1
         ),
         collected as (
           select to_char(date_trunc('month', captured_at), 'YYYY-MM') as month,
                  sum(amount) as collected
           from payments
           where status = 'captured'
             and captured_at >= date_trunc('month', current_date) - ($1 || ' months')::interval
           group by 1
         )
         select coalesce(b.month, c.month) as month,
                coalesce(b.billed, 0)::text as billed,
                coalesce(c.collected, 0)::text as collected
         from billed b
         full outer join collected c on c.month = b.month
         order by month`,
        [String(months)],
      );
      return rows;
    });
  }

  /** Worker productivity: completed tasks, avg minutes, total cost (SPEC §22.1). */
  async workerProductivity(tenantId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select
           w.id as worker_id,
           w.full_name,
           count(t.id) filter (where t.status = 'done') as completed,
           count(t.id) filter (where t.status not in ('done','cancelled')) as open,
           coalesce(round(avg(t.time_spent_minutes) filter (where t.status = 'done')), 0) as avg_minutes,
           coalesce(sum(t.cost_amount) filter (where t.status = 'done'), 0)::text as total_cost
         from maintenance_workers w
         left join tasks t on t.assigned_worker_id = w.id and t.tenant_id = w.tenant_id
         where w.status = 'active'
         group by w.id, w.full_name
         order by completed desc`,
      );
      return rows;
    });
  }

  /** Addon revenue + commission owed (SPEC §19.3 / §22.2). */
  async addonRevenue(tenantId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select
           pr.name as product_name,
           count(o.id) as orders,
           coalesce(sum(o.total), 0)::text as revenue,
           coalesce(round(sum(o.total * pr.commission_pct / 100.0), 2), 0)::text as commission
         from addon_orders o
         join addon_products pr on pr.id = o.product_id
         where o.fulfillment_status <> 'cancelled'
         group by pr.name
         order by revenue::numeric desc`,
      );
      return rows;
    });
  }

  /**
   * Serialize report rows to CSV with a UTF-8 BOM so Excel renders Hebrew
   * correctly (SPEC §22.4). Columns are inferred from the first row.
   */
  toCsv(rows: Array<Record<string, unknown>>): string {
    if (rows.length === 0) return '﻿';
    const cols = Object.keys(rows[0]!);
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = cols.join(',');
    const body = rows.map((r) => cols.map((col) => escape(r[col])).join(',')).join('\n');
    return `﻿${header}\n${body}`;
  }
}
