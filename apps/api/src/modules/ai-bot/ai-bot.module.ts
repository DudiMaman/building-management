import { Module } from '@nestjs/common';
import { AiBotController, AiBotSettingsController } from './ai-bot.controller';
import { AiBotService } from './ai-bot.service';
import { ApartmentsModule } from '../apartments/apartments.module';
import { TicketsModule } from '../tickets/tickets.module';
import { KbModule } from '../kb/kb.module';

@Module({
  imports: [ApartmentsModule, TicketsModule, KbModule],
  controllers: [AiBotController, AiBotSettingsController],
  providers: [AiBotService],
  exports: [AiBotService],
})
export class AiBotModule {}
