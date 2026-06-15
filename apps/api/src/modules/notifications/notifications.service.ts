/**
 * NotificationsService — central fanout across channels.
 *
 * Layers:
 *   send()           — one concrete (person, channel) message: template, DND,
 *                      dedupe, persist, dispatch.
 *   notifyPerson()   — resolve a person's preferred channels + rate limit,
 *                      then send() on each.
 *   notifyApartment()— resolve recipients from the apartment's
 *                      notification_policy (SPEC §3.6.6) then notifyPerson().
 *
 * See SPEC §21 and §3.6.6.
 */
import { Injectable, Logger } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { ExpoPushSender } from './senders/expo-push.sender';
import { ResendEmailSender } from './senders/resend-email.sender';
import { InforuSmsSender } from './senders/inforu-sms.sender';
import { WhatsappNotifSender } from './senders/whatsapp.sender';
import { findTemplate, renderTemplate, templateChannels } from '@bm/shared';
import { NOTIFICATION_DND_HOURS } from '@bm/shared';
import type { NotificationChannel } from '@bm/db';

export interface SendInput {
  tenant_id: string;
  recipient_person_id?: string;
  recipient_user_id?: string;
  channel: NotificationChannel;
  template_key: string;
  vars: Record<string, string | number>;
  dedupe_key?: string;
  bypass_dnd?: boolean;
  critical?: boolean;
}

/** Recipient roles understood by the per-apartment notification policy. */
type PolicyRole = 'bill_payer' | 'payer' | 'primary_owner' | 'all_owners' | 'occupants';

interface NotifyOptions {
  /** Override the person's preferred channels. */
  channels?: NotificationChannel[];
  /** Critical messages bypass DND and the daily rate limit. */
  critical?: boolean;
  /** Stable key for idempotency; combined with channel per message. */
  event_key?: string;
}

const DEFAULT_CHANNELS: NotificationChannel[] = ['push'];
const MAX_NONCRITICAL_PER_DAY = 5;

