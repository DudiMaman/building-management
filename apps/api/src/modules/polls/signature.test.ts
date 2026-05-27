import { describe, expect, it } from 'vitest';
import { webcrypto } from 'node:crypto';
import {
  canonicalize,
  canonicalVoteJson,
  jwkFingerprint,
  verifyVoteSignature,
  type VoteCanonicalInput,
} from './signature';

const FIXED_POLL_ID = 'pl-1';
const FIXED_PERSON_ID = 'pe-1';
const FIXED_APT_ID = 'ap-1';

async function signVote(
  algorithm: 'Ed25519' | 'ECDSA-P256',
  canonical: VoteCanonicalInput,
) {
  const algoParams =
    algorithm === 'Ed25519'
      ? ({ name: 'Ed25519' } as AlgorithmIdentifier)
      : ({ name: 'ECDSA', namedCurve: 'P-256' } as EcKeyGenParams);
  const verifyParams =
    algorithm === 'Ed25519'
      ? ({ name: 'Ed25519' } as AlgorithmIdentifier)
      : ({ name: 'ECDSA', hash: 'SHA-256' } as EcdsaParams);

  const keyPair = (await webcrypto.subtle.generateKey(algoParams, true, ['sign', 'verify'])) as CryptoKeyPair;
  const data = new TextEncoder().encode(canonicalVoteJson(canonical));
  const signature = await webcrypto.subtle.sign(verifyParams, keyPair.privateKey, data);
  const jwk = await webcrypto.subtle.exportKey('jwk', keyPair.publicKey);
  return {
    algorithm,
    public_key_jwk: jwk,
    signature_b64: Buffer.from(new Uint8Array(signature)).toString('base64'),
    signed_at: canonical.signed_at,
  } as const;
}

describe('canonicalize', () => {
  it('sorts keys at every depth', () => {
    expect(canonicalize({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
    expect(canonicalize({ b: { d: 4, c: 3 }, a: 1 })).toBe('{"a":1,"b":{"c":3,"d":4}}');
  });

  it('handles arrays in order', () => {
    expect(canonicalize([{ b: 1, a: 2 }, 3])).toBe('[{"a":2,"b":1},3]');
  });

  it('handles primitives', () => {
    expect(canonicalize(null)).toBe('null');
    expect(canonicalize(true)).toBe('true');
    expect(canonicalize(7)).toBe('7');
    expect(canonicalize('x')).toBe('"x"');
  });
});

describe('jwkFingerprint', () => {
  it('is stable for the same key', async () => {
    const jwk = { kty: 'OKP', crv: 'Ed25519', x: 'AAAA' };
    const a = await jwkFingerprint(jwk);
    const b = await jwkFingerprint(jwk);
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(20);
  });

  it('differs for different keys', async () => {
    const a = await jwkFingerprint({ kty: 'OKP', crv: 'Ed25519', x: 'AAAA' });
    const b = await jwkFingerprint({ kty: 'OKP', crv: 'Ed25519', x: 'BBBB' });
    expect(a).not.toBe(b);
  });
});

describe('verifyVoteSignature - Ed25519', () => {
  it('accepts a fresh, valid signature', async () => {
    const now = new Date();
    const canonical: VoteCanonicalInput = {
      poll_id: FIXED_POLL_ID,
      person_id: FIXED_PERSON_ID,
      apartment_id: FIXED_APT_ID,
      choice: { option: 'yes' },
      signed_at: now.toISOString(),
    };
    const sig = await signVote('Ed25519', canonical);
    const result = await verifyVoteSignature(canonical, sig, now);
    expect(result.ok).toBe(true);
    expect(result.fingerprint).toBeTruthy();
  });

  it('rejects when the choice was tampered after signing', async () => {
    const now = new Date();
    const canonical: VoteCanonicalInput = {
      poll_id: FIXED_POLL_ID,
      person_id: FIXED_PERSON_ID,
      apartment_id: FIXED_APT_ID,
      choice: { option: 'yes' },
      signed_at: now.toISOString(),
    };
    const sig = await signVote('Ed25519', canonical);
    const tampered = { ...canonical, choice: { option: 'no' } };
    const result = await verifyVoteSignature(tampered, sig, now);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/mismatch|signature/i);
  });

  it('rejects a signature signed >10 minutes ago', async () => {
    const longAgo = new Date(Date.now() - 11 * 60 * 1000);
    const canonical: VoteCanonicalInput = {
      poll_id: FIXED_POLL_ID,
      person_id: FIXED_PERSON_ID,
      apartment_id: FIXED_APT_ID,
      choice: { option: 'yes' },
      signed_at: longAgo.toISOString(),
    };
    const sig = await signVote('Ed25519', canonical);
    const result = await verifyVoteSignature(canonical, sig); // now=default
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/window|signed_at/);
  });
});

describe('verifyVoteSignature - ECDSA P-256', () => {
  it('accepts a fresh, valid signature', async () => {
    const now = new Date();
    const canonical: VoteCanonicalInput = {
      poll_id: FIXED_POLL_ID,
      person_id: FIXED_PERSON_ID,
      apartment_id: FIXED_APT_ID,
      choice: 1,
      signed_at: now.toISOString(),
    };
    const sig = await signVote('ECDSA-P256', canonical);
    const result = await verifyVoteSignature(canonical, sig, now);
    expect(result.ok).toBe(true);
  });

  it('rejects when the public key is swapped for an attacker key', async () => {
    const now = new Date();
    const canonical: VoteCanonicalInput = {
      poll_id: FIXED_POLL_ID,
      person_id: FIXED_PERSON_ID,
      apartment_id: FIXED_APT_ID,
      choice: 1,
      signed_at: now.toISOString(),
    };
    const real = await signVote('ECDSA-P256', canonical);
    const attacker = await signVote('ECDSA-P256', canonical);
    // Real signature, attacker's public key.
    const swapped = { ...real, public_key_jwk: attacker.public_key_jwk };
    const result = await verifyVoteSignature(canonical, swapped, now);
    expect(result.ok).toBe(false);
  });
});
