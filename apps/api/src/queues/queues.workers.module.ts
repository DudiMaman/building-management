/**
 * Workers module — only imported in main.worker.ts, NOT in the web API.
 *
 * Each worker depends on the matching domain module (BillingModule,
 * DunningService comes via BillingModule, etc.) and on the QueuesModule
 * for the BullMQ connection.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { QueuesModule } from './queues.module';
import { BillingWorker } from './billing.worker';
import { DunningWorker } from './dunning.worker';
import { DocumentsWorker } from './documents.worker';
import { SchedulerService } from './scheduler.service';
import { DbModule } from '../db/db.module';
import { BillingModule } from '../modules/billing/billing.module';
import { DocumentsModule } from '../modules/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    ScheduleModule.forRoot(),
    QueuesModule,
    DbModule,
    BillingModule,
    DocumentsModule,
  ],
  providers: [BillingWorker, DunningWorker, DocumentsWorker, SchedulerService],
})
export class QueueWorkersModule {}
