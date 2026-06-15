import { Controller, ForbiddenException, Get, Req, UseGuards } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';

/** Resident-facing "me" reads for the mobile app (SPEC §9). */
@Controller('me')
@UseGuards(SupabaseJwtGuard)
export class ResidentController {
  constructor(private readonly resident: ResidentService) {}

  @Get('home')
  home(@Req() req: AuthenticatedRequest) {
    if (!req.claims.person_id) throw new ForbiddenException();
    return this.resident.home(req.claims.tenant_id, req.claims.person_id);
  }

  @Get('charges')
  charges(@Req() req: AuthenticatedRequest) {
    if (!req.claims.person_id) throw new ForbiddenException();
    return this.resident.charges(req.claims.tenant_id, req.claims.person_id);
  }

  @Get('tickets')
  tickets(@Req() req: AuthenticatedRequest) {
    if (!req.claims.person_id) throw new ForbiddenException();
    return this.resident.tickets(req.claims.tenant_id, req.claims.person_id);
  }
}
