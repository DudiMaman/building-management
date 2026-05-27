/**
 * Worker process bootstrap.
 *
 * Separate entrypoint from main.ts (the web API). Run with:
 *   node dist/main.worker.js
 * The worker holds:
 *   - BullMQ workers (billing, dunning, ...)
 *   - The cron scheduler (Asia/Jerusalem) that enqueues nightly jobs
 *
 * No HTTP server — this is a headless background process. Deploy as a
 * separate Fly machine / Railway service from the web API.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { QueueWorkersModule } from './queues/queues.workers.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(QueueWorkersModule, {
    logger: ['log', 'warn', 'error', 'verbose', 'debug'],
  });
  Logger.log('Worker process started', 'WorkerBootstrap');

  const shutdown = async (signal: string) => {
    Logger.log(`Received ${signal}, draining workers...`, 'WorkerBootstrap');
    await app.close();
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  Logger.error('Worker bootstrap failed', err, 'WorkerBootstrap');
  process.exit(1);
});
