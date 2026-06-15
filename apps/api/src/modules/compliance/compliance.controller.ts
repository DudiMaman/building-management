import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { ComplianceService } from './compliance.service';

/**
 * Data-subject rights for the authenticated person (SPEC §24.2).
 *   GET    /v1/me/export — download everything we hold about you.
 *   DELETE /v1/me/erase  — right to erasure (PII anonymized; tax records kept).
 */
@Controller('me')
@UseGuards(SupabaseJwtGuard)
export class ComplianceController {
  constructor(private readonly compliance: ComplianceService) {}

  @Get('export')
  export(@Req() req: AuthenticatedRequest) {
    return this.compliance.exportPerson(req.claims.tenant_id, req.claims.person_id);
  }

  @Delete('erase')
  erase(@Req() req: AuthenticatedRequest) {
    return this.compliance.erasePerson(req.claims.tenant_id, req.claims.person_id);
  }
}
