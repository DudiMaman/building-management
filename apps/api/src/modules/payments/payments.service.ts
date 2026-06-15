import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DbService } from '../../db/db.service';
import { TranzilaAdapter, type IframeSession } from './tranzila.adapter';
import { InvoicingService } from '../invoicing/invoicing.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { CreatePayment } from '@bm/shared';
import type { Charge, Payment, PaymentMethod } from '@bm/db';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly db: DbService,
    private readonly tranzila: TranzilaAdapter,
    private readonly invoicing: InvoicingService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * Apply a payment-provider (Tranzila) result, identified by its transaction
   * id. This is the single source of truth for capture side effects and is
   * idempotent — a replayed webhook that finds the payment already in the
   * target state is a no-op (so a receipt is never issued twice). On first
   * capture it: marks the payment captured, advances the charge's paid amount
   * /status, sends a receipt notification, and best-effort auto-issues a tax
   * receipt (see InvoicingService.issueReceiptForPayment + ADR-001).
   */
  async handleProviderResult(
    txnId: string,
    status: 'captured' | 'failed',
    raw: Record<string, unknown>,
  ): Promise<{ ok: boolean; duplicate?: boolean }> {
    const found = await this.db.query<{
      id: string;
      tenant_id: string;
      charge_id: string;
      amount: string;
      status: string;
      apartment_id: string | null;
    }>(
      `select p.id, p.tenant_id, p.charge_id, p.amount, p.status, c.apartment_id
       from payments p join charges c on c.id = p.charge_id
       where p.tranzila_txn_id = $1`,
      [txnId],
    );
    const payment = found.rows[0];
    if (!payment) {
      this.logger.warn(`Tranzila result for unknown txn ${txnId}`);
      return { ok: false };
    }
    if (payment.status === status || payment.status === 'captured') {
      return { ok: true, duplicate: true };
    }

    await this.db.query(
      `update payments
       set status = $2,
           captured_at = case when $2 = 'captured' then now() else captured_at end,
           raw_provider_json = $3, updated_at = now()
       where id = $1`,
      [payment.id, status, JSON.stringify(raw)],
    );

    if (status !== 'captured') {
      return { ok: true };
    }

    // Advance the charge's paid amount / status.
    await this.db.query(
      `update charges
       set paid_amount = paid_amount + $2,
           status = case when paid_amount + $2 >= amount then 'paid' else 'partial' end,
           updated_at = now()
       where id = $1`,
      [payment.charge_id, payment.amount],
    );

    // Notify (best-effort) and auto-issue a receipt (best-effort).
    if (payment.apartment_id) {
      try {
        await this.notifications.notifyApartment(
          payment.tenant_id,
          payment.apartment_id,
          'payment_receipt',
          'invoice_issued',
          { doc_type: 'קבלה', number: '', amount: String(payment.amount), url: '' },
          { event_key: `receipt:${payment.id}` },
        );
      } catch (err) {
        this.logger.warn(`Receipt notify failed for payment ${payment.id}: ${(err as Error).message}`);
      }
    }
    try {
      await this.invoicing.issueReceiptForPayment(payment.tenant_id, payment.id);
    } catch (err) {
      this.logger.error(`Auto-receipt failed for payment ${payment.id}: ${(err as Error).message}`);
    }

    return { ok: true };
  }

  /**
   * Resident-initiated payment of a charge.
   * Resolves the payment method, calls Tranzila, persists Payment row.
   */
  async payCharge(
    tenantId: string,
    payerPersonId: string,
    input: CreatePayment,
  ): Promise<Payment> {
    const charge = await this.fetchCharge(tenantId, input.charge_id);
    if (charge.status === 'paid') {
      throw new BadRequestException('Charge already paid');
    }
    const method = input.payment_method_id
      ? await this.fetchPaymentMethod(tenantId, input.payment_method_id)
      : await this.fetchDefaultPaymentMethod(tenantId, payerPersonId);
    if (!method || !method.tranzila_token) {
      throw new BadRequestException('No payment method on file');
    }

    const idempotencyKey = `${input.charge_id}_${Date.now()}`;
    const result = await this.tranzila.chargeToken({
      token: method.tranzila_token,
      amountIls: input.amount,
      currency: 'ILS',
      installments: input.installments,
      description: charge.description ?? undefined,
      idempotencyKey,
    });

    return this.db.withTenantContext({ tenant_id: tenantId, role: 'resident' }, async (client) => {
      const { rows } = await client.query<Payment>(
        `insert into payments
          (tenant_id, charge_id, paid_by_person_id, payment_method_id, method,
           amount, currency, status, tranzila_token_id, tranzila_txn_id,
           last4, brand, installments, captured_at, failure_reason, raw_provider_json)
         values ($1, $2, $3, $4, 'card', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         returning *`,
        [
          tenantId,
          input.charge_id,
          payerPersonId,
          method.id,
          input.amount,
          'ILS',
          result.ok ? 'captured' : 'failed',
          method.tranzila_token,
          result.txnId ?? null,
          method.last4,
          method.brand,
          input.installments,
          result.ok ? new Date() : null,
          result.failureReason ?? null,
          JSON.stringify(result.raw),
        ],
      );
      return rows[0]!;
    });
  }

  /**
   * Record an offline payment (cash/check/wire).
   * Used by mgmt when reconciling offline collections.
   */
  async recordOfflinePayment(
    tenantId: string,
    actorUserId: string,
    chargeId: string,
    method: 'cash' | 'check' | 'wire' | 'other',
    amount: number,
    notes?: string,
  ): Promise<Payment> {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (client) => {
      const { rows } = await client.query<Payment>(
        `insert into payments
          (tenant_id, charge_id, paid_by_person_id, method, amount, currency, status, captured_at, raw_provider_json)
         values ($1, $2, null, $3, $4, 'ILS', 'captured', now(), $5)
         returning *`,
        [
          tenantId,
          chargeId,
          method,
          amount,
          JSON.stringify({ offline: true, recorded_by: actorUserId, notes }),
        ],
      );
      return rows[0]!;
    });
  }

  /**
   * Build a Tranzila iframe session for a resident to pay a specific charge.
   * Returns the iframe URL (PCI SAQ-A safe — card data never touches our
   * servers) plus an HMAC-signed state that protects the postMessage
   * callback against forgery.
   */
  async createIframeSession(
    tenantId: string,
    payerPersonId: string,
    chargeId: string,
    installments = 1,
  ): Promise<IframeSession & { charge: Charge }> {
    const charge = await this.fetchCharge(tenantId, chargeId);
    if (charge.status === 'paid') {
      throw new BadRequestException('Charge already paid');
    }
    // Permission: payer must be on the apartment's assignments.
    const ok = await this.canPayerAccessCharge(tenantId, payerPersonId, charge);
    if (!ok) throw new ForbiddenException('Not authorized for this charge');

    const outstanding = Number(charge.amount) - Number(charge.paid_amount);
    if (outstanding <= 0) {
      throw new BadRequestException('No outstanding balance on this charge');
    }
    const person = await this.fetchPerson(tenantId, payerPersonId);
    const txnref = `${chargeId.slice(0, 8)}-${randomUUID().slice(0, 8)}`;
    const appOrigin = process.env.APP_ORIGIN ?? 'https://app.building-management.co.il';
    const session = this.tranzila.buildIframeSession({
      amountIls: outstanding,
      currency: 'ILS',
      installments,
      chargeId,
      personId: payerPersonId,
      txnref,
      successUrl: `${appOrigin}/payment-success?txnref=${txnref}`,
      failureUrl: `${appOrigin}/payment-failed?txnref=${txnref}`,
      email: person?.email ?? undefined,
      contact: person?.full_name,
      phone: person?.phone_e164 ?? undefined,
    });

    // Persist a pending Payment row so the webhook / postMessage can find it.
    await this.db.withTenantContext({ tenant_id: tenantId, role: 'resident', person_id: payerPersonId }, async (c) => {
      await c.query(
        `insert into payments
          (tenant_id, charge_id, paid_by_person_id, method, amount, currency,
           status, installments, tranzila_txn_id, raw_provider_json)
         values ($1, $2, $3, 'card', $4, 'ILS', 'pending', $5, $6, $7)
         on conflict do nothing`,
        [
          tenantId,
          chargeId,
          payerPersonId,
          outstanding,
          installments,
          txnref,
          JSON.stringify({ source: 'iframe', state: session.state }),
        ],
      );
    });
    return { ...session, charge };
  }

  /**
   * Process a postMessage payload received by the mobile WebView when the
   * Tranzila iframe completes. Verifies HMAC state, looks up the matching
   * pending Payment row, finalizes its status, and (on success) persists
   * the resulting token as a PaymentMethod if returned.
   */
  async handleIframeResult(input: {
    state: string;
    response_code: string;
    txn_id?: string | null;
    token?: string | null;
    last4?: string | null;
    brand?: string | null;
    raw: Record<string, unknown>;
  }): Promise<{ ok: boolean; charge_id?: string; payment_id?: string; reason?: string }> {
    const verified = this.tranzila.verifyState(input.state);
    if (!verified) {
      return { ok: false, reason: 'Invalid state signature' };
    }
    const { charge_id, person_id, txnref } = verified;
    if (!charge_id || !person_id || !txnref) {
      return { ok: false, reason: 'Malformed state' };
    }

    const tenantRow = await this.db.query<{ tenant_id: string }>(
      `select tenant_id from charges where id = $1`,
      [charge_id],
    );
    if (tenantRow.rows.length === 0) return { ok: false, reason: 'Charge not found' };
    const tenantId = tenantRow.rows[0]!.tenant_id;

    const ok = input.response_code === '000' || input.response_code === 'success';
    return this.db.withTenantContext(
      { tenant_id: tenantId, role: 'resident', person_id },
      async (c) => {
        const updated = await c.query<Payment>(
          `update payments
              set status = $1,
                  captured_at = case when $1 = 'captured' then now() else captured_at end,
                  tranzila_txn_id = coalesce($2, tranzila_txn_id),
                  last4 = coalesce($3, last4),
                  brand = coalesce($4, brand),
                  failure_reason = case when $1 = 'failed' then $5 else failure_reason end,
                  raw_provider_json = $6
            where charge_id = $7
              and paid_by_person_id = $8
              and status = 'pending'
            returning *`,
          [
            ok ? 'captured' : 'failed',
            input.txn_id ?? null,
            input.last4 ?? null,
            input.brand ?? null,
            ok ? null : `Tranzila response ${input.response_code}`,
            JSON.stringify(input.raw),
            charge_id,
            person_id,
          ],
        );
        if (updated.rows.length === 0) {
          return { ok: false, reason: 'No matching pending payment' };
        }

        // Save the token as a PaymentMethod (for future one-tap pay).
        if (ok && input.token) {
          await c.query(
            `insert into payment_methods
              (tenant_id, owner_person_id, type, tranzila_token, brand, last4, status, is_default)
             values ($1, $2, 'card', $3, $4, $5, 'active', false)
             on conflict do nothing`,
            [tenantId, person_id, input.token, input.brand ?? 'unknown', input.last4 ?? null],
          );
        }
        return { ok, charge_id, payment_id: updated.rows[0]!.id };
      },
    );
  }

  private async canPayerAccessCharge(tenantId: string, personId: string, charge: Charge): Promise<boolean> {
    if (charge.billed_to_person_id === personId) return true;
    return this.db.withTenantContext(
      { tenant_id: tenantId, role: 'resident', person_id: personId },
      async (c) => {
        const { rows } = await c.query(
          `select 1 from apartment_assignments
            where apartment_id = $1 and person_id = $2 and status = 'active'
              and (valid_to is null or valid_to >= current_date)
            limit 1`,
          [charge.apartment_id, personId],
        );
        return rows.length > 0;
      },
    );
  }

  private async fetchPerson(tenantId: string, id: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<{ full_name: string; phone_e164: string | null; email: string | null }>(
        `select full_name, phone_e164, email from people where id = $1`,
        [id],
      );
      return rows[0] ?? null;
    });
  }

  private async fetchCharge(tenantId: string, id: string): Promise<Charge> {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (client) => {
      const { rows } = await client.query<Charge>(`select * from charges where id = $1`, [id]);
      if (rows.length === 0) throw new NotFoundException('Charge not found');
      return rows[0]!;
    });
  }

  private async fetchPaymentMethod(tenantId: string, id: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (client) => {
      const { rows } = await client.query<PaymentMethod>(
        `select * from payment_methods where id = $1 and status = 'active'`,
        [id],
      );
      return rows[0] ?? null;
    });
  }

  private async fetchDefaultPaymentMethod(tenantId: string, personId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (client) => {
      const { rows } = await client.query<PaymentMethod>(
        `select * from payment_methods
         where owner_person_id = $1 and status = 'active'
         order by is_default desc, created_at desc
         limit 1`,
        [personId],
      );
      return rows[0] ?? null;
    });
  }
}
