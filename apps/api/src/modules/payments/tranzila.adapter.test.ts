import { describe, it, expect, beforeEach } from 'vitest';
import { TranzilaAdapter } from './tranzila.adapter';

describe('TranzilaAdapter state HMAC', () => {
  let adapter: TranzilaAdapter;
  beforeEach(() => {
    process.env.TRANZILA_HMAC_SECRET = 'test-secret';
    process.env.TRANZILA_SUPPLIER = 'demo';
    adapter = new TranzilaAdapter();
  });

  it('round-trips a signed state', () => {
    const state = adapter.signState({
      charge_id: 'c1',
      person_id: 'p1',
      txnref: 't1',
    });
    const verified = adapter.verifyState(state);
    expect(verified).toEqual({ charge_id: 'c1', person_id: 'p1', txnref: 't1' });
  });

  it('rejects tampered state', () => {
    const state = adapter.signState({
      charge_id: 'c1',
      person_id: 'p1',
      txnref: 't1',
    });
    // Flip a single byte at the end (will likely invalidate base64 or HMAC).
    const tampered = state.slice(0, -2) + 'XX';
    expect(adapter.verifyState(tampered)).toBeNull();
  });

  it('rejects state forged with a different secret', () => {
    const a = new TranzilaAdapter();
    // Force a different secret on b.
    process.env.TRANZILA_HMAC_SECRET = 'other-secret';
    const b = new TranzilaAdapter();
    const stateFromB = b.signState({ charge_id: 'c1', person_id: 'p1', txnref: 't1' });
    process.env.TRANZILA_HMAC_SECRET = 'test-secret';
    expect(a.verifyState(stateFromB)).toBeNull();
  });

  it('builds an iframe URL with the right Tranzila params', () => {
    const session = adapter.buildIframeSession({
      amountIls: 350,
      currency: 'ILS',
      installments: 3,
      chargeId: 'c-aaa',
      personId: 'p-bbb',
      txnref: 'tr-1',
    });
    expect(session.url).toContain('iframenew.php');
    expect(session.url).toContain('sum=350.00');
    expect(session.url).toContain('currency=1');
    expect(session.url).toContain('npay=3');
    expect(session.url).toContain('txnref=tr-1');
    expect(session.state.length).toBeGreaterThan(0);
  });
});
