/**
 * Cron-driven job scheduler.
 *
 * Lives in the worker process (not the web API) so the cron only fires
 * once per fleet. Pushes work onto BullMQ queues which then fan out to
 * the worker processors above.
 *
 * Timezone is Asia/Jerusalem per SPEC.
 */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { QUEUE_NAMES } from './queues';

const TIMEZONE = 'Asia/Jerusalem';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.billing) private readonly billing: Queue,
    @InjectQueue(QUEUE_NAMES.dunning) private readonly dunning: Queue,
    @InjectQueue(QUEUE_NAMES.documents) private readonly documents: Queue,
  ) {}

  /** 02:00 every day — generate the day's charges across all tenants. */
  @Cron('0 2 * * *', { timeZone: TIMEZONE, name: 'billing.run-due-schedules' })
  async runDueBilling() {
    await this.billing.add(
      'run-due-schedules',
      { asOfDate: new Date().toISOString().slice(0, 10) },
      { jobId: `billing-due-${new Date().toISOString().slice(0, 10)}` },
    );
    this.logger.log('Enqueued billing.run-due-schedules');
  }

  /** 03:00 every day — advance overdue charges through the dunning stages. */
  @Cron('0 3 * * *', { timeZone: TIMEZONE, name: 'dunning.run' })
  async runDunning() {
    await this.dunning.add(
      'run',
      {},
      { jobId: `dunning-${new Date().toISOString().slice(0, 10)}` },
    );
    this.logger.log('Enqueued dunning.run');
  }

  /** 04:00 every day — scan documents in their reminder window → renewal tasks. */
  @Cron('0 4 * * *', { timeZone: TIMEZONE, name: 'documents.scan-expiries' })
  async runDocumentExpiryScan() {
    await this.documents.add(
      'scan-expiries',
      {},
      { jobId: `doc-expiry-${new Date().toISOString().slice(0, 10)}` },
    );
    this.logger.log('Enqueued documents.scan-expiries');
  }

  /** On boot, log the upcoming schedule so ops can verify the worker is alive. */
  @Cron(CronExpression.EVERY_HOUR, { name: 'scheduler.heartbeat' })
  heartbeat() {
    this.logger.debug('worker heartbeat ok');
  }
}
