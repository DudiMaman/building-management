import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DbService } from '../../../db/db.service';

/**
 * WhatsApp notification sender. Self-contained (does not depend on the
 * WhatsApp module) to keep the notifications engine free of cross-module
 * cycles. Sends a free-form text message via the Graph API; in production,
 * messages outside the 24h service window must use approved templates.
 */
@Injectable()
export class WhatsappNotifSender {
  private readonly logger = new Logger(WhatsappNotifSender.name);
  private readonly baseUrl = 'https://graph.facebook.com/v21.0';

  constructor(private readonly db: DbService) {}

  async send(personId: string, body: string): Promise<string | undefined> {
    const { rows } = await this.db.query<{ phone_e164: string }>(
      `select phone_e164 from people where id = $1 and phone_e164 is not null`,
      [personId],
    );
    const phone = rows[0]?.phone_e164;
    if (!phone) return undefined;

    if (process.env.WHATSAPP_MODE === 'mock' || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      this.logger.log(`[MOCK whatsapp] to=${phone} body="${body.slice(0, 40)}..."`);
      return `mock_wa_${Date.now()}`;
    }
    const res = await axios.post(
      `${this.baseUrl}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      { messaging_product: 'whatsapp', to: phone.replace('+', ''), type: 'text', text: { body } },
      {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
        timeout: 15_000,
      },
    );
    return res.data?.messages?.[0]?.id as string;
  }
}
