'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Building2, MapPin, Hash, Banknote, Plus, FileDown } from 'lucide-react';
import { PageHeader, DataTable, StatusPill, type Column } from '@/components/data-table';
import { apiFetch, swrFetcher, type Apartment, type Building } from '@/lib/api';
import { useState } from 'react';

interface DetailedBuilding extends Building {
  postal_code: string | null;
  year_built: number | null;
  claim_secret: string;
}

const OCCUPANCY: Record<Apartment['occupancy_status'], { label: string; tone: 'slate' | 'emerald' | 'sky' | 'amber' }> = {
  vacant: { label: 'ריק', tone: 'slate' },
  owner_occupied: { label: 'בעלים גר', tone: 'emerald' },
  rented: { label: 'מושכר', tone: 'sky' },
  mixed: { label: 'מעורב', tone: 'amber' },
};

export default function BuildingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const { data: building, error: buildingErr } = useSWR<DetailedBuilding>(`/buildings/${id}`, swrFetcher);
  const { data: apartments, isLoading: aptLoading } = useSWR<Apartment[]>(
    `/apartments?building_id=${id}`,
    swrFetcher,
  );
  const [flyerLoading, setFlyerLoading] = useState(false);
  const [flyerError, setFlyerError] = useState<string | null>(null);

  async function generateFlyer() {
    setFlyerLoading(true);
    setFlyerError(null);
    try {
      const result = await apiFetch<{ pdf_url: string; qr_payload: string }>(
        `/buildings/${id}/flyer`,
        { method: 'POST' },
      );
      window.open(result.pdf_url, '_blank');
    } catch (err) {
      setFlyerError((err as Error).message);
    } finally {
      setFlyerLoading(false);
    }
  }

  const aptColumns: Column<Apartment>[] = [
    { header: 'יחידה', cell: (a) => <span className="font-medium">{a.unit_number}</span> },
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
      header: 'ועד',
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

  if (buildingErr) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
        טעינה נכשלה: {(buildingErr as Error).message}
      </div>
    );
  }
  if (!building) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        טוען...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={building.name}
        subtitle={`${building.address_line}, ${building.city}`}
        actions={
          <>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה
            </button>
            <button
              onClick={generateFlyer}
              disabled={flyerLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 disabled:opacity-60"
            >
              <FileDown className="h-4 w-4" />
              {flyerLoading ? 'מפיק...' : 'הפק פלייר QR'}
            </button>
            <Link
              href={`/apartments/new?building_id=${id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              דירה חדשה
            </Link>
          </>
        }
      />

      {flyerError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{flyerError}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoTile icon={Building2} label="קומות" value={String(building.num_floors ?? '—')} />
        <InfoTile icon={Hash} label="דירות" value={String(building.num_apartments ?? apartments?.length ?? '—')} />
        <InfoTile icon={MapPin} label="מיקוד" value={building.postal_code ?? '—'} />
        <InfoTile icon={Banknote} label="IBAN" value={building.bank_account_iban ?? 'לא הוגדר'} />
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">דירות</h2>
          <span className="text-sm text-slate-500">{apartments?.length ?? 0}</span>
        </div>
        <DataTable
          rows={apartments}
          columns={aptColumns}
          rowKey={(a) => a.id}
          isLoading={aptLoading}
          empty={
            <div>
              <p className="text-sm text-slate-700">אין דירות בבניין הזה.</p>
              <Link
                href={`/apartments/new?building_id=${id}`}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                הוסיפו את הדירה הראשונה
              </Link>
            </div>
          }
        />
      </section>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="h-4 w-4 text-primary-600" />
        {label}
      </div>
      <div className="mt-1 truncate text-lg font-bold">{value}</div>
    </div>
  );
}
