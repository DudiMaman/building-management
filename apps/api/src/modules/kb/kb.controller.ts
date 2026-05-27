import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KbService } from './kb.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';

interface IngestBody {
  title: string;
  content: string;
  source_url?: string;
  source_file_id?: string;
  metadata?: Record<string, unknown>;
}

@Controller('kb')
@UseGuards(SupabaseJwtGuard)
export class KbController {
  constructor(private readonly kb: KbService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.kb.listDocuments(req.claims.tenant_id);
  }

  @Get('search')
  search(
    @Req() req: AuthenticatedRequest,
    @Query('q') q: string,
    @Query('limit') limit?: string,
  ) {
    return this.kb.search(req.claims.tenant_id, q ?? '', limit ? Number(limit) : 5);
  }

  @Post('ingest')
  ingest(@Req() req: AuthenticatedRequest, @Body() body: IngestBody) {
    if (req.claims.role === 'resident') throw new ForbiddenException('Mgmt only');
    return this.kb.ingestText({
      tenantId: req.claims.tenant_id,
      title: body.title,
      content: body.content,
      sourceUrl: body.source_url,
      sourceFileId: body.source_file_id,
      metadata: body.metadata,
    });
  }

  @Post('versions/:versionId/ingest')
  ingestVersion(@Req() req: AuthenticatedRequest, @Param('versionId') versionId: string) {
    if (req.claims.role === 'resident') throw new ForbiddenException('Mgmt only');
    return this.kb.ingestFromDocumentVersion(req.claims.tenant_id, versionId);
  }
}
