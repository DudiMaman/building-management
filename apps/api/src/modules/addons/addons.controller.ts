import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AddonsService } from './addons.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';

@Controller('addons')
@UseGuards(SupabaseJwtGuard)
export class AddonsController {
  constructor(private readonly addons: AddonsService) {}

  @Post('products')
  createProduct(@Req() req: AuthenticatedRequest, @Body() body: any) {
    if (req.claims.role === 'resident') throw new ForbiddenException();
    return this.addons.createProduct(req.claims.tenant_id, body);
  }

  @Get('products')
  list(@Req() req: AuthenticatedRequest, @Query('building_id') buildingId: string) {
    return this.addons.listForBuilding(req.claims.tenant_id, buildingId);
  }

  @Post('orders')
  order(@Req() req: AuthenticatedRequest, @Body() body: any) {
    if (!req.claims.person_id) throw new ForbiddenException();
    return this.addons.order(req.claims.tenant_id, req.claims.person_id, body);
  }

  @Get('orders')
  listOrders(@Req() req: AuthenticatedRequest, @Query('status') status?: string) {
    if (req.claims.role === 'resident') throw new ForbiddenException();
    return this.addons.listOrders(req.claims.tenant_id, status);
  }

  @Patch('orders/:id/fulfillment')
  updateFulfillment(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'in_progress' | 'delivered' | 'cancelled' },
  ) {
    if (req.claims.role === 'resident') throw new ForbiddenException();
    return this.addons.updateFulfillment(req.claims.tenant_id, id, body.status);
  }
}
