/**
 * BullMQ worker for the document-expiry scan (SPEC §39.7).
 * Runs daily for every active tenant — `scanExpiries` creates a one-off
 * renewal task for each document inside its reminder window.
 */
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { DocumentsService } from '../modules/documents/documents.service';
import { DbService } from '../db/db.service';
import { QUEUE_NAMES, type DocumentsScanExpiriesJob } from './queues';

@Processor(QUEUE_NAMES.documents)
export class DocumentsWorker extends WorkerHost {
  private readonly logger = new Logger(DocumentsWorker.name);

  constructor(
    private readonly documents: DocumentsService,
    private readonly db: DbService,
  ) {
    super();
  }

  override async process(job: Job<DocumentsScanExpiriesJob>): Promise<unknown> {
    const tenants = job.data.tenantId
      ? [{ id: job.data.tenantId }]
      : (await this.db.query<{ id: string }>(`select id from tenants where status = 'active'`)).rows;

    let scanned = 0;
    let tasksCreated = 0;
    for (const t of tenants) {
      const result = await this.documents.scanExpiries(t.id);
      scanned += result.scanned;
      tasksCreated += result.tasks_created;
    }
    this.logger.log(`documents.scan-expiries tenants=${tenants.length} scanned=${scanned} tasks=${tasksCreated}`);
    return { tenants: tenants.length, scanned, tasksCreated };
  }
}
