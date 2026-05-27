import { Injectable, Logger } from '@nestjs/common';
import {
  TranzilaAdapter,
  type ChargeTokenInput,
  type ChargeTokenResult,
  type IframeSession,
  type IframeSessionInput,
} from './tranzila.adapter';

/**
 * In-memory Tranzila for local dev & tests.
 *  - Tokens that start with "fail_" always fail.
 *  - All others succeed and produce a fake txnId.
 */
@Injectable()
export class TranzilaMockAdapter extends TranzilaAdapter {
  protected override readonly logger = new Logger(TranzilaMockAdapter.name);

  override async chargeToken(input: ChargeTokenInput): Promise<ChargeTokenResult> {
    if (input.token.startsWith('fail_')) {
      return {
        ok: false,
        failureReason: 'mock: card declined',
        raw: { mock: true, response: '003' },
      };
    }
    const txnId = `mock_${input.idempotencyKey}_${Date.now()}`;
    this.logger.log(`[MOCK] chargeToken token=${input.token} amount=${input.amountIls} -> ${txnId}`);
    return {
      ok: true,
      txnId,
      raw: { mock: true, response: '000', sum: input.amountIls, installments: input.installments },
    };
  }

  override async refund(originalTxnId: string, amountIls: number): Promise<ChargeTokenResult> {
    return {
      ok: true,
      txnId: `mock_refund_${originalTxnId}_${Date.now()}`,
      raw: { mock: true, original: originalTxnId, amount: amountIls },
    };
  }

  override verifyWebhookSignature(): boolean {
    return true;
  }

  /**
   * Mock iframe URL — points to a tiny local HTML page that simulates the
   * Tranzila iframe (auto-succeeds after 1s and posts back via the same
   * postMessage contract). The state is real (HMAC-signed) so callers
   * can exercise the verifyState path in tests.
   */
  override buildIframeSession(input: IframeSessionInput): IframeSession {
    const state = this.signState({
      charge_id: input.chargeId,
      person_id: input.personId,
      txnref: input.txnref,
    });
    const base = process.env.API_PUBLIC_URL ?? 'http://localhost:4000';
    const params = new URLSearchParams({
      charge_id: input.chargeId,
      sum: input.amountIls.toFixed(2),
      state,
      txnref: input.txnref,
    });
    return {
      url: `${base}/v1/payments/iframe-mock?${params.toString()}`,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      state,
    };
  }
}
