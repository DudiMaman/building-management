import { Module } from '@nestjs/common';
import { BulletinController } from './bulletin.controller';
import { BulletinService } from './bulletin.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BulletinController],
  providers: [BulletinService],
  exports: [BulletinService],
})
export class BulletinModule {}
