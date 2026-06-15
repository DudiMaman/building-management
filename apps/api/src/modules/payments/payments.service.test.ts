import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentsService } from './payments.service';

function makeService() {
  const db = { query: vi.fn() } as any;
  const tranzila = {} as any;
  const invoicing = { issueReceiptForPayment: vi.fn().mockResolvedValue(null) } as any;
  const notifications = { notifyApartment: vi.fn().mockResolvedValue({ ok: true }) } as any;
  const svc = new PaymentsService(db, tranzila, invoicing, notifications);
  return { svc, db, invoicing, notifications };
}

const PAYMENT = {
  id: 'pay1',
  tenant_id: 't1',
  charge_id: 'c1',
  amount: '100',
  apartment_id: 'apt1',
};

describe('PaymentsService.handleProviderResult', () => {
  beforeEach(() => vi.clearAllMocks());

  it('is idempotent: a replay on an already-captured payment is a no-op', async () => {
    const { svc, db, invoicing, notifications } = makeService();
    db.query.mockResolvedValueOnce({ rows: [{ ...PAYMENT, status: 'captured' }] });

    const res = await svc.handleProviderResult('txn1', 'captured', {});

    expect(res).toEqual({ ok: true, duplicate: true });
    expect(db.query).toHaveBeenCalledTimes(1); // only the lookup, no writes
    expect(invoicing.issueReceiptForPayment).not.toHaveBeenCalled();
    expect(notifications.notifyApartment).not.toHaveBeenCalled();
  });

  it('on first capture: updates payment + charge, notifies, and auto-issues a receipt', async () => {
    const { svc, db, invoicing, notifications } = makeService();
    db.query
      .mockResolvedValueOnce({ rows: [{ ...PAYMENT, status: 'pending' }] }) // lookup
      .mockResolvedValue({ rows: [] }); // payment update, charge update

    const res = await svc.handleProviderResult('txn1', 'captured', { Response: '000' });

    expect(res.ok).toBe(true);
    expect(res.duplicate).toBeUndefined();
    expect(notifications.notifyApartment).toHaveBeenCalledOnce();
    expect(invoicing.issueReceiptForPayment).toHaveBeenCalledWith('t1', 'pay1');
  });

  it('on failure: marks payment failed but does not issue a receipt', async () => {
    const { svc, db, invoicing } = makeService();
    db.query
      .mockResolvedValueOnce({ rows: [{ ...PAYMENT, status: 'pending' }] })
      .mockResolvedValue({ rows: [] });

    const res = await svc.handleProviderResult('txn1', 'failed', {});

    expect(res.ok).toBe(true);
    expect(invoicing.issueReceiptForPayment).not.toHaveBeenCalled();
  });

  it('returns ok:false for an unknown transaction id', async () => {
    const { svc, db } = makeService();
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await svc.handleProviderResult('nope', 'captured', {});
    expect(res.ok).toBe(false);
  });
});
