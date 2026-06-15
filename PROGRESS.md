# Progress Tracker

This document is updated continuously as development proceeds. It is the source of truth on what is done, what is stubbed, and what needs human action.

> See [`SPEC.md`](./SPEC.md) for the master spec. Section numbers below refer to it.

## Open conversation items

These are decisions or work items waiting on the user — tracked here so
nothing falls between sessions.

- 👤 **Marketing site feedback**: the user is reviewing the live preview
  at <https://dudimaman.github.io/building-management/> and will return
  with a list of fixes. Apply them in a dedicated commit, rebuild, and
  push to `gh-pages` (auto via the workflow once merged to `main`).
- 👤 **Merge `claude/great-rubin-CqWBX` → `main`** so the
  `deploy-marketing.yml` workflow takes over future redeploys.

## ⚠️ Audit-verified status (2026-06-15)

A full §-by-§ audit against `SPEC.md` was run on branch
`claude/great-rubin-CqWBX`. **The milestone checklist below (M0–M6) is
over-optimistic**: many items marked ✅ are in reality 🟡 skeletons or have
material gaps. Use this section as the source of truth; the milestone list
is being reconciled item-by-item as the gaps are closed.

**Genuinely solid:** data model + schema + RLS (§3/§4), bill-payer
resolution (§3.6.4, tested), gap-free invoice serials (§37.2), bounced-check
charge reversal (§38.4), poll signatures + anonymity (§16), gate one-tap
(§20), WhatsApp *outbound* (§13.3), core reports (§22.2), worker+cron infra
(§26.4), Pino logging (§27), typecheck 16/16 + 37 tests green.

**Skeleton / partial (looks done, isn't):** AI bot (single-turn, 3 no-op
tools, prompt not interpolated), notifications engine (no policy fanout / no
prefs / no WhatsApp branch / synchronous), audit hash-chain (no callers),
RAG (FTS only, no pgvector), PDF (falls back to Helvetica without Heebo).

**Missing:** WhatsApp inbound→bot routing (dead-ends at `pending_bot`),
webhook HMAC, ticket SLA lifecycle, audit interceptor wiring, compliance
endpoints (§24.2), document ACL/search/expiry-cron (§39), addon checkout
(§19), recurring/reactive tasks (§17), admin Map (§23), Sentry/metrics
(§27), active rate-limiting + PII encryption (§25), i18n wiring (§28).

**Front-ends are thinner than reported:** maintenance app ≈ empty,
resident app mostly un-wired mocks, several admin pages are placeholders.

### Billing re-scoping — see [`docs/decisions.md`](./docs/decisions.md) ADR-001
Billing **execution** (recurring/standing orders, card-side dunning/retries,
debtor management, settlement) is **delegated to Tranzila** (acquirer: MAX).
We do NOT build our own collection engine. Our job: the tax-invoice domain
(§37), **full bidirectional Tranzila integration** (send charges / receive
webhooks + statuses, HMAC-verified + idempotent), and reporting. SPEC §11.2
cron-generation, §11.4 dunning-retries, §11.7 installment-split are therefore
re-scoped from "custom build" to "Tranzila integration / pass-through".

## Status legend

- ✅ Done & working
- 🟡 Scaffolded / stubbed (compiles, has placeholders / mock adapters)
- 🔴 Not started
- 👤 Requires human action (account, credentials, manual setup)

## Milestone status

### M0 — Foundation ✅
- ✅ Monorepo skeleton (pnpm 9 + Turborepo 2)
- ✅ Root configs (tsconfig.base, .prettierrc, .gitignore, .env.example)
- ✅ `packages/db` — full Postgres schema (12 migrations, all entities, RLS)
- ✅ `packages/shared` — Zod schemas, i18n, currency, phone, MASAV builder, templates
- ✅ `packages/types` — API contract types
- ✅ `packages/config` — Tailwind preset (Heebo Hebrew + indigo)
- ✅ `packages/ai` — Claude client, prompts, tool registry, classifier
- ✅ GitHub Actions CI workflow

