/**
 * BullMQ queue infrastructure.
 *
 * - Registers all queues so producers can @InjectQueue() them.
 * - Connection points at REDIS_URL.
 * - Workers are registered separately in queues.workers.module.ts and
 *   only bootstrapped in the worker process (main.worker.ts), not in
 *   the web API.
 */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from './queues';

const parseRedisUrl = (url: string) => {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: Number(u.port || 6379),
      password: u.password || undefined,
      username: u.username || undefined,
    };
  } catch {
    return { host: '127.0.0.1', port: 6379 };
  }
};

@Module({
  imports: [
    BullModule.forRoot({
      connection: parseRedisUrl(process.env.REDIS_URL ?? 'redis://localhost:6379'),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 500, age: 60 * 60 * 24 },
        removeOnFail: { count: 200, age: 60 * 60 * 24 * 7 },
      },
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAMES.billing },
      { name: QUEUE_NAMES.dunning },
      { name: QUEUE_NAMES.notifications },
      { name: QUEUE_NAMES.documents },
      { name: QUEUE_NAMES.files },
    ),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
