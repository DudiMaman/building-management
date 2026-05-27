'use client';
import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Plus, FileText, RefreshCw } from 'lucide-react';
import { apiFetch, swrFetcher, type InvoiceRow } from '@/lib/api';

const TYPE_LABEL: Record<string, string> = {
  tax_invoice: 'חשבונית מס',
  receipt: 'קבלה',
  tax_invoice_receipt: 'חשבונית מס/קבלה',
  credit_note: 'חשבונית זיכוי',
};

export default function InvoicesPage() {
  const { data: invoices, error, isLoading, mutate } = useSWR<InvoiceRow[]>(
    '/invoices',
    swrFetcher,
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  async function downloadPdf(id: string) {
    setBusyId(id);
    try {
      const result = await apiFetch<{ file_id: string; signed_url: string | null }>(
        `/invoices/${id}/pdf`,
        { method: 'POST' },
      );
      if (result.signed_url) {
        window.open(result.signed_url, '_blank');
      } else {
        alert('הקובץ עדיין לא זמין');
      }
      await mutate();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">חשבוניות וקבלות</h1>
          <p className="mt-1 text-sm text-slate-600">
            תואם רשות המסים. מספור רציף. אינטגרציה דיגיטלית.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/invoices/series"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            ניהול סדרות
          </Link>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            הפק חשבונית
          </Link>
        </div>
      </header>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error && (
          <div className="px-6 py-8 text-sm text-red-600">
            טעינת חשבוניות נכשלה: {(error as Error).message}
          </div>
        )}
        {isLoading && !invoices && (
          <div className="px-6 py-8 text-sm text-slate-500">טוען...</div>
        )}
        {invoices && invoices.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            עדיין לא הופקו חשבוניות.
          </div>
        )}
        {invoices && invoices.length > 0 && (
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">מס׳</th>
                <th className="px-6 py-3">סוג</th>
                <th className="px-6 py-3">לקוח</th>
                <th className="px-6 py-3">סכום</th>
                <th className="px-6 py-3">תאריך</th>
                <th className="px-6 py-3">סטטוס</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm">
                    {inv.serial_number ?? '—'}
                  </td>
                  <td className="px-6 py-4">{TYPE_LABEL[inv.type] ?? inv.type}</td>
                  <td className="px-6 py-4">{inv.customer_name_snapshot ?? '—'}</td>
                  <td
                    className={`px-6 py-4 ${
                      Number(inv.total) < 0 ? 'text-red-600' : ''
                    }`}
                  >
                    ₪
                    {Math.abs(Number(inv.total)).toLocaleString('he-IL', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {inv.issued_at ? inv.issued_at.slice(0, 10) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button
                      onClick={() => downloadPdf(inv.id)}
                      disabled={busyId === inv.id}
                      className="inline-flex items-center gap-1 text-primary hover:underline disabled:opacity-50"
                    >
                      {busyId === inv.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
