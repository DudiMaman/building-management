'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { Plus, RefreshCw } from 'lucide-react';
import { DataTable, PageHeader, StatusPill, type Column } from '@/components/data-table';
import { swrFetcher, type Charge, type ChargeSchedule } from '@/lib/api';

const STATUS_TONE: Record<string, 'slate' | 'sky' | 'amber' | 'emerald' | 'red'> = {
  pending: 'sky',
  paid: 'emerald',
  partial: 'amber',
  overdue: 'red',
  cancelled: 'slate',
  refunded: 'slate',
  unbilled_no_payer: 'red',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'ממתין',
  paid: 'שולם',
  partial: 'חלקי',
  overdue: 'בפיגור',
  cancelled: 'בוטל',
  refunded: 'הוחזר',
  unbilled_no_payer: 'אין משלם',
};

export default function ChargesPage() {
  const { data: schedules } = useSWR<ChargeSchedule[]>('/charge-schedules', swrFetcher);
  const { data: charges, error, isLoading } = useSWR<Charge[]>('/charges', swrFetcher);

  const overdue = (charges ?? []).filter((c) => c.status === 'overdue').length;
  const unbilled = (charges ?? []).filter((c) => c.status === 'unbilled_no_payer').length;

  const columns: Column<Charge>[] = [
    { header: 'תיאור', cell: (c) => <span className="font-medium">{c.description ?? '—'}</span> },
    {
      header: 'סכום',
      align: 'left',
      cell: (c) => `₪${Number(c.amount).toLocaleString('he-IL', { minimumFractionDigits: 2 })}`,
    },
    {
      header: 'שולם',
      align: 'left',
      cell: (c) =>
        c.paid_amount === '0' || c.paid_amount === '0.00'
          ? '—'
          : `₪${Number(c.paid_amount).toLocaleString('he-IL', { minimumFractionDigits: 2 })}`,
    },
    { header: 'תאריך פירעון', cell: (c) => c.due_date },
    {
      header: 'שלב גבייה',
      cell: (c) => (c.dunning_stage > 0 ? <StatusPill tone="amber">שלב {c.dunning_stage}</StatusPill> : '—'),
    },
    {
      header: 'סטטוס',
      cell: (c) => <StatusPill tone={STATUS_TONE[c.status] ?? 'slate'}>{STATUS_LABEL[c.status] ?? c.status}</StatusPill>,
    },
    {
      header: '',
      align: 'left',
      cell: (c) => (
        <Link href={`/charges/${c.id}`} className="text-primary hover:underline">פרטים</Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיובים"
        subtitle={
          charges
            ? `${charges.length} חיובים${overdue ? ` · ${overdue} בפיגור` : ''}${unbilled ? ` · ${unbilled} ללא משלם` : ''}`
            : 'טוען...'
        }
        actions={
          <Link
            href="/charges/schedules"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            {schedules ? `${schedules.length} תוכניות גבייה` : 'תוכניות גבייה'}
          </Link>
        }
      />

      {unbilled > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>{unbilled} חיובים</strong> לא נוצרו כי לא נמצא משלם לוועד. עברו לחיובי דירה ושייכו משלם.
        </div>
      )}

      <DataTable
        rows={charges}
        columns={columns}
        rowKey={(c) => c.id}
        isLoading={isLoading}
        error={error as Error | null}
        empty={
          <div>
            <p className="text-sm text-slate-700">אין חיובים פעילים.</p>
            <p className="mt-1 text-xs text-slate-500">
              צרו תוכנית גבייה למחזור חודשי אוטומטי.
            </p>
          </div>
        }
      />
    </div>
  );
}
