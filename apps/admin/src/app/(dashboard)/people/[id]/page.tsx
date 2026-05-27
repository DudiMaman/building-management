'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Phone, Mail, MessageCircle, Pencil } from 'lucide-react';
import { PageHeader, StatusPill } from '@/components/data-table';
import { swrFetcher, type Person } from '@/lib/api';

interface DetailedPerson extends Person {
  notification_prefs: Record<string, unknown>;
}

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

export default function PersonDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: person, error } = useSWR<DetailedPerson>(`/people/${id}`, swrFetcher);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
        טעינה נכשלה: {(error as Error).message}
      </div>
    );
  }
  if (!person) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        טוען...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={person.full_name}
        subtitle={`${person.language?.toUpperCase()} · ${CLAIM_LABELS[person.claim_status]}`}
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
              href={`/charges?person_id=${id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
            >
              חיובים פתוחים
            </Link>
            <Link
              href={`/people/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Pencil className="h-4 w-4" />
              עריכה
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">פרטי קשר</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row icon={Phone} label="טלפון">
              {person.phone_e164 ? (
                <a href={`tel:${person.phone_e164}`} className="text-primary hover:underline">
                  {person.phone_e164}
                </a>
              ) : (
                '—'
              )}
            </Row>
            <Row icon={Mail} label="אימייל">
              {person.email ? (
                <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                  {person.email}
                </a>
              ) : (
                '—'
              )}
            </Row>
            <Row icon={MessageCircle} label="WhatsApp">
              {person.whatsapp_opt_in ? (
                <StatusPill tone="emerald">פעיל</StatusPill>
              ) : (
                <StatusPill tone="slate">לא מנוי</StatusPill>
              )}
            </Row>
          </dl>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs text-slate-500">סטטוס איקלום</div>
            <div className="mt-2">
              <StatusPill tone={CLAIM_TONES[person.claim_status]}>
                {CLAIM_LABELS[person.claim_status]}
              </StatusPill>
            </div>
            {person.claim_status === 'pending' && (
              <div className="mt-4 space-y-2">
                <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  אישור
                </button>
                <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                  דחייה
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0">
      <Icon className="h-4 w-4 text-slate-400" />
      <div className="text-slate-500 w-24">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
