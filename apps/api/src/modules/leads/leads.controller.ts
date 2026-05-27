import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { LeadsService } from './leads.service';
import { Public } from '../auth/public.decorator';
import { ZodPipe } from '../../common/zod.pipe';

const LeadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  company: z.string().max(160).optional(),
  message: z.string().max(2000).optional(),
});

@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Public()
  @Post()
  create(@Body(new ZodPipe(LeadSchema)) body: z.infer<typeof LeadSchema>) {
    return this.leads.create(body);
  }
}
