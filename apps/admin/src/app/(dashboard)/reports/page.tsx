'use client';
import useSWR from 'swr';
import { TrendingUp, AlertTriangle, Wallet, Clock } from 'lucide-react';
import { PageHeader } from '@/components/data-table';
import { swrFetcher, type CollectionRate, type OpenTicketsStats, type ArAging, type PerPersonAr } from '@/lib/api';

export default function ReportsPage() {
  const { data: collection } = useSWR<CollectionRate>('/reports/collection-rate', swrFetcher);
  const { data: tickets } = useSWR<OpenTicketsStats>('/reports/open-tickets', swrFetcher);
  const { data: aging } = useSWR<ArAging>('/reports/ar-aging', swrFetcher);
  const { data: perPerson } = useSWR<PerPersonAr[]>('/reports/per-person-ar', swrFetcher);

  const rate = collection ? `${Math.round(collection.rate * 100)}%` : '—';
  const billed = collection ? `₪${Number(collection.billed).toLocaleString('he-IL')}` : '—';
  const paid = collection ? `₪${Number(collection.paid).toLocaleString('he-IL')}` : '—';

  const buckets = aging
    ? [
        { label: '0–30 ימים', value: Number(aging.bucket_0_30), tone: 'bg-emerald-500' },
        { label: '31–60 ימים', value: Number(aging.bucket_31_60), tone: 'bg-amber-500' },
        { label: '61–90 ימים', value: Number(aging.bucket_61_90), tone: 'bg-orange-500' },
        { label: '90+ ימים', value: Number(aging.bucket_90_plus), tone: 'bg-red-500' },
      ]
    : [];
  const totalOutstanding = buckets.reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="דוחות" subtitle="סקירה פיננסית ותפעולית של חברת הניהול" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Wallet} label="גביה חודשית" value={paid} sub={`מתוך ${billed}`} tone="emerald" />
        <KpiCard icon={TrendingUp} label="אחוז גבייה" value={rate} sub={`${collection?.charge_count ?? '—'} חיובים`} tone="primary" />
        <KpiCard icon={AlertTriangle} label="פיגורים" value={String(collection?.overdue_count ?? '—')} sub="חיובים פתוחים" tone="amber" />
        <KpiCard icon={Clock} label="פניות בפיגור SLA" value={String(tickets?.sla_breached ?? 0)} sub={`${tickets?.total ?? 0} פניות פתוחות`} tone="red" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">פיגורי גבייה לפי ותק (AR Aging)</h2>
        {aging ? (
          <div className="mt-6 space-y-3">
            {buckets.map((b) => {
              const pct = totalOutstanding > 0 ? (b.value / totalOutstanding) * 100 : 0;
              return (
                <div key={b.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">{b.label}</span>
                    <span className="font-semibold">₪{b.value.toLocaleString('he-IL')}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full ${b.tone}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="mt-2 pt-3 border-t border-slate-100 text-sm text-slate-600">
              סה"כ פיגורים: <span className="font-bold text-red-700">₪{totalOutstanding.toLocaleString('he-IL')}</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">טוען...</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">חייבים גדולים</h2>
        {!perPerson ? (
          <p className="mt-4 text-sm text-slate-500">טוען...</p>
        ) : perPerson.length === 0 ? (
          <p className="mt-4 text-sm text-emerald-700">אין חייבים פתוחים — כל הכבוד! 🎉</p>
        ) : (
          <table className="mt-4 w-full text-right text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">שם</th>
                <th className="py-2">חיובים פתוחים</th>
                <th className="py-2 text-left">חוב</th>
              </tr>
            </thead>
            <tbody>
              {perPerson.slice(0, 15).map((p) => (
                <tr key={p.person_id} className="border-t border-slate-100">
                  <td className="py-3 font-medium">{p.full_name}</td>
                  <td className="py-3 text-slate-600">{p.open_charges}</td>
                  <td className="py-3 text-left font-semibold text-red-700">
                    ₪{Number(p.outstanding).toLocaleString('he-IL', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  tone: 'primary' | 'amber' | 'emerald' | 'red';
}) {
  const tones: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
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
