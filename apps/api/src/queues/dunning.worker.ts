/**
 * BullMQ worker for dunning escalation (SPEC §11.4).
 * Runs daily for every tenant — `runForTenant` walks active overdue
 * charges and advances their stage.
 */
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { DunningService } from '../modules/billing/dunning.service';
import { DbService } from '../db/db.service';
import { QUEUE_NAMES, type DunningRunJob } from './queues';

@Processor(QUEUE_NAMES.dunning)
export class DunningWorker extends WorkerHost {
  private readonly logger = new Logger(DunningWorker.name);

  constructor(
    private readonly dunning: DunningService,
    private readonly db: DbService,
  ) {
    super();
  }

  override async process(job: Job<DunningRunJob>): Promise<unknown> {
    const tenants = job.data.tenantId
      ? [{ id: job.data.tenantId }]
      : (await this.db.query<{ id: string }>(`select id from tenants where status = 'active'`)).rows;

    let totalReviewed = 0;
    let totalAdvanced = 0;
    for (const t of tenants) {
      const result = await this.dunning.runForTenant(t.id);
      totalReviewed += result.reviewed;
      totalAdvanced += result.advanced;
    }
    this.logger.log(`dunning.run tenants=${tenants.length} reviewed=${totalReviewed} advanced=${totalAdvanced}`);
    return { tenants: tenants.length, reviewed: totalReviewed, advanced: totalAdvanced };
  }
}
