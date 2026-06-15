import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AiBotService } from './ai-bot.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { Roles, RolesGuard } from '../auth/roles.decorator';

@Controller('bot/conversations/:id')
@UseGuards(SupabaseJwtGuard)
export class AiBotController {
  constructor(private readonly bot: AiBotService) {}

  @Post('messages')
  send(
    @Req() req: AuthenticatedRequest,
    @Param('id') conversationId: string,
    @Body() body: { text: string },
  ) {
    return this.bot.respond(req.claims.tenant_id, conversationId, body.text);
  }
}

/** Per-tenant bot tuning (SPEC §14.8). */
@Controller('ai-bot')
@UseGuards(SupabaseJwtGuard, RolesGuard)
@Roles('mgmt_admin', 'mgmt_member')
export class AiBotSettingsController {
  constructor(private readonly bot: AiBotService) {}

  @Get('settings')
  get(@Req() req: AuthenticatedRequest) {
    return this.bot.getSettings(req.claims.tenant_id);
  }

  @Put('settings')
  update(
    @Req() req: AuthenticatedRequest,
    @Body() body: { tone?: string; custom_rules?: string; enabled?: boolean },
  ) {
    return this.bot.updateSettings(req.claims.tenant_id, body);
  }
}
