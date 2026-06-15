/**
 * Tiny API client for the maintenance app. Mirrors the resident app's client:
 * Supabase JWT from AsyncStorage, EXPO_PUBLIC_API_URL base, plus a minimal
 * useApi() hook so screens can fetch without an extra data lib.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'bm.auth.token';

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
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
  if (!res.ok) throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  return body as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function useApi<T = unknown>(path: string | null): {
  data: T | null;
  error: Error | null;
  loading: boolean;
  reload: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(!!path);
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    if (!path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api<T>(path)
      .then((d) => active && (setData(d), setError(null)))
      .catch((e) => active && setError(e as Error))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [path, nonce]);

  return { data, error, loading, reload };
}