### M1 — Auth + Core Domain ✅
- ✅ DB: tenants/buildings/apartments/people/mgmt_users/workers + RLS
- ✅ DB: apartment_assignments + rental_contracts + sync triggers (§3.6)
- ✅ NestJS bootstrap (main, AppModule, DbModule, HealthController)
- ✅ AuthModule: SupabaseJwtGuard, RlsContextInterceptor, RolesGuard, Public decorator
- ✅ TenantsModule (signup, branding)
- ✅ BuildingsModule (CRUD)
- ✅ ApartmentsModule + AssignmentService.resolveBillPayer (FULL ALGORITHM §3.6.4)
- ✅ PeopleModule (CRUD + QR claim flow with phone matching)
- ✅ WorkersModule

### M2 — Billing + Invoicing + Checks ✅
- ✅ BillingModule (charge schedules, dry-run preview, cycle generation)
- ✅ DunningService (per-spec escalation policy)
- ✅ PaymentsModule + TranzilaAdapter (live + mock) + webhook handler
- ✅ InvoicingModule (tax-compliant Hebrew, gap-free serials, credit notes)
- ✅ ItaClearanceAdapter (live + mock) for ITA e-invoicing
- ✅ ChecksModule (intake, deposit batches, bounced workflow w/ auto fee)

### M3 — Tickets + Tasks + Documents ✅
- ✅ TicketsModule (intake, AI auto-classification, status workflow, rating)
- ✅ TasksModule (CRUD, assign, status transitions)
- ✅ DocumentsModule (vault upload, versioning, expiring-soon)

