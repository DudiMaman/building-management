/**
 * Vote signature verification — SPEC §16.4.
 *
 * Voters in binding polls sign the canonical JSON of their vote in the
 * browser with WebCrypto (Ed25519 or ECDSA P-256). The server reconstructs
 * the same canonical form and verifies the signature against the public
 * key the browser submitted. We accept both algorithms so older devices
 * (no Ed25519) still work.
 *
 * Wire format on the API:
 *   {
 *     algorithm: 'Ed25519' | 'ECDSA-P256',
 *     public_key_jwk: JsonWebKey,      // export of CryptoKeyPair.publicKey
 *     signature_b64: string,           // base64 of the raw signature bytes
 *     signed_at: string (ISO-8601),    // included in canonical JSON
 *   }
 *
 * Canonical JSON over which the signature is computed:
 *   stable-stringify({
 *     poll_id, person_id, apartment_id, choice, signed_at,
 *   })
 *
 * (Stable = keys sorted alphabetically; same hash any side produces.)
 */
import { webcrypto } from 'node:crypto';

// Node's webcrypto CryptoKey, exported without depending on the DOM lib
// in tsconfig (apps/api targets node, not dom).
type CryptoKey = Awaited<ReturnType<typeof webcrypto.subtle.importKey>>;

export type SignatureAlgorithm = 'Ed25519' | 'ECDSA-P256';

export interface VoteSignaturePayload {
  algorithm: SignatureAlgorithm;
  public_key_jwk: JsonWebKey;
  signature_b64: string;
  signed_at: string;
}

export interface VoteCanonicalInput {
  poll_id: string;
  person_id: string;
  apartment_id: string;
  choice: unknown;
  signed_at: string;
}

/** Allowed clock skew between client + server, in milliseconds. */
const SIGNATURE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Stable JSON.stringify — keys sorted alphabetically at every depth.
 * Required so the signed bytes are deterministic across runtimes.
 */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(',')}}`;
}

export function canonicalVoteJson(input: VoteCanonicalInput): string {
  return canonicalize(input);
}

/** sha256 fingerprint of a JWK, base64url, no padding — for audit trails. */
export async function jwkFingerprint(jwk: JsonWebKey): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalize(jwk as unknown as Record<string, unknown>));
  const hash = await webcrypto.subtle.digest('SHA-256', bytes);
  return base64UrlEncode(new Uint8Array(hash));
}

/**
 * Verify a vote signature. Returns true if everything checks out, false
 * otherwise. Never throws — callers decide how to react.
 */
export async function verifyVoteSignature(
  canonical: VoteCanonicalInput,
  sig: VoteSignaturePayload,
  now: Date = new Date(),
): Promise<{ ok: boolean; reason?: string; fingerprint?: string }> {
  // 1. Clock check — reject obviously old signatures.
  const signedAt = Date.parse(sig.signed_at);
  if (Number.isNaN(signedAt)) {
    return { ok: false, reason: 'invalid signed_at' };
  }
  const skew = Math.abs(now.getTime() - signedAt);
  if (skew > SIGNATURE_WINDOW_MS) {
    return { ok: false, reason: `signed_at outside ${SIGNATURE_WINDOW_MS / 1000}s window (skew=${skew}ms)` };
  }
  // canonical.signed_at must match what's in the signature envelope.
  if (canonical.signed_at !== sig.signed_at) {
    return { ok: false, reason: 'canonical.signed_at != envelope.signed_at' };
  }

  // 2. Import the key with the matching algorithm.
  let importAlgo: AlgorithmIdentifier | EcKeyImportParams;
  let verifyAlgo: AlgorithmIdentifier | EcdsaParams;
  if (sig.algorithm === 'Ed25519') {
    importAlgo = { name: 'Ed25519' } as AlgorithmIdentifier;
    verifyAlgo = { name: 'Ed25519' } as AlgorithmIdentifier;
  } else if (sig.algorithm === 'ECDSA-P256') {
    importAlgo = { name: 'ECDSA', namedCurve: 'P-256' };
    verifyAlgo = { name: 'ECDSA', hash: 'SHA-256' };
  } else {
    return { ok: false, reason: `unsupported algorithm ${sig.algorithm as string}` };
  }

  let publicKey: CryptoKey;
  try {
    publicKey = await webcrypto.subtle.importKey('jwk', sig.public_key_jwk, importAlgo, false, ['verify']);
  } catch (err) {
    return { ok: false, reason: `key import failed: ${(err as Error).message}` };
  }

  // 3. Verify the signature against the canonical JSON.
  const data = new TextEncoder().encode(canonicalVoteJson(canonical));
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = base64UrlDecode(sig.signature_b64);
  } catch (err) {
    return { ok: false, reason: `bad base64 signature: ${(err as Error).message}` };
  }
  let ok = false;
  try {
    ok = await webcrypto.subtle.verify(verifyAlgo, publicKey, signatureBytes, data);
  } catch (err) {
    return { ok: false, reason: `verify threw: ${(err as Error).message}` };
  }
  if (!ok) return { ok: false, reason: 'signature mismatch' };

  const fingerprint = await jwkFingerprint(sig.public_key_jwk);
  return { ok: true, fingerprint };
}

// ---- base64url helpers ----

function base64UrlEncode(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(s: string): Uint8Array {
  // Accept both base64 and base64url.
  const norm = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = norm + '='.repeat((4 - (norm.length % 4)) % 4);
  return new Uint8Array(Buffer.from(padded, 'base64'));
}
