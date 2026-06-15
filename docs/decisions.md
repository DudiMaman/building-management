# Architecture Decisions (ADR log)

Short, durable records of cross-cutting decisions. Newest first.

---

## ADR-001 — Billing execution is delegated to Tranzila; MAX is the acquirer

**Status:** Accepted (2026-06-15) · **Owner:** Dudi

### Context
Our product is a building-management **platform / CRM / communication layer**.
We are NOT a payment processor. We integrate with:

- **Tranzila** — the payment technology provider. Tranzila already provides
  recurring charges (הוראת קבע / tokenized standing orders), debtor
  management, retries, and collection. We connect to it.
- **MAX (max.co.il)** — the credit-card **acquirer (סולק)** behind the
  Tranzila flow.

### Decision
1. **Do NOT build our own collection engine.** Anything Tranzila already does
   — recurring/standing-order execution, payment retries, card-level debtor
   management, settlement — is **delegated to Tranzila**, not reimplemented.
2. **What we DO own (must stay in our DB):**
   - The **charge / invoice domain model** — needed for Israeli tax-compliant
     invoicing (חשבונית מס/קבלה), resident-facing visibility, and reporting.
   - **Israeli tax invoicing** (§37) and **ITA clearance** — a tax/legal duty
     that is ours, independent of who collects the money.
   - **Reporting & AR views** (§22) computed from synced statuses.
3. **The integration is the priority, and must be FULL and bidirectional:**
   - **Outbound to Tranzila:** create/cancel standing orders (tokenized
     recurring), one-off token charges, refunds, iframe sessions.
   - **Inbound from Tranzila:** webhooks for every status transition
     (authorized / captured / failed / refunded / chargeback / recurring
     cycle result), with **HMAC signature verification** and
     **idempotent** processing (dedupe by Tranzila txn id).
   - **Status sync:** Tranzila is the source of truth for payment status;
     our `payments` / `charges` reflect it, and we issue the tax invoice on
     `captured`.

### Consequences for the SPEC gaps
Several SPEC §11 items that an earlier audit flagged as "missing engine" are
**re-scoped to Tranzila integration**, not custom builds:

- §11.2 cron-driven recurring **generation** → use Tranzila standing orders;
  our cron only *reconciles* status, it does not "collect".
- §11.4 **dunning / retries** → Tranzila owns retry/escalation on the card
  side. We keep only *communication* dunning (reminder messages via our
  notifications engine) and reflect Tranzila's debtor status.
- §11.7 **installments (תשלומים)** → passed through to Tranzila on the charge
  request; we don't split-capture ourselves.

Still ours and still required: tax invoice numbering/issuance (§37),
webhook ingestion + idempotency + signature (§11.3), `payment.captured` →
auto-issue invoice (§37.3), reporting (§22), resident visibility.

### Notes
- MAX-specific parameters (terminal/supplier identifiers) are configured on
  the Tranzila account; our code targets the Tranzila API surface and treats
  the acquirer as a Tranzila configuration concern.
