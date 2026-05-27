'use client';
import useSWR from 'swr';
import { Building2, AlertCircle, Wallet, CheckCircle } from 'lucide-react';
import {
  swrFetcher,
  type CollectionRate,
  type OpenTicketsStats,
  type Building,
} from '@/lib/api';

export default function DashboardPage() {
  const { data: buildings } = useSWR<Building[]>('/buildings', swrFetcher);
  const { data: collection } = useSWR<CollectionRate>('/reports/collection-rate', swrFetcher);
  const { data: tickets } = useSWR<OpenTicketsStats>('/reports/open-tickets', swrFetcher);

  const buildingCount = buildings?.length ?? '—';
  const openTickets = tickets?.total ?? '—';
  const urgent = tickets?.urgent ?? 0;
  const collectionRate = collection ? `${Math.round(collection.rate * 100)}%` : '—';
  const overdueCharges = collection?.overdue_count ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">לוח בקרה</h1>
      <p className="mt-1 text-sm text-slate-600">סקירה כללית של הפעילות בחברת הניהול</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Building2}
          label="בניינים פעילים"
          value={String(buildingCount)}
          sub=""
          tone="primary"
        />
        <KpiCard
          icon={AlertCircle}
          label="פניות פתוחות"
          value={String(openTickets)}
          sub={Number(urgent) > 0 ? `${urgent} דחופות` : 'אין דחופות'}
          tone="amber"
        />
        <KpiCard
          icon={Wallet}
          label="אחוז גבייה"
          value={collectionRate}
          sub={`${overdueCharges} בפיגור`}
          tone="green"
        />
        <KpiCard
          icon={CheckCircle}
          label={'חיובים סה"כ'}
          value={String(collection?.charge_count ?? '—')}
          sub={`${collection?.paid_count ?? 0} שולמו`}
          tone="indigo"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">בניינים אחרונים</h2>
          {!buildings ? (
            <p className="mt-4 text-sm text-slate-500">טוען...</p>
          ) : buildings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">עדיין לא נוספו בניינים.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {buildings.slice(0, 5).map((b) => (
                <li
                  key={b.id}
                  className="flex justify-between border-b border-slate-100 pb-3 last:border-b-0"
                >
                  <span className="font-medium">{b.name}</span>
                  <span className="text-slate-500">{b.address_line}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">התראות חשובות</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {Number(tickets?.sla_breached ?? 0) > 0 && (
              <li className="rounded-lg bg-red-50 p-3 text-red-900">
                {tickets!.sla_breached} פניות חרגו מ-SLA
              </li>
            )}
            {Number(collection?.overdue_count ?? 0) > 0 && (
              <li className="rounded-lg bg-amber-50 p-3 text-amber-900">
                {collection!.overdue_count} חיובים בפיגור
              </li>
            )}
            {Number(tickets?.urgent ?? 0) > 0 && (
              <li className="rounded-lg bg-primary-50 p-3 text-primary-900">
                {tickets!.urgent} פניות דחופות פתוחות
              </li>
            )}
            {!tickets || (Number(tickets.total ?? 0) === 0 && Number(collection?.overdue_count ?? 0) === 0) ? (
              <li className="rounded-lg bg-emerald-50 p-3 text-emerald-900">
                אין התראות פתוחות 🎉
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, sub, tone,
}: {
  icon: any; label: string; value: string; sub: string; tone: 'primary' | 'amber' | 'green' | 'indigo';
}) {
  const tones: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}
