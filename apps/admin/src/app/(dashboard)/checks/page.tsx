'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { AlertTriangle } from 'lucide-react';
import { swrFetcher } from '@/lib/api';

interface CheckRow {
  id: string;
  check_number: string | null;
  amount: string;
  due_date: string | null;
  status: string;
}

const STATUS_LABEL: Record<string, string> = {
  received: 'התקבל',
  scheduled: 'דחוי',
  deposited: 'הופקד',
  cleared: 'נפרע',
  bounced: 'חזר',
  replaced: 'הוחלף',
  voided: 'בוטל',
};

const STATUSES = ['', 'received', 'scheduled', 'deposited', 'cleared', 'bounced'];

export default function ChecksPage() {
  const [status, setStatus] = useState('');
  const { data: checks, error, isLoading } = useSWR<CheckRow[]>(
    `/checks${status ? `?status=${status}` : ''}`,
    swrFetcher,
  );
  const { data: bounced } = useSWR<CheckRow[]>('/checks/bounced', swrFetcher);

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">צ׳קים</h1>
          <p className="mt-1 text-sm text-slate-600">ניהול צ׳קים, הפקדות וצ׳קים חוזרים</p>
        </div>
        <div className="flex items-center gap-2">
          {bounced && bounced.length > 0 && (
            <span className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              צ׳קים חוזרים ({bounced.length})
            </span>
          )}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s === '' ? 'כל הסטטוסים' : STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>
      </header>

      {isLoading && <p className="mt-8 text-sm text-slate-500">טוען…</p>}
      {error && <p className="mt-8 text-sm text-red-600">שגיאה בטעינת הצ׳קים</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3">מס׳ צ׳ק</th>
              <th className="px-6 py-3">סכום</th>
              <th className="px-6 py-3">תאריך פירעון</th>
              <th className="px-6 py-3">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {(checks ?? []).map((c) => (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-sm">{c.check_number ?? '—'}</td>
                <td className="px-6 py-4">₪{Number(c.amount).toLocaleString('he-IL')}</td>
                <td className="px-6 py-4">{c.due_date ?? '—'}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    c.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'bounced' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </td>
              </tr>
            ))}
            {!isLoading && (checks ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">אין צ׳קים להצגה.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
