import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { AssignmentService } from './assignment.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import {
  CreateApartmentSchema,
  CreateAssignmentSchema,
  CreateRentalContractSchema,
} from '@bm/shared';
import { ZodPipe } from '../../common/zod.pipe';

@Controller('apartments')
@UseGuards(SupabaseJwtGuard)
export class ApartmentsController {
  constructor(
    private readonly apartments: ApartmentsService,
    private readonly assignments: AssignmentService,
  ) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body(new ZodPipe(CreateApartmentSchema)) body: any,
  ) {
    return this.apartments.create(req.claims.tenant_id, body);
  }

  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('building_id') buildingId?: string) {
    return this.apartments.list(req.claims.tenant_id, buildingId);
  }

  // ---- Literal sub-routes (must come before :id catches) ----

  @Get('rental-contracts')
  listRentalContracts(@Req() req: AuthenticatedRequest, @Query('apartment_id') apartmentId?: string) {
    return this.apartments.listRentalContracts(req.claims.tenant_id, apartmentId);
  }

  @Post('rental-contracts')
  createRentalContract(
    @Req() req: AuthenticatedRequest,
    @Body(new ZodPipe(CreateRentalContractSchema)) body: any,
  ) {
    return this.apartments.createRentalContract(req.claims.tenant_id, body);
  }

  @Post('assignments')
  addAssignment(
    @Req() req: AuthenticatedRequest,
    @Body(new ZodPipe(CreateAssignmentSchema)) body: any,
  ) {
    return this.apartments.addAssignment(req.claims.tenant_id, body);
  }

  // ---- :id routes ----

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.apartments.findOne(req.claims.tenant_id, id);
  }

  @Get(':id/assignments')
  listAssignments(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.assignments.listCurrent(req.claims.tenant_id, id);
  }
}
