/**
 * Admin web API client.
 *
 * Forwards the Supabase access token from the browser session so the API
 * runs with the user's JWT (= RLS works). All requests go to NEXT_PUBLIC_API_BASE_URL.
 *
 * SWR-friendly: every helper returns a Promise<T> that throws on non-2xx.
 */
import { createSupabaseBrowserClient } from './supabase/client';

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export interface ApiError extends Error {
  status: number;
  body: unknown;
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const supabase = createSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.auth !== false) {
    const token = await getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/v1${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'include',
  });
  const text = await res.text();
  const parsed = text ? safeJson(text) : null;
  if (!res.ok) {
    const err = new Error(`API ${res.status}: ${text.slice(0, 200)}`) as ApiError;
    err.status = res.status;
    err.body = parsed;
    throw err;
  }
  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** SWR fetcher — accepts the path key and forwards to apiFetch. */
export const swrFetcher = <T>(path: string): Promise<T> => apiFetch<T>(path);

// ---- Typed helpers ----

export interface Building {
  id: string;
  name: string;
  address_line: string;
  city: string;
  num_apartments: number | null;
  num_floors: number | null;
  bank_account_iban: string | null;
}

export interface CollectionRate {
  billed: string;
  paid: string;
  rate: number;
  charge_count: number;
  paid_count: number;
  overdue_count: number;
}

export interface OpenTicketsStats {
  total: number | string;
  urgent: number | string;
  high: number | string;
  sla_breached: number | string;
}

export interface InvoiceRow {
  id: string;
  serial_number: number | null;
  type: 'tax_invoice' | 'receipt' | 'tax_invoice_receipt' | 'credit_note';
  status: string;
  issued_at: string | null;
  customer_name_snapshot: string | null;
  total: string;
  currency: string;
  pdf_file_id: string | null;
}
