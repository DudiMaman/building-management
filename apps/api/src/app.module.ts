import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { HealthController } from './health.controller';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { ApartmentsModule } from './modules/apartments/apartments.module';
import { PeopleModule } from './modules/people/people.module';
import { WorkersModule } from './modules/workers/workers.module';
import { BillingModule } from './modules/billing/billing.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InvoicingModule } from './modules/invoicing/invoicing.module';
import { ChecksModule } from './modules/checks/checks.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { BulletinModule } from './modules/bulletin/bulletin.module';
import { PollsModule } from './modules/polls/polls.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { AiBotModule } from './modules/ai-bot/ai-bot.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { FilesModule } from './modules/files/files.module';
import { AddonsModule } from './modules/addons/addons.module';
import { AccessModule } from './modules/access/access.module';
import { FlyersModule } from './modules/flyers/flyers.module';
import { LeadsModule } from './modules/leads/leads.module';
import { KbModule } from './modules/kb/kb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.token',
            'req.body.card',
            'res.headers["set-cookie"]',
          ],
          censor: '[REDACTED]',
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { translateTime: 'SYS:HH:MM:ss.l', singleLine: true } }
            : undefined,
        customLogLevel: (_req, res, err) => {
          if (err || res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    DbModule,
    AuthModule,
    TenantsModule,
    BuildingsModule,
    ApartmentsModule,
    PeopleModule,
    WorkersModule,
    BillingModule,
    PaymentsModule,
    InvoicingModule,
    ChecksModule,
    TicketsModule,
    TasksModule,
    DocumentsModule,
    VendorsModule,
    BulletinModule,
    PollsModule,
    WhatsAppModule,
    AiBotModule,
    NotificationsModule,
    ReportsModule,
    AuditModule,
    FilesModule,
    AddonsModule,
    AccessModule,
    FlyersModule,
    LeadsModule,
    KbModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
