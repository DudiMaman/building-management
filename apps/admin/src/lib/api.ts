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

export interface Apartment {
  id: string;
  building_id: string;
  unit_number: string;
  floor: number | null;
  size_sqm: string | null;
  num_rooms: string | null;
  occupancy_status: 'vacant' | 'owner_occupied' | 'rented' | 'mixed';
  monthly_dues_amount: string | null;
}

export interface Person {
  id: string;
  full_name: string;
  phone_e164: string | null;
  email: string | null;
  language: string;
  claim_status: 'pending' | 'approved' | 'rejected';
  whatsapp_opt_in: boolean;
}

export interface RentalContract {
  id: string;
  apartment_id: string;
  owner_person_id: string;
  renter_person_id: string;
  start_date: string;
  end_date: string | null;
  monthly_rent: string | null;
  vaad_responsibility: 'renter_pays' | 'owner_pays' | 'split';
  split_renter_pct: string | null;
  status: 'draft' | 'active' | 'ended' | 'terminated';
}

export interface Task {
  id: string;
  building_id: string;
  apartment_id: string | null;
  source: 'planned' | 'ticket' | 'adhoc';
  title: string;
  category: string;
  priority: 'low' | 'med' | 'high' | 'urgent';
  assigned_worker_id: string | null;
  scheduled_at: string | null;
  status: 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
  time_spent_minutes: number;
}

export interface Ticket {
  id: string;
  building_id: string;
  apartment_id: string | null;
  opened_by_person_id: string | null;
  intake_channel: string;
  title: string;
  category: string;
  priority: 'low' | 'med' | 'high' | 'urgent';
  status: string;
  opened_at: string;
}

export interface Charge {
  id: string;
  building_id: string;
  apartment_id: string;
  billed_to_person_id: string | null;
  description: string | null;
  amount: string;
  currency: string;
  due_date: string;
  status: string;
  paid_amount: string;
  dunning_stage: number;
}

export interface ChargeSchedule {
  id: string;
  building_id: string;
  apartment_id: string | null;
  name: string;
  amount: string;
  currency: string;
  cadence: 'one_off' | 'monthly' | 'quarterly' | 'annual';
  day_of_month: number | null;
  bill_payer_rule: string;
  status: 'active' | 'paused' | 'ended';
}

export interface Vendor {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  vat_id: string | null;
  iban: string | null;
  rating: string | null;
  status: 'active' | 'inactive' | 'blocked';
}

export interface BulletinPost {
  id: string;
  building_id: string;
  title: string;
  body_md: string;
  pinned: boolean;
  pinned_until: string | null;
  expires_at: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
}

export interface AuditEntry {
  id: string;
  actor_user_id: string | null;
  actor_type: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  ip: string | null;
  created_at: string;
}

export interface ArAging {
  bucket_0_30: string;
  bucket_31_60: string;
  bucket_61_90: string;
  bucket_90_plus: string;
}

export interface PerPersonAr {
  person_id: string;
  full_name: string;
  outstanding: string;
  open_charges: string;
}
