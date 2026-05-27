import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Response } from 'express';
import { PaymentsService } from './payments.service';
import { SupabaseJwtGuard, type AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { Public } from '../auth/public.decorator';
import { CreatePaymentSchema } from '@bm/shared';
import { ZodPipe } from '../../common/zod.pipe';

@Controller('payments')
@UseGuards(SupabaseJwtGuard)
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  pay(
    @Req() req: AuthenticatedRequest,
    @Body(new ZodPipe(CreatePaymentSchema)) body: any,
  ) {
    if (req.claims.role !== 'resident' || !req.claims.person_id) {
      throw new ForbiddenException('Only residents can call this endpoint');
    }
    return this.payments.payCharge(req.claims.tenant_id, req.claims.person_id, body);
  }

  /**
   * Resident asks for a Tranzila iframe URL to pay a charge.
   * The iframe is loaded inside a WebView (mobile) or iframe (web).
   * Card data stays inside Tranzila — we never see it (PCI SAQ-A).
   */
  @Post('iframe-session')
  iframeSession(
    @Req() req: AuthenticatedRequest,
    @Body() body: { charge_id: string; installments?: number },
  ) {
    if (req.claims.role !== 'resident' || !req.claims.person_id) {
      throw new ForbiddenException('Only residents can call this endpoint');
    }
    return this.payments.createIframeSession(
      req.claims.tenant_id,
      req.claims.person_id,
      body.charge_id,
      body.installments ?? 1,
    );
  }

  /**
   * Webhook-style endpoint hit by the resident app after the iframe posts
   * its completion message. The body is HMAC-signed against the original
   * session state so this remains safe to call without an auth header.
   */
  @Public()
  @Post('iframe-result')
  iframeResult(
    @Body()
    body: {
      state: string;
      response_code: string;
      txn_id?: string;
      token?: string;
      last4?: string;
      brand?: string;
      raw?: Record<string, unknown>;
    },
  ) {
    return this.payments.handleIframeResult({
      state: body.state,
      response_code: body.response_code,
      txn_id: body.txn_id,
      token: body.token,
      last4: body.last4,
      brand: body.brand,
      raw: body.raw ?? {},
    });
  }

  /**
   * Local mock iframe served by the API in dev. Real production traffic
   * goes to direct.tranzila.com; this exists so the resident app and
   * end-to-end tests can exercise the postMessage flow without leaving
   * the local environment.
   */
  @Public()
  @Get('iframe-mock')
  iframeMock(
    @Query('charge_id') chargeId: string,
    @Query('sum') sum: string,
    @Query('state') state: string,
    @Query('txnref') txnref: string,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(this.renderMockIframe(chargeId, sum, state, txnref));
  }

  @Post('offline')
  offline(
    @Req() req: AuthenticatedRequest,
    @Body() body: { charge_id: string; method: 'cash' | 'check' | 'wire' | 'other'; amount: number; notes?: string },
  ) {
    if (req.claims.role !== 'mgmt_admin' && req.claims.role !== 'mgmt_member') {
      throw new ForbiddenException('mgmt-only endpoint');
    }
    return this.payments.recordOfflinePayment(
      req.claims.tenant_id,
      req.claims.sub,
      body.charge_id,
      body.method,
      body.amount,
      body.notes,
    );
  }

  private renderMockIframe(chargeId: string, sum: string, state: string, txnref: string): string {
    const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
    return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tranzila Mock</title>
  <style>
    body { font-family: system-ui, "Heebo", sans-serif; padding: 24px; background:#f8fafc; margin:0; }
    .card { max-width: 420px; margin: 0 auto; background: white; border-radius: 14px;
            padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 20px; margin: 0 0 8px; color: #4f46e5; }
    .row { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
    label { font-size: 12px; color: #64748b; }
    input { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 16px; }
    button { width: 100%; padding: 14px; border: none; border-radius: 10px; color: white;
             font-weight: 600; font-size: 16px; cursor: pointer; margin-top: 12px; }
    .pay { background: #16a34a; }
    .fail { background: #dc2626; margin-top: 8px; }
    .note { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>תשלום מאובטח — Mock</h1>
    <div class="row"><label>סכום</label><strong>${escape(sum)} ₪</strong></div>
    <div class="row"><label>מספר חיוב</label><span>${escape(chargeId.slice(0, 8))}</span></div>
    <div class="row"><label>כרטיס</label><input type="text" value="4580 0000 0000 0000" /></div>
    <div class="row"><label>תוקף</label><input type="text" value="12/29" /></div>
    <div class="row"><label>CVV</label><input type="text" value="123" /></div>
    <button class="pay" id="pay">שלמו ${escape(sum)} ₪</button>
    <button class="fail" id="fail">סימולציה: כשל</button>
    <div class="note">Mock: לא נשלחת כל פניה אמיתית לטרנזילה</div>
  </div>
  <script>
    const state = ${JSON.stringify(state)};
    const txnref = ${JSON.stringify(txnref)};
    function post(payload) {
      const body = Object.assign({ state, txnref, raw: payload }, payload);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(body));
      }
      window.parent.postMessage(body, '*');
    }
    document.getElementById('pay').addEventListener('click', () => {
      post({
        response_code: '000',
        txn_id: 'mock_' + txnref + '_' + Date.now(),
        token: 'tok_mock_' + Math.random().toString(36).slice(2, 10),
        last4: '0000',
        brand: 'visa',
      });
    });
    document.getElementById('fail').addEventListener('click', () => {
      post({ response_code: '003', txn_id: null });
    });
  </script>
</body>
</html>`;
  }
}
