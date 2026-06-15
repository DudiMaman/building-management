import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { Roles, RolesGuard } from '../auth/roles.decorator';

@Controller('whatsapp')
@UseGuards(SupabaseJwtGuard, RolesGuard)
@Roles('mgmt_admin', 'mgmt_member')
export class WhatsAppController {
  constructor(private readonly wa: WhatsAppService) {}

  @Get('conversations')
  listConversations(@Req() req: AuthenticatedRequest, @Query('status') status?: string) {
    return this.wa.listConversations(req.claims.tenant_id, status);
  }

  @Get('conversations/:id/messages')
  getMessages(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.wa.getMessages(req.claims.tenant_id, id);
  }

  @Post('send-text')
  sendText(@Req() _req: AuthenticatedRequest, @Body() body: { to: string; body: string }) {
    return this.wa.sendText(body.to, body.body);
  }

  @Post('send-template')
  sendTemplate(
    @Req() _req: AuthenticatedRequest,
    @Body() body: { to: string; template_key: string; vars: Record<string, string> },
  ) {
    return this.wa.sendTemplate(body.to, body.template_key, body.vars);
  }
}
