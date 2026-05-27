'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { Plus, Phone, Mail, Star } from 'lucide-react';
import { DataTable, PageHeader, StatusPill, type Column } from '@/components/data-table';
import { swrFetcher, type Vendor } from '@/lib/api';

const STATUS_TONE: Record<Vendor['status'], 'emerald' | 'slate' | 'red'> = {
  active: 'emerald',
  inactive: 'slate',
  blocked: 'red',
};

const STATUS_LABEL: Record<Vendor['status'], string> = {
  active: 'פעיל',
  inactive: 'לא פעיל',
  blocked: 'חסום',
};

export default function VendorsPage() {
  const { data, error, isLoading } = useSWR<Vendor[]>('/vendors', swrFetcher);

  const columns: Column<Vendor>[] = [
    { header: 'שם הספק', cell: (v) => <span className="font-medium">{v.name}</span> },
    { header: 'איש קשר', cell: (v) => v.contact_name ?? '—' },
    {
      header: 'טלפון',
      cell: (v) =>
        v.phone ? (
          <a href={`tel:${v.phone}`} className="inline-flex items-center gap-1 text-primary hover:underline">
            <Phone className="h-3.5 w-3.5" />
            {v.phone}
          </a>
        ) : (
          '—'
        ),
    },
    {
      header: 'אימייל',
      cell: (v) =>
        v.email ? (
          <a href={`mailto:${v.email}`} className="inline-flex items-center gap-1 text-primary hover:underline">
            <Mail className="h-3.5 w-3.5" />
            {v.email}
          </a>
        ) : (
          '—'
        ),
    },
    { header: 'ע.מ./ח.פ', cell: (v) => v.vat_id ?? '—' },
    {
      header: 'דירוג',
      cell: (v) =>
        v.rating ? (
          <span className="inline-flex items-center gap-1 text-amber-600">
            <Star className="h-3.5 w-3.5 fill-current" />
            {v.rating}
          </span>
        ) : (
          '—'
        ),
    },
    {
      header: 'סטטוס',
      cell: (v) => <StatusPill tone={STATUS_TONE[v.status]}>{STATUS_LABEL[v.status]}</StatusPill>,
    },
    {
      header: '',
      align: 'left',
      cell: (v) => (
        <Link href={`/vendors/${v.id}`} className="text-primary hover:underline">
          פרטים
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ספקים"
        subtitle={data ? `${data.length} ספקים` : 'טוען...'}
        actions={
          <Link
            href="/vendors/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            ספק חדש
          </Link>
        }
      />
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(v) => v.id}
        isLoading={isLoading}
        error={error as Error | null}
      />
    </div>
  );
}
