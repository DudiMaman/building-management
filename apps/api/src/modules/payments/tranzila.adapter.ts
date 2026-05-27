/**
 * TranzilaAdapter — wraps the Tranzila REST API.
 *
 * Real implementation uses the Iframe Hosted Fields flow (PCI SAQ-A):
 *   1. Frontend embeds Tranzila iframe; user enters card.
 *   2. Tranzila returns a token (TranzilaTK) via postMessage.
 *   3. Token is sent to our backend and stored on payment_methods.
 *   4. Charge against the token via this adapter:
 *        POST https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi
 *        body params: supplier, TranzilaTK, sum, currency=1 (ILS),
 *                     tranmode=V (immediate capture), npay (installments)
 *
 * Webhook signature verification uses HMAC-SHA256 of body with the
 * tenant-specific TRANZILA_HMAC_SECRET.
 */
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { createHmac, timingSafeEqual } from 'node:crypto';

export interface ChargeTokenInput {
  token: string;
  amountIls: number;
  currency: 'ILS';
  installments: number;
  description?: string;
  idempotencyKey: string;
}

export interface ChargeTokenResult {
  ok: boolean;
  txnId?: string;
  failureReason?: string;
  raw: unknown;
}

export interface IframeSessionInput {
  amountIls: number;
  currency: 'ILS';
  installments?: number;
  chargeId: string;
  personId: string;
  /** Tenant-specific reference; flows back via webhook and postMessage. */
  txnref: string;
  /** Where the iframe should redirect on success. */
  successUrl?: string;
  /** Where the iframe should redirect on failure. */
  failureUrl?: string;
  /** Email of the payer, pre-filled. */
  email?: string;
  /** Pre-fill display name of the payer (Hebrew). */
  contact?: string;
  /** Pre-fill phone. */
  phone?: string;
}

export interface IframeSession {
  url: string;
  expires_at: string;
  /** State token to validate the postMessage payload server-side. */
  state: string;
}

@Injectable()
export class TranzilaAdapter {
  protected readonly logger = new Logger(TranzilaAdapter.name);
  protected readonly baseUrl = process.env.TRANZILA_BASE_URL ?? 'https://secure5.tranzila.com';
  protected readonly iframeBase = process.env.TRANZILA_IFRAME_BASE ?? 'https://direct.tranzila.com';
  protected readonly supplier = process.env.TRANZILA_SUPPLIER ?? '';
  protected readonly hmacSecret = process.env.TRANZILA_HMAC_SECRET ?? '';

  /**
   * Build a Tranzila Hosted Fields iframe URL for an in-app payment.
   * SPEC §11.3: PCI SAQ-A — the iframe collects card data; our server
   * never sees PAN/CVV.
   */
  buildIframeSession(input: IframeSessionInput): IframeSession {
    if (!this.supplier) {
      throw new Error('TRANZILA_SUPPLIER not configured');
    }
    const params = new URLSearchParams({
      currency: '1',
      sum: input.amountIls.toFixed(2),
      cred_type: '1',
      tranmode: 'V',
      txnref: input.txnref,
      lang: 'il',
      // Tranzila accepts arbitrary `u71` etc parameters that are echoed
      // back via postMessage / webhook — we use one as our state token
      // so the resident app can correlate the result.
      u71: input.chargeId,
      u72: input.personId,
    });
    if (input.installments && input.installments > 1) {
      params.set('maxpay', String(input.installments));
      params.set('npay', String(input.installments));
    }
    if (input.successUrl) params.set('success_url_address', input.successUrl);
    if (input.failureUrl) params.set('fail_url_address', input.failureUrl);
    if (input.email) params.set('email', input.email);
    if (input.contact) params.set('contact', input.contact);
    if (input.phone) params.set('phone', input.phone);

    const state = this.signState({
      charge_id: input.chargeId,
      person_id: input.personId,
      txnref: input.txnref,
    });
    return {
      url: `${this.iframeBase}/${this.supplier}/iframenew.php?${params.toString()}`,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      state,
    };
  }

  /** HMAC-sign a JSON state blob so we can verify postMessage payloads. */
  signState(payload: Record<string, string>): string {
    const json = JSON.stringify(payload);
    const sig = createHmac('sha256', this.hmacSecret || 'dev-secret').update(json).digest('hex');
    return Buffer.from(JSON.stringify({ ...payload, sig })).toString('base64url');
  }

  verifyState(state: string): Record<string, string> | null {
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8')) as Record<string, string>;
      const { sig, ...payload } = decoded;
      const expected = createHmac('sha256', this.hmacSecret || 'dev-secret')
        .update(JSON.stringify(payload))
        .digest('hex');
      const a = Buffer.from(expected);
      const b = Buffer.from(sig ?? '');
      if (a.length !== b.length) return null;
      return timingSafeEqual(a, b) ? payload : null;
    } catch {
      return null;
    }
  }

  async chargeToken(input: ChargeTokenInput): Promise<ChargeTokenResult> {
    if (!this.supplier) {
      throw new Error('TRANZILA_SUPPLIER not configured');
    }
    const params = new URLSearchParams({
      supplier: this.supplier,
      TranzilaTK: input.token,
      sum: input.amountIls.toFixed(2),
      currency: '1',
      tranmode: 'V',
      npay: String(input.installments),
      txnref: input.idempotencyKey,
    });
    if (input.description) params.set('Description', input.description);

    try {
      const res = await axios.post(
        `${this.baseUrl}/cgi-bin/tranzila71u.cgi`,
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 30_000,
        },
      );
      const parsed = new URLSearchParams(typeof res.data === 'string' ? res.data : '');
      const responseCode = parsed.get('Response');
      const index = parsed.get('index');
      if (responseCode === '000' && index) {
        return { ok: true, txnId: index, raw: Object.fromEntries(parsed) };
      }
      return {
        ok: false,
        failureReason: `Tranzila response ${responseCode}`,
        raw: Object.fromEntries(parsed),
      };
    } catch (err) {
      this.logger.error(`Tranzila chargeToken failed: ${(err as Error).message}`);
      return { ok: false, failureReason: (err as Error).message, raw: null };
    }
  }

  async refund(originalTxnId: string, amountIls: number): Promise<ChargeTokenResult> {
    const params = new URLSearchParams({
      supplier: this.supplier,
      sum: amountIls.toFixed(2),
      currency: '1',
      tranmode: 'R',
      indexRef: originalTxnId,
    });
    try {
      const res = await axios.post(
        `${this.baseUrl}/cgi-bin/tranzila71u.cgi`,
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 30_000 },
      );
      const parsed = new URLSearchParams(typeof res.data === 'string' ? res.data : '');
      return {
        ok: parsed.get('Response') === '000',
        txnId: parsed.get('index') ?? undefined,
        raw: Object.fromEntries(parsed),
      };
    } catch (err) {
      return { ok: false, failureReason: (err as Error).message, raw: null };
    }
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.hmacSecret) {
      this.logger.warn('No TRANZILA_HMAC_SECRET — webhook signature unverified');
      return true;
    }
    const expected = createHmac('sha256', this.hmacSecret).update(rawBody).digest('hex');
    const aBuf = Buffer.from(expected);
    const bBuf = Buffer.from(signature.replace(/^sha256=/, ''));
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
  }
}
