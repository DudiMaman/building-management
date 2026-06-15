import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { Roles, RolesGuard } from '../auth/roles.decorator';
import { TEMPLATES } from '@bm/shared';

@Controller('notifications')
@UseGuards(SupabaseJwtGuard, RolesGuard)
@Roles('mgmt_admin', 'mgmt_member')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  /** Recent delivery log for the tenant. */
  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('limit') limit?: string) {
    return this.notifications.listRecent(req.claims.tenant_id, limit ? Number(limit) : 100);
  }

  /** The notification template catalog (key/channel/locale). */
  @Get('templates')
  templates() {
    return TEMPLATES.map((t) => ({
      key: t.key,
      channel: t.channel,
      locale: t.locale,
      subject: t.subject ?? null,
    }));
  }
}
