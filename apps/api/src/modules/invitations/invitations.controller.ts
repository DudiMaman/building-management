import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { Roles, RolesGuard } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Post()
  @UseGuards(SupabaseJwtGuard, RolesGuard)
  @Roles('mgmt_admin')
  create(@Req() req: AuthenticatedRequest, @Body() body: any) {
    return this.invitations.create(req.claims.tenant_id, body);
  }

  @Get()
  @UseGuards(SupabaseJwtGuard, RolesGuard)
  @Roles('mgmt_admin')
  list(@Req() req: AuthenticatedRequest) {
    return this.invitations.list(req.claims.tenant_id);
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard, RolesGuard)
  @Roles('mgmt_admin')
  revoke(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.invitations.revoke(req.claims.tenant_id, id);
  }

  /** Public: redeemed by the invitee after they sign up in Supabase Auth. */
  @Public()
  @Post('accept')
  accept(@Body() body: { token: string; supabase_user_id: string; full_name: string; phone_e164?: string }) {
    return this.invitations.accept(body);
  }
}
