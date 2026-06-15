import { Body, Controller, Headers, Logger, Post, RawBodyRequest, Req } from '@nestjs/common';
import { TranzilaAdapter } from './tranzila.adapter';
import { PaymentsService } from './payments.service';
import { Public } from '../auth/public.decorator';

/**
 * Tranzila notify webhook. Tranzila sends a POST with form-encoded body
 * containing transaction details. Signature-verified and idempotent — the
 * actual side effects (capture, charge update, receipt) live in
 * PaymentsService.handleProviderResult so replays are safe.
 */
@Controller('webhooks/tranzila')
export class TranzilaWebhookController {
  private readonly logger = new Logger(TranzilaWebhookController.name);

  constructor(
    private readonly tranzila: TranzilaAdapter,
    private readonly payments: PaymentsService,
  ) {}

  @Public()
  @Post()
  async receive(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-tranzila-signature') signature: string,
    @Body() body: Record<string, string>,
  ) {
    const rawBody = (req.rawBody as Buffer | undefined)?.toString('utf-8') ?? JSON.stringify(body);
    if (signature && !this.tranzila.verifyWebhookSignature(rawBody, signature)) {
      this.logger.warn('Tranzila webhook signature mismatch — rejecting');
      return { ok: false };
    }

    const txnId = body.index ?? body.txn_id;
    const status = body.Response === '000' ? 'captured' : 'failed';
    if (!txnId) {
      this.logger.warn('Tranzila webhook missing txn id');
      return { ok: false };
    }

    try {
      await this.payments.handleProviderResult(txnId, status, body);
    } catch (err) {
      this.logger.error(`Tranzila webhook processing failed: ${(err as Error).message}`);
    }
    return { ok: true };
  }
}
