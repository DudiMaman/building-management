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
import { PollsService } from './polls.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { CreatePollSchema } from '@bm/shared';
import { ZodPipe } from '../../common/zod.pipe';
import type { VoteSignaturePayload } from './signature';

interface VoteBody {
  apartment_id: string;
  choice: unknown;
  signature?: VoteSignaturePayload;
}

@Controller('polls')
@UseGuards(SupabaseJwtGuard)
export class PollsController {
  constructor(private readonly polls: PollsService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('building_id') buildingId?: string) {
    return this.polls.list(req.claims.tenant_id, buildingId);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body(new ZodPipe(CreatePollSchema)) body: any) {
    if (req.claims.role === 'resident') throw new ForbiddenException();
    return this.polls.create(req.claims.tenant_id, req.claims.sub, body);
  }

  @Post(':id/votes')
  vote(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() body: VoteBody) {
    if (!req.claims.person_id) throw new ForbiddenException();
    return this.polls.vote(
      req.claims.tenant_id,
      id,
      req.claims.person_id,
      body.apartment_id,
      body.choice,
      body.signature,
    );
  }

  @Get(':id/results')
  results(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.polls.results(req.claims.tenant_id, id);
  }

  @Get(':id/audit-signatures')
  auditSignatures(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    if (req.claims.role === 'resident') throw new ForbiddenException();
    return this.polls.auditSignatures(req.claims.tenant_id, id);
  }
}
