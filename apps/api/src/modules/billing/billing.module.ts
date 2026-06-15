import { Module } from '@nestjs/common';
import { BillingController, ChargesController } from './billing.controller';
import { BillingService } from './billing.service';
import { DunningService } from './dunning.service';
import { ApartmentsModule } from '../apartments/apartments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ApartmentsModule, NotificationsModule],
  controllers: [BillingController, ChargesController],
  providers: [BillingService, DunningService],
  exports: [BillingService, DunningService],
})
export class BillingModule {}