/** Default policy when an apartment hasn't configured `notification_policy`. */
const DEFAULT_POLICY: Record<string, { to: PolicyRole[]; cc?: PolicyRole[] }> = {
  charge_due: { to: ['bill_payer'] },
  charge_overdue: { to: ['bill_payer'], cc: ['primary_owner'] },
  payment_failed: { to: ['bill_payer'] },
  payment_receipt: { to: ['bill_payer'] },
  check_bounced: { to: ['bill_payer'], cc: ['primary_owner'] },
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly db: DbService,
    private readonly push: ExpoPushSender,
    private readonly email: ResendEmailSender,
    private readonly sms: InforuSmsSender,
    private readonly whatsapp: WhatsappNotifSender,
  ) {}

  // ---- Layer 1: single concrete (person, channel) message ------------------

  async send(input: SendInput) {
    if (!input.bypass_dnd && !input.critical && this.inDnd()) {
      this.logger.debug(`Notification skipped due to DND: ${input.template_key}`);
      return { ok: false, reason: 'dnd' };
    }

    if (input.dedupe_key) {
      const existing = await this.db.query(
        `select 1 from notifications where tenant_id = $1 and dedupe_key = $2 limit 1`,
        [input.tenant_id, input.dedupe_key],
      );
      if (existing.rows.length > 0) return { ok: false, reason: 'duplicate' };
    }

    const template = findTemplate(input.template_key, input.channel);
    if (!template) {
      this.logger.warn(`Template not found: ${input.template_key}/${input.channel}`);
      return { ok: false, reason: 'no_template' };
    }
    const body = renderTemplate(template.body, input.vars);
    const subject = template.subject ? renderTemplate(template.subject, input.vars) : undefined;

    const { rows } = await this.db.query(
      `insert into notifications
        (tenant_id, recipient_person_id, recipient_user_id, channel, template_key, payload, dedupe_key, status)
       values ($1, $2, $3, $4, $5, $6, $7, 'queued') returning id`,
      [
        input.tenant_id,
        input.recipient_person_id ?? null,
        input.recipient_user_id ?? null,
        input.channel,
        input.template_key,
        JSON.stringify({ vars: input.vars, body, subject, critical: input.critical ?? false }),
        input.dedupe_key ?? null,
      ],
    );
    const notifId = (rows[0] as any).id as string;

    try {
      let providerMessageId: string | undefined;
      const pid = input.recipient_person_id;
      if (pid) {
        if (input.channel === 'push') providerMessageId = await this.push.send(pid, subject ?? '', body);
        else if (input.channel === 'email') providerMessageId = await this.email.send(pid, subject ?? '', body);
        else if (input.channel === 'sms') providerMessageId = await this.sms.send(pid, body);
        else if (input.channel === 'whatsapp') providerMessageId = await this.whatsapp.send(pid, body);
      }
      await this.db.query(
        `update notifications set status = 'sent', sent_at = now(), provider_message_id = $2 where id = $1`,
        [notifId, providerMessageId ?? null],
      );
      return { ok: true, id: notifId };
    } catch (err) {
      this.logger.warn(`Notification send failed: ${(err as Error).message}`);
      await this.db.query(`update notifications set status = 'failed' where id = $1`, [notifId]);
      return { ok: false, reason: (err as Error).message };
    }
  }

  /** Recent notification rows for the tenant (admin delivery log). */
  async listRecent(tenantId: string, limit = 100) {
    const { rows } = await this.db.query(
      `select n.id, n.channel, n.template_key, n.status, n.provider_message_id,
              n.sent_at, n.created_at, p.full_name as recipient_name
       from notifications n
       left join people p on p.id = n.recipient_person_id
       where n.tenant_id = $1
       order by n.created_at desc
       limit $2`,
      [tenantId, limit],
    );
    return rows;
  }

  // ---- Layer 2: a person across their preferred channels -------------------

  /**
   * Send a templated message to one person across their preferred channels,
   * honouring mute, DND and the daily rate limit (critical bypasses both).
   */
  async notifyPerson(
    tenantId: string,
    personId: string,
    templateKey: string,
    vars: Record<string, string | number>,
    opts: NotifyOptions = {},
  ) {
    const prefs = await this.loadPrefs(tenantId, personId);
    if (prefs.muted && !opts.critical) {
      return { ok: false, reason: 'muted' };
    }
    // Auto-personalize {{name}} from the person record unless the caller set it.
    const personalizedVars =
      vars.name === undefined && prefs.full_name ? { ...vars, name: prefs.full_name } : vars;
    if (!opts.critical && (await this.overDailyLimit(tenantId, personId))) {
      this.logger.debug(`Rate limit hit for person ${personId}`);
      return { ok: false, reason: 'rate_limited' };
    }

    // Prefer the desired channels, but only those that actually have a
    // template for this key. If none overlap, fall back to whatever sendable
    // channels do have a template, so a configured event always reaches the
    // person even when per-channel template coverage is sparse.
    const SENDABLE: NotificationChannel[] = ['push', 'email', 'sms', 'whatsapp'];
    const available = templateChannels(templateKey).filter((c): c is NotificationChannel =>
      (SENDABLE as string[]).includes(c),
    );
    const desired = opts.channels ?? prefs.channels ?? DEFAULT_CHANNELS;
    let channels = desired.filter((c) => available.includes(c));
    if (channels.length === 0) channels = available;
    if (channels.length === 0) {
      this.logger.warn(`No sendable template for ${templateKey}`);
      return { ok: false, reason: 'no_template' };
    }

    const results = [];
    for (const channel of channels) {
      results.push(
        await this.send({
          tenant_id: tenantId,
          recipient_person_id: personId,
          channel,
          template_key: templateKey,
          vars: personalizedVars,
          critical: opts.critical,
          bypass_dnd: opts.critical,
          dedupe_key: opts.event_key ? `${opts.event_key}:${personId}:${channel}` : undefined,
        }),
      );
    }
    return { ok: results.some((r) => r.ok), results };
  }

  // ---- Layer 3: apartment policy fanout (SPEC §3.6.6) ----------------------

  /**
   * Resolve the recipients for an apartment-scoped event from the apartment's
   * `notification_policy` (falling back to DEFAULT_POLICY) and notify each.
   */
  async notifyApartment(
    tenantId: string,
    apartmentId: string,
    eventType: string,
    templateKey: string,
    vars: Record<string, string | number>,
    opts: NotifyOptions = {},
  ) {
    const recipients = await this.resolveApartmentRecipients(tenantId, apartmentId, eventType);
    if (recipients.length === 0) {
      this.logger.warn(`No recipients resolved for ${eventType} on apartment ${apartmentId}`);
      return { ok: false, reason: 'no_recipients' };
    }
    const results = [];
    for (const personId of recipients) {
      results.push(await this.notifyPerson(tenantId, personId, templateKey, vars, opts));
    }
    return { ok: results.some((r) => r.ok), recipients, results };
  }

  /** Map policy roles → concrete current person ids via apartment_assignments. */
  private async resolveApartmentRecipients(
    tenantId: string,
    apartmentId: string,
    eventType: string,
  ): Promise<string[]> {
    const policyRow = await this.db.query<{ notification_policy: Record<string, any> }>(
      `select notification_policy from apartments where id = $1 and tenant_id = $2`,
      [apartmentId, tenantId],
    );
    const configured = policyRow.rows[0]?.notification_policy?.[eventType];
    const rule = configured ?? DEFAULT_POLICY[eventType] ?? { to: ['bill_payer'] as PolicyRole[] };
    const roles: PolicyRole[] = [...(rule.to ?? []), ...(rule.cc ?? [])];

    const { rows } = await this.db.query<{
      person_id: string;
      role: string;
      is_bill_payer: boolean;
      is_primary: boolean;
      is_occupant: boolean;
    }>(
      `select person_id, role, is_bill_payer, is_primary, is_occupant
       from apartment_assignments
       where tenant_id = $1 and apartment_id = $2 and status = 'active' and valid_to is null`,
      [tenantId, apartmentId],
    );

    const ids = new Set<string>();
    for (const role of roles) {
      for (const a of rows) {
        const match =
          (role === 'bill_payer' || role === 'payer') ? a.is_bill_payer :
          role === 'primary_owner' ? a.role === 'owner' && a.is_primary :
          role === 'all_owners' ? a.role === 'owner' :
          role === 'occupants' ? a.is_occupant :
          false;
        if (match) ids.add(a.person_id);
      }
    }
    return [...ids];
  }

  // ---- Preferences, rate limit, DND ---------------------------------------

  private async loadPrefs(
    tenantId: string,
    personId: string,
  ): Promise<{ channels?: NotificationChannel[]; muted?: boolean; full_name?: string }> {
    const { rows } = await this.db.query<{
      notification_prefs: Record<string, any>;
      full_name: string | null;
    }>(
      `select notification_prefs, full_name from people where id = $1 and tenant_id = $2`,
      [personId, tenantId],
    );
    const prefs = rows[0]?.notification_prefs ?? {};
    const channels = Array.isArray(prefs.channels) ? (prefs.channels as NotificationChannel[]) : undefined;
    return { channels, muted: prefs.muted === true, full_name: rows[0]?.full_name ?? undefined };
  }

  private async overDailyLimit(tenantId: string, personId: string): Promise<boolean> {
    const { rows } = await this.db.query<{ n: string }>(
      `select count(*)::text as n from notifications
       where tenant_id = $1 and recipient_person_id = $2
         and created_at > now() - interval '24 hours'
         and coalesce((payload ->> 'critical')::boolean, false) = false`,
      [tenantId, personId],
    );
    return Number(rows[0]?.n ?? '0') >= MAX_NONCRITICAL_PER_DAY;
  }

  /** DND window in Israel local time (DST-correct via the tz database). */
  private inDnd(now: Date = new Date()): boolean {
    const h = this.israelHour(now);
    const { start, end } = NOTIFICATION_DND_HOURS;
    return start > end ? h >= start || h < end : h >= start && h < end;
  }

  private israelHour(now: Date): number {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour: 'numeric',
      hour12: false,
    }).formatToParts(now);
    const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '0';
    return Number(hourPart) % 24;
  }
}
