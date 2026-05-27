/**
 * Queue names + payload contracts.
 * One file so both producers (API) and consumers (worker) can import.
 */

export const QUEUE_NAMES = {
  billing: 'billing',
  dunning: 'dunning',
  notifications: 'notifications',
  documents: 'documents',
  files: 'files',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

// ---- Billing queue jobs ----

export interface BillingRunSchedulesJob {
  /** When omitted, runs for all tenants with active schedules. */
  tenantId?: string;
  /** ISO date — defaults to today (Asia/Jerusalem). */
  asOfDate?: string;
}

export interface BillingRunCycleJob {
  tenantId: string;
  scheduleId: string;
  dueDate: string; // ISO date
}

// ---- Dunning queue jobs ----

export interface DunningRunJob {
  /** When omitted, runs for all tenants. */
  tenantId?: string;
}

// ---- Notifications queue jobs ----

export interface NotificationsSendJob {
  notificationId: string;
}

// ---- Documents queue jobs ----

export interface DocumentsScanExpiriesJob {
  tenantId?: string;
}
