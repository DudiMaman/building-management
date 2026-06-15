/**
 * AiBotService — customer-service AI bot powered by Claude.
 * Implements the tool registry from packages/ai/src/tools.ts and routes
 * tool calls to NestJS services.
 *
 * See SPEC §14.
 */
import { Injectable, Logger } from '@nestjs/common';
import { completeWithTools, CUSTOMER_SERVICE_PROMPT_V1, ALL_BOT_TOOLS, type PromptContext } from '@bm/ai';
import { DbService } from '../../db/db.service';
import { AssignmentService } from '../apartments/assignment.service';
import { TicketsService } from '../tickets/tickets.service';
import { KbService } from '../kb/kb.service';
import type { Message } from '@bm/db';

interface BotContext {
  promptCtx: PromptContext;
  personId?: string;
  buildingId?: string;
  apartmentId?: string;
}

@Injectable()
export class AiBotService {
  private readonly logger = new Logger(AiBotService.name);

  constructor(
    private readonly db: DbService,
    private readonly assignments: AssignmentService,
    private readonly tickets: TicketsService,
    private readonly kb: KbService,
  ) {}

  /**
   * Send a user turn into the conversation. The bot processes it, possibly
   * calls tools, and returns its reply. Returns escalation signal if needed.
   */
  async respond(
    tenantId: string,
    conversationId: string,
    userText: string,
  ): Promise<{ reply: string; escalated: boolean; tools_used: string[] }> {
    // Load context: conversation + person info
    const ctx = await this.loadContext(tenantId, conversationId);
    const systemPrompt = CUSTOMER_SERVICE_PROMPT_V1(ctx.promptCtx);

    // No API key → deterministic mock so the platform runs without credentials.
    if (!process.env.ANTHROPIC_API_KEY) {
      return this.mockRespond(userText, ctx.promptCtx);
    }

    // Build the message history. The current user turn may already be the most
    // recent stored message (WhatsApp flow persists inbound before replying);
    // only append it when it isn't already there to avoid duplicating it.
    const recentMessages = await this.loadRecentMessages(conversationId);
    const history = recentMessages.map((m) => ({
      role: (m.direction === 'in' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.body ?? '',
    }));
    const last = history[history.length - 1];
    if (!(last && last.role === 'user' && last.content === userText)) {
      history.push({ role: 'user', content: userText });
    }

    const { reply, toolsUsed, escalated } = await completeWithTools({
      systemPrompt,
      messages: history,
      tools: ALL_BOT_TOOLS,
      executeTool: (name, input) => this.executeTool(tenantId, ctx, name, input),
    });

    return {
      reply: reply || 'אני אשמח לעזור — תוכלו לפרט יותר?',
      escalated,
      tools_used: toolsUsed,
    };
  }

  private async executeTool(
    tenantId: string,
    ctx: BotContext,
    name: string,
    input: Record<string, any>,
  ) {
    switch (name) {
      case 'lookup_balance':
        return this.lookupBalance(tenantId, input.person_id ?? ctx.personId);
      case 'lookup_ticket':
        return this.lookupTicket(tenantId, input.ticket_id);
      case 'create_ticket': {
        const buildingId = input.building_id ?? ctx.buildingId;
        if (!buildingId) {
          return { error: 'missing_building', message: 'לא ניתן לפתוח פנייה ללא שיוך לבניין.' };
        }
        return this.tickets.create(tenantId, input.person_id ?? ctx.personId ?? null, {
          building_id: buildingId,
          apartment_id: input.apartment_id ?? ctx.apartmentId,
          title: input.title,
          description: input.description,
          category: input.category ?? 'other',
          priority: input.priority ?? 'med',
          photos: input.photos ?? [],
        });
      }
      case 'schedule_callback': {
        const buildingId = input.building_id ?? ctx.buildingId;
        if (!buildingId) {
          return { error: 'missing_building', message: 'נא לציין בניין כדי לתאם חזרה.' };
        }
        return this.tickets.create(tenantId, input.person_id ?? ctx.personId ?? null, {
          building_id: buildingId,
          apartment_id: ctx.apartmentId,
          title: 'בקשת חזרה טלפונית',
          description: `הפונה ביקש שיחזרו אליו. מועד מבוקש: ${input.when ?? 'בהקדם'}. סיבה: ${input.reason ?? '—'}`,
          category: 'other',
          priority: 'med',
          photos: [],
        });
      }
      case 'who_is_my_bill_payer':
        return this.assignments.listCurrent(tenantId, input.apartment_id ?? ctx.apartmentId);
      case 'building_info':
      case 'search_kb': {
        const q = String(input.query ?? input.key ?? '');
        const hits = await this.kb.search(tenantId, q, Number(input.limit ?? 5));
        return hits.map((h) => ({ document: h.document_title, content: h.content, rank: h.rank }));
      }
      default:
        return { ok: false, error: `unknown_tool:${name}` };
    }
  }

  private async lookupTicket(tenantId: string, ticketId?: string) {
    if (!ticketId) return { error: 'missing_ticket_id' };
    const { rows } = await this.db.query(
      `select id, title, status, priority, category, opened_at, resolved_at, closed_at
       from service_tickets where tenant_id = $1 and id = $2`,
      [tenantId, ticketId],
    );
    return rows[0] ?? { error: 'ticket_not_found' };
  }

  private async lookupBalance(tenantId: string, personId?: string) {
    if (!personId) return [];
    const { rows } = await this.db.query(
      `select id, description, amount, due_date, status
       from charges
       where tenant_id = $1 and billed_to_person_id = $2
         and status in ('pending', 'partial', 'overdue')
       order by due_date`,
      [tenantId, personId],
    );
    return rows;
  }

  /** Per-tenant bot tuning, stored under tenants.settings.bot (SPEC §14.8). */
  async getSettings(tenantId: string): Promise<{ tone?: string; custom_rules?: string; enabled?: boolean }> {
    const { rows } = await this.db.query<{ bot: any }>(
      `select settings -> 'bot' as bot from tenants where id = $1`,
      [tenantId],
    );
    return rows[0]?.bot ?? {};
  }

  async updateSettings(
    tenantId: string,
    settings: { tone?: string; custom_rules?: string; enabled?: boolean },
  ) {
    const { rows } = await this.db.query<{ bot: any }>(
      `update tenants
       set settings = jsonb_set(coalesce(settings, '{}'::jsonb), '{bot}', $2::jsonb, true),
           updated_at = now()
       where id = $1
       returning settings -> 'bot' as bot`,
      [tenantId, JSON.stringify(settings)],
    );
    return rows[0]?.bot ?? settings;
  }

  private async loadContext(tenantId: string, conversationId: string): Promise<BotContext> {
    const settings = await this.getSettings(tenantId);
    const { rows } = await this.db.query<{
      tenant_name: string;
      person_id: string | null;
      full_name: string | null;
      building_id: string | null;
      building_name: string | null;
      apartment_id: string | null;
      apartment_unit: string | null;
    }>(
      `select t.name as tenant_name, c.person_id, p.full_name,
              c.building_id, b.name as building_name,
              c.apartment_id, a.unit_number as apartment_unit
       from conversations c
       join tenants t on t.id = c.tenant_id
       left join people p on p.id = c.person_id
       left join buildings b on b.id = c.building_id
       left join apartments a on a.id = c.apartment_id
       where c.id = $1`,
      [conversationId],
    );
    const r = rows[0];
    return {
      personId: r?.person_id ?? undefined,
      buildingId: r?.building_id ?? undefined,
      apartmentId: r?.apartment_id ?? undefined,
      promptCtx: {
        tenant_name: r?.tenant_name ?? '',
        building_name: r?.building_name ?? undefined,
        person_name: r?.full_name ?? undefined,
        apartment_unit: r?.apartment_unit ?? undefined,
        language: 'he',
        business_hours_open: this.isBusinessHours(),
        tone: settings.tone,
        custom_rules: settings.custom_rules,
      },
    };
  }

  private async loadRecentMessages(conversationId: string): Promise<Message[]> {
    const { rows } = await this.db.query<Message>(
      `select * from messages where conversation_id = $1 order by created_at desc limit 20`,
      [conversationId],
    );
    return rows.reverse();
  }

  private isBusinessHours(): boolean {
    const d = new Date();
    const h = (d.getUTCHours() + 3) % 24; // Israel offset
    const dow = d.getDay();
    return dow >= 0 && dow <= 4 && h >= 9 && h < 18;
  }

  private mockRespond(text: string, ctx: PromptContext) {
    const lower = text.toLowerCase();
    if (/בן.?אדם|נציג|אנושי/.test(text)) {
      return {
        reply: 'אני מעביר אתכם לנציג אנושי. צוות השירות יחזור אליכם בקרוב.',
        escalated: true,
        tools_used: ['escalate_to_human'],
      };
    }
    if (/חיוב|יתרה|לשלם/.test(text)) {
      return {
        reply: `שלום ${ctx.person_name ?? ''}. אבדוק את החיובים הפתוחים שלכם. ${ctx.outstanding_balance ?? ''}`,
        escalated: false,
        tools_used: ['lookup_balance'],
      };
    }
    if (/תקלה|בעיה|נזיל|לא עובד/.test(text)) {
      return {
        reply: 'אצור עבורכם פנייה. נא תיאור קצר של המיקום והתקלה.',
        escalated: false,
        tools_used: [],
      };
    }
    return { reply: 'תוכלו לפרט יותר במה אוכל לעזור?', escalated: false, tools_used: [] };
  }
}
