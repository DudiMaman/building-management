'use client';
import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Plus, Search } from 'lucide-react';
import { DataTable, PageHeader, StatusPill, type Column } from '@/components/data-table';
import { swrFetcher, type Person } from '@/lib/api';

const CLAIM_TONES: Record<Person['claim_status'], 'amber' | 'emerald' | 'red'> = {
  pending: 'amber',
  approved: 'emerald',
  rejected: 'red',
};

const CLAIM_LABELS: Record<Person['claim_status'], string> = {
  pending: 'ממתין לאישור',
  approved: 'מאושר',
  rejected: 'נדחה',
};

export default function PeoplePage() {
  const [q, setQ] = useState('');
  const { data, error, isLoading } = useSWR<Person[]>(
    q ? `/people?q=${encodeURIComponent(q)}` : '/people',
    swrFetcher,
  );

  const pending = (data ?? []).filter((p) => p.claim_status === 'pending').length;

  const columns: Column<Person>[] = [
    { header: 'שם', cell: (p) => <span className="font-medium">{p.full_name}</span> },
    { header: 'טלפון', cell: (p) => p.phone_e164 ?? '—' },
    { header: 'אימייל', cell: (p) => p.email ?? '—' },
    { header: 'שפה', cell: (p) => p.language?.toUpperCase() },
    {
      header: 'WhatsApp',
      cell: (p) => p.whatsapp_opt_in ? <StatusPill tone="emerald">פעיל</StatusPill> : <StatusPill tone="slate">לא</StatusPill>,
    },
    {
      header: 'סטטוס',
      cell: (p) => <StatusPill tone={CLAIM_TONES[p.claim_status]}>{CLAIM_LABELS[p.claim_status]}</StatusPill>,
    },
    {
      header: '',
      align: 'left',
      cell: (p) => (
        <Link href={`/people/${p.id}`} className="text-primary hover:underline">פרטים</Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="אנשים"
        subtitle={
          data
            ? `${data.length} אנשים${pending ? ` · ${pending} ממתינים לאישור` : ''}`
            : 'טוען...'
        }
        actions={
          <Link
            href="/people/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            הוספה ידנית
          </Link>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="חיפוש לפי שם, טלפון או אימייל..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pe-10 ps-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <DataTable
        rows={data}
        columns={columns}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        error={error as Error | null}
      />
    </div>
  );
}
