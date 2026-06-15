import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TranzilaAdapter } from './tranzila.adapter';
import { TranzilaMockAdapter } from './tranzila.mock';
import { TranzilaWebhookController } from './tranzila.webhook';
import { InvoicingModule } from '../invoicing/invoicing.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [InvoicingModule, NotificationsModule],
  controllers: [PaymentsController, TranzilaWebhookController],
  providers: [
    PaymentsService,
    {
      provide: TranzilaAdapter,
      useFactory: () => {
        if (process.env.TRANZILA_MODE === 'mock' || !process.env.TRANZILA_SUPPLIER) {
          return new TranzilaMockAdapter();
        }
        return new TranzilaAdapter();
      },
    },
  ],
  exports: [PaymentsService, TranzilaAdapter],
})
export class PaymentsModule {}
