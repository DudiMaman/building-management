import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { Roles, RolesGuard } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(SupabaseJwtGuard, RolesGuard)
@Roles('mgmt_admin', 'mgmt_member')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('collection-rate')
  collectionRate(@Req() req: AuthenticatedRequest, @Query('building_id') buildingId?: string) {
    return this.reports.collectionRate(req.claims.tenant_id, buildingId);
  }

  @Get('ar-aging')
  arAging(@Req() req: AuthenticatedRequest, @Query('building_id') buildingId?: string) {
    return this.reports.arAging(req.claims.tenant_id, buildingId);
  }

  @Get('open-tickets')
  openTickets(@Req() req: AuthenticatedRequest, @Query('building_id') buildingId?: string) {
    return this.reports.openTickets(req.claims.tenant_id, buildingId);
  }

  @Get('per-person-ar')
  perPersonAr(@Req() req: AuthenticatedRequest) {
    return this.reports.perPersonAr(req.claims.tenant_id);
  }
}
