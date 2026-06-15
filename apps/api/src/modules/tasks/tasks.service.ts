import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import type { Task } from '@bm/db';

@Injectable()
export class TasksService {
  constructor(private readonly db: DbService) {}

  async create(
    tenantId: string,
    input: {
      building_id: string;
      apartment_id?: string;
      title: string;
      description_md?: string;
      category?: string;
      priority?: 'low' | 'med' | 'high' | 'urgent';
      assigned_worker_id?: string;
      scheduled_at?: string;
      source?: 'planned' | 'ticket' | 'adhoc';
      source_ticket_id?: string;
      customer_visible?: boolean;
    },
  ): Promise<Task> {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<Task>(
        `insert into tasks
          (tenant_id, building_id, apartment_id, source, source_ticket_id, title, description_md,
           category, priority, assigned_worker_id, scheduled_at, customer_visible)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         returning *`,
        [
          tenantId,
          input.building_id,
          input.apartment_id ?? null,
          input.source ?? 'adhoc',
          input.source_ticket_id ?? null,
          input.title,
          input.description_md ?? null,
          input.category ?? 'other',
          input.priority ?? 'med',
          input.assigned_worker_id ?? null,
          input.scheduled_at ?? null,
          input.customer_visible ?? true,
        ],
      );
      return rows[0]!;
    });
  }

  async list(tenantId: string, params: { worker_id?: string; building_id?: string; status?: string } = {}) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const conds: string[] = [];
      const sqlParams: any[] = [];
      if (params.worker_id) { sqlParams.push(params.worker_id); conds.push(`assigned_worker_id = $${sqlParams.length}`); }
      if (params.building_id) { sqlParams.push(params.building_id); conds.push(`building_id = $${sqlParams.length}`); }
      if (params.status) { sqlParams.push(params.status); conds.push(`status = $${sqlParams.length}`); }
      const where = conds.length ? `where ${conds.join(' and ')}` : '';
      const { rows } = await c.query<Task>(
        `select * from tasks ${where} order by scheduled_at nulls last, priority desc`,
        sqlParams,
      );
      return rows;
    });
  }

  async updateStatus(tenantId: string, id: string, status: Task['status']) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const setExtra: string[] = [];
      if (status === 'in_progress') setExtra.push(`started_at = coalesce(started_at, now())`);
      if (status === 'done') setExtra.push(`completed_at = now()`);
      const extra = setExtra.length ? `, ${setExtra.join(', ')}` : '';
      const { rows } = await c.query<Task>(
        `update tasks set status = $2 ${extra} where id = $1 returning *`,
        [id, status],
      );
      if (rows.length === 0) throw new NotFoundException();
      return rows[0]!;
    });
  }

  /**
   * Auto-assign a task to the best-fit worker (SPEC §17.3): prefer an active
   * worker whose skills include the task category, breaking ties by the
   * lightest current open-task load (round-robin). Falls back to any active
   * worker when none has the skill. No-op if already assigned. Returns the
   * updated task, or null when there are no workers.
   */
  async autoAssign(tenantId: string, taskId: string): Promise<Task | null> {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const taskRes = await c.query<{ category: string; assigned_worker_id: string | null }>(
        `select category, assigned_worker_id from tasks where id = $1`,
        [taskId],
      );
      if (taskRes.rows.length === 0) throw new NotFoundException();
      const task = taskRes.rows[0]!;
      if (task.assigned_worker_id) {
        const cur = await c.query<Task>(`select * from tasks where id = $1`, [taskId]);
        return cur.rows[0]!;
      }

      const pick = async (skillFilter: boolean) => {
        const params: any[] = [tenantId];
        let skillClause = '';
        if (skillFilter) {
          params.push(task.category);
          skillClause = `and w.skills ? $${params.length}`;
        }
        const { rows } = await c.query<{ id: string }>(
          `select w.id,
                  count(tk.id) filter (where tk.status not in ('done', 'cancelled')) as load
           from maintenance_workers w
           left join tasks tk on tk.assigned_worker_id = w.id and tk.tenant_id = w.tenant_id
           where w.tenant_id = $1 and w.status = 'active' ${skillClause}
           group by w.id
           order by load asc
           limit 1`,
          params,
        );
        return rows[0]?.id;
      };

      const workerId = (await pick(true)) ?? (await pick(false));
      if (!workerId) return null;

      const { rows } = await c.query<Task>(
        `update tasks set assigned_worker_id = $2, updated_at = now() where id = $1 returning *`,
        [taskId, workerId],
      );
      return rows[0]!;
    });
  }

  async assign(tenantId: string, id: string, workerId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<Task>(
        `update tasks set assigned_worker_id = $2, status = case when status = 'todo' then 'todo' else status end where id = $1 returning *`,
        [id, workerId],
      );
      if (rows.length === 0) throw new NotFoundException();
      return rows[0]!;
    });
  }
}
