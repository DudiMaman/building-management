import { Controller, ForbiddenException, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';

/**
 * Resident-facing document access (SPEC §39.4/§39.6). Returns only documents
 * the authenticated resident is entitled to see in a building, per graded
 * visibility + explicit ACL grants. Distinct from the mgmt-only controller.
 */
@Controller('me/documents')
@UseGuards(SupabaseJwtGuard)
export class ResidentDocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('building_id') buildingId: string) {
    if (!req.claims.person_id) throw new ForbiddenException();
    return this.docs.listForResident(req.claims.tenant_id, req.claims.person_id, buildingId);
  }
}
