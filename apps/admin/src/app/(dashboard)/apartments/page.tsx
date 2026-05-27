'use client';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DataTable, PageHeader, StatusPill, type Column } from '@/components/data-table';
import { swrFetcher, type Apartment, type Building } from '@/lib/api';

const OCCUPANCY: Record<Apartment['occupancy_status'], { label: string; tone: 'slate' | 'emerald' | 'sky' | 'amber' }> = {
  vacant: { label: 'ריק', tone: 'slate' },
  owner_occupied: { label: 'בעלים גר', tone: 'emerald' },
  rented: { label: 'מושכר', tone: 'sky' },
  mixed: { label: 'מעורב', tone: 'amber' },
};

export default function ApartmentsPage() {
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const { data: buildings } = useSWR<Building[]>('/buildings', swrFetcher);
  const { data: apartments, error, isLoading } = useSWR<Apartment[]>(
    buildingFilter === 'all' ? '/apartments' : `/apartments?building_id=${buildingFilter}`,
    swrFetcher,
  );

  const buildingsById = useMemo(() => {
    const map = new Map<string, Building>();
    for (const b of buildings ?? []) map.set(b.id, b);
    return map;
  }, [buildings]);

  const columns: Column<Apartment>[] = [
    { header: 'יחידה', cell: (a) => <span className="font-medium">{a.unit_number}</span> },
    { header: 'בניין', cell: (a) => buildingsById.get(a.building_id)?.name ?? '—' },
    { header: 'קומה', cell: (a) => a.floor ?? '—' },
    { header: 'חדרים', cell: (a) => a.num_rooms ?? '—' },
    { header: 'מ"ר', cell: (a) => a.size_sqm ?? '—' },
    {
      header: 'תפוסה',
      cell: (a) => {
        const o = OCCUPANCY[a.occupancy_status];
        return <StatusPill tone={o.tone}>{o.label}</StatusPill>;
      },
    },
    {
      header: 'ועד חודשי',
      align: 'left',
      cell: (a) => (a.monthly_dues_amount ? `₪${Number(a.monthly_dues_amount).toLocaleString('he-IL')}` : '—'),
    },
    {
      header: '',
      align: 'left',
      cell: (a) => (
        <Link href={`/apartments/${a.id}`} className="text-primary hover:underline">
          פרטים
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="דירות"
        subtitle={apartments ? `${apartments.length} דירות` : 'טוען...'}
        actions={
          <>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">כל הבניינים</option>
              {(buildings ?? []).map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <Link
              href="/apartments/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              דירה חדשה
            </Link>
          </>
        }
      />
      <DataTable
        rows={apartments}
        columns={columns}
        rowKey={(a) => a.id}
        isLoading={isLoading}
        error={error as Error | null}
        empty={
          <div>
            <p className="text-sm text-slate-700">לא נמצאו דירות.</p>
            <p className="mt-1 text-xs text-slate-500">פתחו בניין ועברו למסך הדירות שלו לייבוא CSV.</p>
          </div>
        }
      />
    </div>
  );
}
