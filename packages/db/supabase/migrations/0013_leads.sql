-- Marketing leads — pre-tenant.
-- Captured from the marketing /contact form; no tenant_id since these
-- people haven't signed up yet.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  source text not null default 'marketing-site',
  status text not null default 'new',          -- new | qualified | converted | rejected
  notes text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (email)
);

create index if not exists leads_status_created_idx on leads (status, created_at desc);

-- No RLS — admin-only access, controlled at the service layer.