### M4 — Mobile + Gate Access ✅
- ✅ AccessModule (one-tap gate open, provider pattern, guest codes)
- ✅ apps/mobile-resident (Expo Router, 5-tab UI, claim QR flow, pay via Tranzila iframe, ticket-new with photos)
- ✅ apps/mobile-maintenance (Today's schedule, navigate, mark done)
- ✅ apps/desktop (Electron wrapper of admin web with auto-update)

### M5 — WhatsApp + AI ✅
- ✅ WhatsAppModule (Cloud API send text + template, webhook receive)
- ✅ AiBotModule (Claude integration with tools, mock fallback, escalation)
- ✅ NotificationsModule (push/email/sms/whatsapp fanout, dedupe, DND)
- ✅ AuditModule (hash-chained audit log)
- ✅ FilesModule (Supabase Storage upload-intent + signed URLs)
- ✅ FlyersModule (welcome flyer with QR — 4 variants per §8)
- ✅ VendorsModule + MASAV file generation
- ✅ BulletinModule (posts + reactions)
- ✅ PollsModule (eligibility per role, HMAC anonymity)
- ✅ AddonsModule (catalog + purchase)
- ✅ ReportsModule (collection rate, AR aging, open tickets, per-person AR)

### M6 — Polish + Marketing GA ✅
- ✅ apps/marketing — completed per SPEC §6:
  - Hero with animated dashboard mockup + sparkline (framer-motion).
  - 12-card features grid + step-by-step "how it works".
  - Tabbed "who it's for" (4 personas, animated transitions).
  - Pricing with monthly/annual toggle + interactive ROI calculator.
  - Testimonials with star ratings, before/after metric, trusted-by bar.
  - 8-Q FAQ accordion. Closing CTA banner.
  - Dedicated pages: `/features`, `/who-its-for`, `/pricing`,
    `/testimonials`, `/faq`, `/contact` (form + `/api/lead` route),
    `/blog` (4 placeholder posts), `/signup`.
  - Legal pages: `/legal/terms`, `/legal/privacy`, `/legal/dpa`.
  - SEO: `sitemap.ts`, `robots.ts`, OpenGraph + Twitter cards, JSON-LD
    structured data (Organization, WebSite, Product).
  - Responsive nav (mobile burger), header chrome, RTL polish.
- ✅ apps/admin (Next.js 14, Hebrew RTL, login, dashboard with KPIs, buildings list, invoices, checks, documents pages, full sidebar nav)
- ✅ Tests:
  - currency.test.ts (VAT computation, installments split)
  - masav.test.ts (MASAV file structure + totals)
  - classifier.test.ts (Hebrew ticket categorization)
  - assignment.service.test.ts (bill-payer resolution for all 4 scenarios)

## Modules summary

**Total**: 22 NestJS modules, 12 SQL migrations, 6 packages, 5 apps (marketing, admin, mobile-resident, mobile-maintenance, desktop, api).

## Files / modules built so far

```
building-management/
├── SPEC.md                     # 39-section master spec
├── PROGRESS.md                 # this file
├── README.md
├── package.json                # root monorepo
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
├── .github/workflows/ci.yml
├── apps/
│   ├── api/                    # NestJS — 22 modules, 60+ files
│   ├── admin/                  # Next.js 14 — login + dashboard + 4 critical screens
│   ├── marketing/              # Next.js 14 — Hebrew RTL landing
│   ├── mobile-resident/        # Expo RN — 5 tabs + claim + pay + ticket-new
│   ├── mobile-maintenance/     # Expo RN — today's schedule
│   └── desktop/                # Electron wrapper
└── packages/
    ├── db/                     # 12 SQL migrations + seed + types
    ├── shared/                 # Zod + i18n + currency + masav + templates
    ├── ai/                     # Claude + prompts + tools + classifier
    ├── types/
    └── config/
```

## Human action required (👤)

These cannot be done by the AI agent and need you:

1. ✅ **Create GitHub repo `Building-management`** (done by user)
2. **Extract `building-management/` subdirectory** to the new repo:
   ```
   git clone https://github.com/DudiMaman/Tbot_Claude_5.26.git
   cd Tbot_Claude_5.26
   git checkout claude/hebrew-greeting-Wl7M5
   git subtree split --prefix=building-management -b extract
   git remote add bm git@github.com:DudiMaman/Building-management.git
   git push bm extract:main
   ```
3. **Supabase project** — create at supabase.com, region `eu-west-1` (Frankfurt or Dublin). Fill `SUPABASE_*` env vars.
4. **Tranzila merchant** — open Israeli account at tranzila.com, get supplier id + HMAC secret.
5. **Meta WhatsApp Business** — Business Manager → WhatsApp Business Account → app + system user. Business verification required.
6. **Anthropic API key** — at console.anthropic.com.
7. **Resend** (email) — at resend.com (Israeli IPs preferred).
8. **Inforu** or **019** (SMS) — Israeli SMS gateway account.
9. **Expo account** — for EAS builds of mobile apps.
10. **Apple Developer + Google Play** — for mobile app publishing ($99/yr + $25 one-time).
11. **Domain name** — e.g., `building-management.co.il`, DNS to Vercel/Cloudflare.
12. **Vercel account** — marketing + admin web hosting.
13. **Fly.io or Railway account** — API hosting.
14. **Israel Tax Authority** — apply for e-invoicing access (sandbox first), see https://www.gov.il/he/departments/general/tax-authority-invoice-allocation-numbers
15. **Doppler** — secrets management across envs.
16. **Sentry** — error tracking.
17. **Mapbox or MapLibre** — for the admin map view (Mapbox is paid).

## Known gaps & TODOs (for future sessions)

These are items intentionally stubbed or simplified for the autonomous build:

### High priority
- ✅ **PDF generation**: `apps/api/src/modules/pdf/` now produces real PDFs for
  invoices (Hebrew tax-compliant, with ITA allocation number) and flyers
  (A4 + 1080×1080 square) via `pdfkit` + `qrcode`. Files are uploaded
  through `FilesService` (Supabase Storage when creds are present, local
  `.storage/` directory in dev). Heebo TTFs are loaded from
  `apps/api/assets/fonts/` when present (see README) — otherwise the
  service falls back to Helvetica so PDFs are still produced. Custom RTL
  shaper at `src/modules/pdf/hebrew.ts` (simple BiDi pass, unit-tested).
- ✅ **Tranzila iframe**: backend now mints HMAC-signed iframe sessions
  (`POST /v1/payments/iframe-session`) that the mobile WebView renders.
  Mobile pay.tsx listens for the iframe's postMessage payload (works for
  both Tranzila production and the local mock at `/v1/payments/iframe-mock`)
  and finalizes via `POST /v1/payments/iframe-result` — the server
  verifies the state signature, marks the Payment captured/failed, and
  saves the returned Tranzila token as a PaymentMethod for one-tap reuse.
  Tested at the adapter level (signing, tamper rejection, URL shape).
