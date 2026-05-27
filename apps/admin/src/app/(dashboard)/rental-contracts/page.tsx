'use client';
import Link from 'next/link';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { DataTable, PageHeader, StatusPill, type Column } from '@/components/data-table';
import { swrFetcher, type RentalContract } from '@/lib/api';

type Row = RentalContract & { unit_number?: string; owner_name?: string; renter_name?: string };

const VAAD_LABEL: Record<RentalContract['vaad_responsibility'], string> = {
  renter_pays: 'שוכר משלם',
  owner_pays: 'בעלים משלם',
  split: 'פיצול',
};

const STATUS_TONE: Record<RentalContract['status'], 'emerald' | 'slate' | 'amber' | 'red'> = {
  draft: 'amber',
  active: 'emerald',
  ended: 'slate',
  terminated: 'red',
};

const STATUS_LABEL: Record<RentalContract['status'], string> = {
  draft: 'טיוטה',
  active: 'פעיל',
  ended: 'הסתיים',
  terminated: 'בוטל',
};

export default function RentalContractsPage() {
  const { data, error, isLoading } = useSWR<Row[]>('/apartments/rental-contracts', swrFetcher);

  const columns: Column<Row>[] = [
    { header: 'דירה', cell: (r) => r.unit_number ?? r.apartment_id.slice(0, 6) },
    { header: 'בעלים', cell: (r) => r.owner_name ?? '—' },
    { header: 'שוכר', cell: (r) => r.renter_name ?? '—' },
    { header: 'התחלה', cell: (r) => r.start_date },
    { header: 'סיום', cell: (r) => r.end_date ?? '—' },
    {
      header: 'שכ"ד',
      align: 'left',
      cell: (r) => (r.monthly_rent ? `₪${Number(r.monthly_rent).toLocaleString('he-IL')}` : '—'),
    },
    {
      header: 'אחריות ועד',
      cell: (r) => (
        <StatusPill tone={r.vaad_responsibility === 'split' ? 'amber' : 'sky'}>
          {VAAD_LABEL[r.vaad_responsibility]}
          {r.vaad_responsibility === 'split' && r.split_renter_pct ? ` ${r.split_renter_pct}%` : ''}
        </StatusPill>
      ),
    },
    {
      header: 'סטטוס',
      cell: (r) => (
        <StatusPill tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</StatusPill>
      ),
    },
    {
      header: '',
      align: 'left',
      cell: (r) => (
        <Link href={`/rental-contracts/${r.id}`} className="text-primary hover:underline">
          פרטים
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="חוזי שכירות"
        subtitle={data ? `${data.length} חוזים` : 'טוען...'}
        actions={
          <Link
            href="/rental-contracts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            חוזה חדש
          </Link>
        }
      />
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        error={error as Error | null}
        empty={
          <div>
            <p className="text-sm text-slate-700">אין חוזי שכירות פעילים.</p>
            <p className="mt-1 text-xs text-slate-500">
              עוברים לדירה → לחיצה על "התחל חוזה שכירות".
            </p>
          </div>
        }
      />
    </div>
  );
}
