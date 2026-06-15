'use client';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';

interface NotifRow {
  id: string;
  channel: string;
  template_key: string;
  status: string;
  recipient_name: string | null;
  sent_at: string | null;
  created_at: string;
}
interface TemplateRow {
  key: string;
  channel: string;
  locale: string;
  subject: string | null;
}

const CHANNEL_LABEL: Record<string, string> = {
  push: 'דחיפה',
  email: 'אימייל',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  in_app: 'באפליקציה',
};
const STATUS_CLASS: Record<string, string> = {
  sent: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  queued: 'bg-slate-100 text-slate-700',
};

export default function NotificationsPage() {
  const { data: log, isLoading } = useSWR<NotifRow[]>('/notifications', swrFetcher);
  const { data: templates } = useSWR<TemplateRow[]>('/notifications/templates', swrFetcher);

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold">התראות</h1>
        <p className="mt-1 text-sm text-slate-600">יומן מסירה, ערוצים וקטלוג טמפלייטים</p>
      </header>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-700">יומן מסירה אחרון</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">נמען</th>
                <th className="px-6 py-3">תבנית</th>
                <th className="px-6 py-3">ערוץ</th>
                <th className="px-6 py-3">סטטוס</th>
                <th className="px-6 py-3">נשלח</th>
              </tr>
            </thead>
            <tbody>
              {(log ?? []).map((n) => (
                <tr key={n.id} className="border-t border-slate-100">
                  <td className="px-6 py-3">{n.recipient_name ?? '—'}</td>
                  <td className="px-6 py-3 font-mono text-xs">{n.template_key}</td>
                  <td className="px-6 py-3">{CHANNEL_LABEL[n.channel] ?? n.channel}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${STATUS_CLASS[n.status] ?? 'bg-slate-100 text-slate-700'}`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-slate-400">
                    {n.sent_at ? new Date(n.sent_at).toLocaleString('he-IL') : '—'}
                  </td>
                </tr>
              ))}
              {!isLoading && (log ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">עדיין לא נשלחו התראות.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-700">קטלוג טמפלייטים</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(templates ?? []).map((t, i) => (
            <span key={`${t.key}-${t.channel}-${i}`} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs">
              <span className="font-mono">{t.key}</span>
              <span className="text-slate-400"> · {CHANNEL_LABEL[t.channel] ?? t.channel}</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
