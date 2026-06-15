/**
 * WhatsAppService — Meta WhatsApp Business Cloud API integration.
 * See SPEC §13.
 */
import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import axios from 'axios';
import { DbService } from '../../db/db.service';
import { findTemplate } from '@bm/shared';
import { AiBotService } from '../ai-bot/ai-bot.service';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly baseUrl = 'https://graph.facebook.com/v21.0';

  constructor(
    private readonly db: DbService,
    private readonly bot: AiBotService,
  ) {}

  async sendText(toE164: string, body: string): Promise<string | undefined> {
    if (process.env.WHATSAPP_MODE === 'mock' || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      this.logger.log(`[MOCK whatsapp] to=${toE164} body="${body.slice(0, 40)}..."`);
      return `mock_wa_${Date.now()}`;
    }
    const res = await axios.post(
      `${this.baseUrl}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: toE164.replace('+', ''),
        type: 'text',
        text: { body },
      },
      {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
        timeout: 15_000,
      },
    );
    return res.data?.messages?.[0]?.id as string;
  }

  async sendTemplate(toE164: string, templateKey: string, vars: Record<string, string>): Promise<string | undefined> {
    const tmpl = findTemplate(templateKey, 'whatsapp');
    if (!tmpl?.meta_template_name) {
      this.logger.warn(`Template not found or not configured: ${templateKey}`);
      return undefined;
    }
    if (process.env.WHATSAPP_MODE === 'mock') {
      this.logger.log(`[MOCK whatsapp template] to=${toE164} name=${tmpl.meta_template_name}`);
      return `mock_wat_${Date.now()}`;
    }
    const components = Object.values(vars).map((v) => ({ type: 'text', text: v }));
    const res = await axios.post(
      `${this.baseUrl}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: toE164.replace('+', ''),
        type: 'template',
        template: {
          name: tmpl.meta_template_name,
          language: { code: tmpl.meta_template_lang ?? 'he' },
          components: [{ type: 'body', parameters: components }],
        },
      },
      {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
        timeout: 15_000,
      },
    );
    return res.data?.messages?.[0]?.id as string;
  }

  /** Process inbound webhook message: find conversation, append message. */
  async ingestInbound(payload: any) {
    const entry = payload?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const phoneNumberId = value?.metadata?.phone_number_id;
    const messages = value?.messages ?? [];

    for (const m of messages) {
      const from = `+${m.from}`;
      const body: string | undefined = m.text?.body;
      const wamid = m.id;

      // Resolve tenant by phone_number_id (in production: lookup table)
      const tenantRes = await this.db.query<{ tenant_id: string }>(
        `select id as tenant_id from tenants where settings ->> 'whatsapp_phone_number_id' = $1 limit 1`,
        [phoneNumberId],
      );
      if (tenantRes.rows.length === 0) {
        this.logger.warn(`Unknown WA phone_number_id: ${phoneNumberId}`);
        continue;
      }
      const tenantId = tenantRes.rows[0]!.tenant_id;

      // Find or create person
      const personRes = await this.db.query<{ id: string }>(
        `select id from people where tenant_id = $1 and phone_e164 = $2 limit 1`,
        [tenantId, from],
      );
      let personId = personRes.rows[0]?.id;

      // Find/create conversation
      let convId: string;
      let convStatus: string;
      const convRes = await this.db.query<{ id: string; status: string }>(
        `select id, status from conversations
         where tenant_id = $1 and channel = 'whatsapp' and whatsapp_phone_e164 = $2
           and status <> 'closed' limit 1`,
        [tenantId, from],
      );
      if (convRes.rows.length > 0) {
        convId = convRes.rows[0]!.id;
        convStatus = convRes.rows[0]!.status;
      } else {
        const ins = await this.db.query<{ id: string }>(
          `insert into conversations (tenant_id, person_id, channel, status, whatsapp_phone_e164, last_message_at)
           values ($1, $2, 'whatsapp', 'pending_bot', $3, now()) returning id`,
          [tenantId, personId ?? null, from],
        );
        convId = ins.rows[0]!.id;
        convStatus = 'pending_bot';
      }

      // Persist inbound. The unique index on whatsapp_message_id makes this
      // idempotent: a webhook retry inserts 0 rows, so we skip re-replying.
      const msgIns = await this.db.query(
        `insert into messages (tenant_id, conversation_id, direction, sender_type, body, whatsapp_message_id, status, created_at)
         values ($1, $2, 'in', 'resident', $3, $4, 'delivered', now())
         on conflict do nothing
         returning id`,
        [tenantId, convId, body ?? '', wamid],
      );
      if (msgIns.rowCount === 0) continue;

      await this.db.query(`update conversations set last_message_at = now() where id = $1`, [convId]);

      // Auto-reply only while the bot owns the conversation. Once escalated to
      // a human (status = pending_human), inbound messages just queue silently.
      if (convStatus === 'pending_bot' && body) {
        await this.handleBotTurn(tenantId, convId, from, body);
      }
    }
  }

  /**
   * Run one bot turn for an inbound WhatsApp message: ask the bot, store the
   * outbound message, send it via the Graph API, and escalate to a human when
   * the bot decides to. Never throws — webhook delivery must always 200.
   */
  private async handleBotTurn(tenantId: string, convId: string, toE164: string, body: string) {
    try {
      const { reply, escalated } = await this.bot.respond(tenantId, convId, body);

      const wamid = await this.sendText(toE164, reply);
      await this.db.query(
        `insert into messages (tenant_id, conversation_id, direction, sender_type, body, whatsapp_message_id, status, created_at)
         values ($1, $2, 'out', 'bot', $3, $4, 'sent', now())`,
        [tenantId, convId, reply, wamid ?? null],
      );

      await this.db.query(
        `update conversations set status = $2, last_message_at = now() where id = $1`,
        [convId, escalated ? 'pending_human' : 'pending_bot'],
      );
    } catch (err) {
      this.logger.error(`Bot turn failed for conversation ${convId}: ${(err as Error).message}`);
    }
  }

  /**
   * Verify Meta's `x-hub-signature-256` HMAC over the raw request body.
   * When `WHATSAPP_APP_SECRET` is unset (local/mock), verification is skipped.
   */
  verifySignature(rawBody: Buffer | undefined, signatureHeader?: string): boolean {
    const secret = process.env.WHATSAPP_APP_SECRET;
    if (!secret) {
      this.logger.warn('WHATSAPP_APP_SECRET unset — skipping webhook signature check (dev mode)');
      return true;
    }
    if (!rawBody || !signatureHeader?.startsWith('sha256=')) return false;
    const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signatureHeader);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  verifyToken(query: { 'hub.mode'?: string; 'hub.challenge'?: string; 'hub.verify_token'?: string }) {
    if (query['hub.mode'] === 'subscribe' && query['hub.verify_token'] === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      return query['hub.challenge'];
    }
    return null;
  }
}
