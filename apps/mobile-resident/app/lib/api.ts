/**
 * Tiny API client for the resident app.
 *
 * Reads EXPO_PUBLIC_API_URL at build time. Falls back to localhost:4000
 * for in-emulator dev. The auth token is the Supabase JWT — pulled from
 * AsyncStorage where the Supabase client stashes it on sign-in.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

const TOKEN_KEY = 'bm.auth.token';

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setAuthToken(token: string | null): Promise<void> {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export interface ApiError extends Error {
  status: number;
  body: unknown;
}

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.auth !== false) {
    const token = await getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/v1${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  const body = text ? safeJson(text) : null;
  if (!res.ok) {
    const err = new Error(`API ${res.status}: ${text.slice(0, 200)}`) as ApiError;
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// --- Payment helpers ---

export interface IframeSession {
  url: string;
  expires_at: string;
  state: string;
  charge: { id: string; amount: string; currency: string; description: string | null };
}

export function createIframeSession(chargeId: string, installments = 1) {
  return api<IframeSession>('/payments/iframe-session', {
    method: 'POST',
    body: { charge_id: chargeId, installments },
  });
}

export interface IframeResult {
  ok: boolean;
  charge_id?: string;
  payment_id?: string;
  reason?: string;
}

export function postIframeResult(payload: {
  state: string;
  response_code: string;
  txn_id?: string | null;
  token?: string | null;
  last4?: string | null;
  brand?: string | null;
  raw?: Record<string, unknown>;
}) {
  return api<IframeResult>('/payments/iframe-result', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}
