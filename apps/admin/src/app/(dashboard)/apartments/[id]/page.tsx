'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Home, User, Crown, Users, ShieldCheck, Pencil } from 'lucide-react';
import { PageHeader, StatusPill } from '@/components/data-table';
import { swrFetcher, type Apartment, type Building } from '@/lib/api';

interface DetailedApartment extends Apartment {
  notes: string | null;
}

interface Assignment {
  id: string;
  person_id: string;
  full_name: string;
  phone_e164: string | null;
  email: string | null;
  role: 'owner' | 'renter' | 'family_member' | 'authorized_contact';
  is_primary: boolean;
  is_occupant: boolean;
  is_bill_payer: boolean;
  share_pct: string | null;
  valid_from: string;
  valid_to: string | null;
  status: string;
  notes: string | null;
}

const ROLE_LABEL: Record<Assignment['role'], string> = {
  owner: 'בעלים',
  renter: 'שוכר',
  family_member: 'בן משפחה',
  authorized_contact: 'נציג מוסמך',
};

const ROLE_ICON: Record<Assignment['role'], typeof Crown> = {
  owner: Crown,
  renter: Home,
  family_member: Users,
  authorized_contact: ShieldCheck,
};

const ROLE_TONE: Record<Assignment['role'], 'primary' | 'sky' | 'emerald' | 'amber'> = {
  owner: 'primary',
  renter: 'sky',
  family_member: 'emerald',
  authorized_contact: 'amber',
};

export default function ApartmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: apartment, error: apartmentErr } = useSWR<DetailedApartment>(
    `/apartments/${id}`,
    swrFetcher,
  );
  const { data: assignments, isLoading: assignmentsLoading } = useSWR<Assignment[]>(
    `/apartments/${id}/assignments`,
    swrFetcher,
  );
  const { data: buildings } = useSWR<Building[]>('/buildings', swrFetcher);

  const building = apartment ? buildings?.find((b) => b.id === apartment.building_id) : undefined;

  if (apartmentErr) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
        טעינה נכשלה: {(apartmentErr as Error).message}
      </div>
    );
  }
  if (!apartment) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        טוען...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`דירה ${apartment.unit_number}`}
        subtitle={
          building ? `${building.name}, ${building.address_line}` : `בניין ${apartment.building_id.slice(0, 8)}`
        }
        actions={
          <>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה
            </button>
            <Link
              href={`/rental-contracts/new?apartment_id=${id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
            >
              חוזה שכירות
            </Link>
            <Link
              href={`/apartments/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Pencil className="h-4 w-4" />
              עריכה
            </Link>
          </>
        }
      />

      {/* KPI tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoTile label="קומה" value={apartment.floor != null ? String(apartment.floor) : '—'} />
        <InfoTile label="חדרים" value={apartment.num_rooms ?? '—'} />
        <InfoTile label="מ&quot;ר" value={apartment.size_sqm ?? '—'} />
        <InfoTile
          label="ועד חודשי"
          value={
            apartment.monthly_dues_amount
              ? `₪${Number(apartment.monthly_dues_amount).toLocaleString('he-IL')}`
              : 'לא הוגדר'
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">שיוכים פעילים</h2>
            <span className="text-sm text-slate-500">
              {assignments?.length ?? 0}
            </span>
          </div>

          <AssignmentList
            assignments={assignments}
            loading={assignmentsLoading}
            apartmentId={id}
          />
        </section>

        <aside className="space-y-4">
          <h2 className="text-lg font-semibold">תקציר חיובים</h2>
          <BillPayerCard assignments={assignments} />
          <Link
            href={`/charges?apartment_id=${id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-primary hover:bg-slate-50"
          >
            כל החיובים של הדירה →
          </Link>
        </aside>
      </div>

      {apartment.notes && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">הערות</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{apartment.notes}</p>
        </section>
      )}
    </div>
  );
}

function AssignmentList({
  assignments,
  loading,
  apartmentId,
}: {
  assignments: Assignment[] | undefined;
  loading: boolean;
  apartmentId: string;
}) {
  if (loading && !assignments) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        טוען...
      </div>
    );
  }
  if (!assignments || assignments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-sm text-slate-700">אין שיוכים פעילים לדירה.</p>
        <Link
          href={`/apartments/${apartmentId}/assignments/new`}
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          הוסיפו בעלים / שוכר
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {assignments.map((a) => {
        const Icon = ROLE_ICON[a.role];
        return (
          <li
            key={a.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                  a.role === 'owner' ? 'bg-primary-50 text-primary-700' :
                  a.role === 'renter' ? 'bg-sky-50 text-sky-700' :
                  a.role === 'family_member' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/people/${a.person_id}`} className="font-semibold hover:text-primary">
                      {a.full_name}
                    </Link>
                    <StatusPill tone={ROLE_TONE[a.role]}>{ROLE_LABEL[a.role]}</StatusPill>
                    {a.is_primary && <StatusPill tone="slate">ראשי</StatusPill>}
                    {a.is_occupant && <StatusPill tone="emerald">גר בדירה</StatusPill>}
                    {a.is_bill_payer && <StatusPill tone="primary">משלם ועד</StatusPill>}
                    {a.share_pct && Number(a.share_pct) < 100 && (
                      <StatusPill tone="amber">{Number(a.share_pct)}%</StatusPill>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    מתאריך {a.valid_from}
                    {a.valid_to ? ` עד ${a.valid_to}` : ' (פתוח)'}
                  </div>
                  {(a.phone_e164 || a.email) && (
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {a.phone_e164 && (
                        <a href={`tel:${a.phone_e164}`} className="hover:text-primary">{a.phone_e164}</a>
                      )}
                      {a.email && (
                        <a href={`mailto:${a.email}`} className="hover:text-primary">{a.email}</a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {a.notes && (
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600">{a.notes}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function BillPayerCard({ assignments }: { assignments: Assignment[] | undefined }) {
  const billPayer = assignments?.find((a) => a.is_bill_payer);
  const owner = assignments?.find((a) => a.role === 'owner' && a.is_primary);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-xs text-slate-500">משלם הוועד</div>
      {billPayer ? (
        <div className="mt-2">
          <Link href={`/people/${billPayer.person_id}`} className="font-semibold hover:text-primary">
            {billPayer.full_name}
          </Link>
          <div className="mt-1 text-xs text-slate-500">
            ({ROLE_LABEL[billPayer.role]})
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          לא הוגדר. חיובים חודשיים יסומנו כ"ללא משלם" עד לטיפול.
        </div>
      )}
      {owner && billPayer?.person_id !== owner.person_id && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-500">בעלים</div>
          <Link href={`/people/${owner.person_id}`} className="mt-1 block font-medium hover:text-primary">
            {owner.full_name}
          </Link>
          <p className="mt-2 text-xs text-slate-500">
            לפי SPEC §3.6 — הבעלים יקבל קופי של תזכורות איחור.
          </p>
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 truncate text-lg font-bold">{value}</div>
    </div>
  );
}