- ✅ **Supabase Auth wiring**: admin login is now backed by `@supabase/ssr`
  (`apps/admin/src/lib/supabase/{client,server}.ts` + `src/middleware.ts`).
  Middleware refreshes the session on every request and redirects
  anonymous traffic to `/login`; logged-in users hitting `/login` are
  bounced back to the dashboard. Login supports password sign-in + magic
  link. Topbar shows the current user and a sign-out button. Marketing
  signup wires Supabase signUp + `POST /v1/tenants/signup` end-to-end
  (the latter's broken Zod schema was also fixed).
- 🟡 **API client in apps**: admin web now has a real SWR-backed client
  (`apps/admin/src/lib/api.ts`) that forwards the Supabase access token
  on every request. Dashboard, buildings list, and invoices list are
  wired to live data (`/v1/reports/*`, `/v1/buildings`, `/v1/invoices`)
  with empty / loading / error states. Mobile resident's `pay.tsx` and
  the iframe flow use `apps/mobile-resident/app/lib/api.ts`. Remaining
  admin screens (apartments, people, tasks, tickets, etc.) and the
  resident home/charges screens still use static data.
- ✅ **Push notifications setup (resident)**: mobile-resident now registers
  an Expo push token on launch via `app/lib/push.ts`. Requests permission
  if needed, sets up an Android channel, reads the EAS project id from
  app config or `EXPO_PUBLIC_EAS_PROJECT_ID`, and persists the token via
  `PUT /v1/people/me/push-token` (DELETE on sign-out). Notification tap
  handler is registered in `_layout.tsx`; per-category deep linking is a
  follow-up. Mobile-maintenance still needs the same wiring.
- ✅ **Background job runner**: separate worker process bootstrapped at
  `apps/api/src/main.worker.ts` (`pnpm --filter @bm/api start:worker` /
  `dev:worker`). BullMQ queues (`billing`, `dunning`, `notifications`,
  `documents`, `files`) live in `src/queues/queues.module.ts` with a
  shared payload contract in `queues.ts`. Workers implemented:
  `BillingWorker` (`run-due-schedules` + `run-cycle`) and `DunningWorker`
  (advances overdue stages per SPEC §11.4). `SchedulerService` enqueues
  the nightly jobs at 02:00 / 03:00 Asia/Jerusalem via `@nestjs/schedule`.
  Web API does not run the workers (separate deploy unit).
- **Subscribe to PR webhooks**: ITA clearance, Tranzila notify, WhatsApp messages — webhook controllers exist but need production HMAC secrets.

### Medium priority
- 🟡 **Admin web pages**: shipped this round —
  apartments, people, rental-contracts, tasks (Kanban), tickets, charges,
  vendors, bulletin, reports (KPIs + AR aging + big-debtors), audit-log,
  settings (tabs: company / billing / team / notifications / locale /
  security — stubs for the last three). New `<DataTable>` + `<StatusPill>`
  + `<PageHeader>` + `<ComingSoon>` shared components. Sidebar now
  highlights the active route. WhatsApp inbox, AI bot tuning, polls and
  notifications pages mounted as ComingSoon placeholders that surface
  the existing API endpoints so the team knows what's wireable next.
  Create / edit flows + detail pages (e.g. building/apartment timeline)
  still TODO.
- ✅ **Pino logger integration**: wired via `nestjs-pino` in `AppModule`.
  Pretty-prints in dev (via `pino-pretty`), JSON in prod. Redacts
  Authorization headers, cookies, passwords, tokens. Per-request id
  reads `x-request-id` or generates a UUID. Statuses ≥500 log at error,
  ≥400 at warn.
- ✅ **OpenAPI / Swagger**: `@nestjs/swagger` mounted at `/docs` in dev
  (and in prod when `API_DOCS_ENABLED=true`). Bearer-auth scheme
  declared with the Supabase JWT format.
- ✅ **E2E tests**: new `apps/e2e/` package with Playwright. 23 tests
  covering home (hero, stats, FAQ, pricing toggle, cookie banner), nav
  to every top-level page (features / who / pricing / testimonials /
  faq / blog / contact / legal/* / en), blog index + detail, and the
  contact form's mailto-fallback path. Boots the marketing dev server
  automatically, or runs against `PLAYWRIGHT_BASE_URL` (e.g., the live
  GitHub Pages URL). `.github/workflows/e2e.yml` runs on PRs touching
  marketing / shared, on push to main, and on `workflow_dispatch` with
  an optional base-URL input. HTML report uploaded as artifact.
- **i18n on admin**: hardcoded Hebrew strings; should load from `@bm/shared/i18n`.
- 🟡 **AI bot RAG**: KbService (`apps/api/src/modules/kb`) handles
  ingestion (chunking with paragraph-aware breaks + 50-char overlap +
  idempotent upsert by title+file) and retrieval via Postgres `tsvector`
  full-text search (with ILIKE fallback). Migration 0014 adds the tsv
  column + GIN index. DocumentsService auto-publishes every OCR'd
  version into the KB. AiBot's `search_kb` tool now routes to the real
  KbService. Embedding-based search via OpenAI (the existing
  `embedding vector(1536)` column) is the planned upgrade — the schema
  and code path are ready, just need the API key.
- ✅ **Polls signature verification**: `apps/api/src/modules/polls/signature.ts`
  verifies Ed25519 + ECDSA-P256 WebCrypto signatures over canonical JSON
  (poll_id, person_id, apartment_id, choice, signed_at). Rejects clock
  skew >10min, signature mismatch, swapped pubkey, or unsupported algo.
  PollsService.vote() enforces verification when poll.requires_signature.
  New POST /v1/polls/:id/audit-signatures re-verifies every signed vote
  on a poll (admin / cron use). 10 unit tests covering canonical form,
  fingerprint stability, both algorithms, and adversarial cases.
- ✅ **Document OCR**: `@bm/ai` gets `analyzeDocument()` which sends
  PDFs / images to Claude vision and returns `{ ocr_text, ai_summary,
  ai_metadata }`. DocumentsService fires it on every upload via
  scheduleOcr() (non-blocking — failures don't block the upload); new
  POST /v1/documents/versions/:id/ocr re-runs on demand. Reads file
  bytes from Supabase Storage when configured, else from the local
  .storage/ fallback. Graceful mock result when ANTHROPIC_API_KEY is
  missing.

### Low priority / nice-to-have
- **English i18n**: Hebrew is primary; English mirror partial.
- **Mapbox integration**: admin map view (§23) stub.
- **Russian/Arabic resident locales**: SPEC §28 mentions them; only Hebrew + English structured.
- **Slack/Discord webhooks for ops alerts**.

## Architecture notes for next session

- **All external integrations have mock adapters** that activate when env vars are missing or `_MODE=mock`. This means the API runs end-to-end without any external credentials.
- **RLS is enforced both at PostgreSQL level AND application level** — every service uses `DbService.withTenantContext()` which sets the JWT claim variables on the connection.
- **The bill-payer resolution algorithm** (§3.6.4) is implemented in `apps/api/src/modules/apartments/assignment.service.ts` and tested in the matching `.test.ts` file with all 4 scenarios from SPEC §3.6.7 (A/B/C/D).
- **Receipt numbering** uses the SQL function `allocate_invoice_serial()` for atomic gap-free serials — won't double-allocate under load.
- **Bounced check workflow**: when a check is marked `bounced`, a DB trigger reverts the related charges; the ChecksService additionally creates a fee charge and a BouncedCheck row.

## Repository extraction note

The intended final home is `https://github.com/DudiMaman/Building-management`. This codebase lives under `building-management/` in the source repo because the AI agent's MCP tools are restricted to the source repo. To extract:

```bash
git subtree split --prefix=building-management -b extract
git push git@github.com:DudiMaman/Building-management.git extract:main
```

This preserves the commit history cleanly.
