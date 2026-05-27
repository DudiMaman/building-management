import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { FilesService } from '../files/files.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { IssueInvoiceSchema } from '@bm/shared';
import { ZodPipe } from '../../common/zod.pipe';
import { Roles, RolesGuard } from '../auth/roles.decorator';

@Controller('invoices')
@UseGuards(SupabaseJwtGuard, RolesGuard)
@Roles('mgmt_admin', 'mgmt_member')
export class InvoicingController {
  constructor(
    private readonly invoicing: InvoicingService,
    private readonly files: FilesService,
  ) {}

  @Post()
  issue(
    @Req() req: AuthenticatedRequest,
    @Body(new ZodPipe(IssueInvoiceSchema)) body: any,
  ) {
    return this.invoicing.issue(req.claims.tenant_id, req.claims.sub, body);
  }

  @Post(':id/credit-note')
  creditNote(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { series_id: string },
  ) {
    return this.invoicing.issueCreditNote(req.claims.tenant_id, req.claims.sub, id, body.series_id);
  }

  @Post(':id/pdf')
  async regeneratePdf(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const fileId = await this.invoicing.regeneratePdf(req.claims.tenant_id, id);
    const url = await this.files.getSignedUrl(fileId);
    return { file_id: fileId, signed_url: url };
  }

  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('customer_id') customerId?: string) {
    return this.invoicing.list(req.claims.tenant_id, customerId);
  }

  @Get('series')
  series(@Req() req: AuthenticatedRequest) {
    return this.invoicing.getSeries(req.claims.tenant_id);
  }
}
