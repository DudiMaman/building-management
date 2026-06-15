import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ExpoPushSender } from './senders/expo-push.sender';
import { ResendEmailSender } from './senders/resend-email.sender';
import { InforuSmsSender } from './senders/inforu-sms.sender';
import { WhatsappNotifSender } from './senders/whatsapp.sender';

@Module({
  providers: [NotificationsService, ExpoPushSender, ResendEmailSender, InforuSmsSender, WhatsappNotifSender],
  exports: [NotificationsService],
})
export class NotificationsModule {}
