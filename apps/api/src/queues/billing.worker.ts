/**
 * BullMQ worker for billing jobs.
 *
 * Two job types per the SPEC §11:
 *   - billing.run-due-schedules: nightly cron (02:00 Asia/Jerusalem)
 *     iterates every active schedule due today and produces charges.
 *   - billing.run-cycle: triggered by mgmt from the admin UI for a
 *     specific schedule (single-tenant ad-hoc run).
 */
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { BillingService } from '../modules/billing/billing.service';
import { DbService } from '../db/db.service';
import {
  QUEUE_NAMES,
  type BillingRunSchedulesJob,
  type BillingRunCycleJob,
} from './queues';

const RUN_DUE = 'run-due-schedules';
const RUN_CYCLE = 'run-cycle';

@Processor(QUEUE_NAMES.billing)
export class BillingWorker extends WorkerHost {
  private readonly logger = new Logger(BillingWorker.name);

  constructor(
    private readonly billing: BillingService,
    private readonly db: DbService,
  ) {
    super();
  }

  override async process(job: Job<BillingRunSchedulesJob | BillingRunCycleJob>): Promise<unknown> {
    switch (job.name) {
      case RUN_DUE:
        return this.runDueSchedules(job.data as BillingRunSchedulesJob);
      case RUN_CYCLE:
        return this.runCycle(job.data as BillingRunCycleJob);
      default:
        this.logger.warn(`Unknown billing job: ${job.name}`);
        return null;
    }
  }

  private async runDueSchedules(data: BillingRunSchedulesJob) {
    const asOf = data.asOfDate ? new Date(data.asOfDate) : new Date();
    const dayOfMonth = asOf.getDate();
    const isoDate = asOf.toISOString().slice(0, 10);

    // Fetch every active schedule whose day_of_month matches today.
    // tenantId scope: when specified narrow to that tenant.
    const schedules = await this.db.query<{ id: string; tenant_id: string }>(
      `select id, tenant_id from charge_schedules
        where status = 'active'
          and start_date <= $1
          and (end_date is null or end_date >= $1)
          and (
            (cadence = 'monthly' and day_of_month = $2) or
            (cadence = 'quarterly' and day_of_month = $2
               and extract(month from $1::date) in (1, 4, 7, 10)) or
            (cadence = 'annual' and day_of_month = $2
               and extract(month from $1::date) = 1) or
            (cadence = 'one_off' and start_date = $1::date)
          )
          ${data.tenantId ? 'and tenant_id = $3' : ''}`,
      data.tenantId ? [isoDate, dayOfMonth, data.tenantId] : [isoDate, dayOfMonth],
    );

    let chargesCreated = 0;
    for (const s of schedules.rows) {
      const result = await this.billing.runCycle(s.tenant_id, s.id, asOf);
      chargesCreated += result.total;
    }
    this.logger.log(
      `billing.${RUN_DUE} asOf=${isoDate} schedules=${schedules.rows.length} charges=${chargesCreated}`,
    );
    return { schedules: schedules.rows.length, charges: chargesCreated };
  }

  private async runCycle(data: BillingRunCycleJob) {
    const result = await this.billing.runCycle(
      data.tenantId,
      data.scheduleId,
      new Date(data.dueDate),
    );
    this.logger.log(
      `billing.${RUN_CYCLE} tenant=${data.tenantId} schedule=${data.scheduleId} charges=${result.total}`,
    );
    return result;
  }
}
