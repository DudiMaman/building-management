'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { MessageCircle } from 'lucide-react';
import { swrFetcher } from '@/lib/api';

interface Conversation {
  id: string;
  status: string;
  whatsapp_phone_e164: string | null;
  full_name: string | null;
  last_message: string | null;
  last_message_at: string | null;
}
interface Msg {
  id: string;
  direction: 'in' | 'out';
  sender_type: string;
  body: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending_bot: 'בוט',
  pending_human: 'ממתין לנציג',
  closed: 'סגור',
};

export default function WhatsappInboxPage() {
  const { data: convs, error, isLoading } = useSWR<Conversation[]>('/whatsapp/conversations', swrFetcher);
  const [active, setActive] = useState<string | null>(null);
  const { data: messages } = useSWR<Msg[]>(
    active ? `/whatsapp/conversations/${active}/messages` : null,
    swrFetcher,
  );

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold">WhatsApp — תיבת שיחות</h1>
        <p className="mt-1 text-sm text-slate-600">שיחות נכנסות, מענה הבוט והסלמה לנציג</p>
      </header>

      {isLoading && <p className="mt-8 text-sm text-slate-500">טוען…</p>}
      {error && <p className="mt-8 text-sm text-red-600">שגיאה בטעינת השיחות</p>}

      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {(convs ?? []).length === 0 && !isLoading && (
            <p className="p-6 text-sm text-slate-500">אין שיחות.</p>
          )}
          {(convs ?? []).map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`flex w-full items-start gap-3 border-b border-slate-100 p-4 text-right hover:bg-slate-50 ${active === c.id ? 'bg-primary-50' : ''}`}
            >
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{c.full_name ?? c.whatsapp_phone_e164 ?? 'לא ידוע'}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{c.last_message ?? ''}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="min-h-[400px] rounded-2xl border border-slate-200 bg-white p-5">
          {!active && <p className="text-sm text-slate-500">בחרו שיחה לצפייה.</p>}
          {active && (
            <div className="flex flex-col gap-2">
              {(messages ?? []).map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    m.direction === 'in'
                      ? 'self-start bg-slate-100 text-slate-800'
                      : 'self-end bg-primary-600 text-white'
                  }`}
                >
                  {m.body}
                </div>
              ))}
              {(messages ?? []).length === 0 && <p className="text-sm text-slate-500">אין הודעות.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
