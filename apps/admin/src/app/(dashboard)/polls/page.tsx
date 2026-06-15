'use client';
import useSWR from 'swr';
import { BarChart3 } from 'lucide-react';
import { swrFetcher } from '@/lib/api';

interface PollRow {
  id: string;
  title: string;
  type: string;
  status: string;
  eligibility: string;
  anonymous: boolean;
  closes_at: string | null;
  vote_count: string | number;
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'טיוטה',
  open: 'פתוח',
  closed: 'סגור',
};
const ELIG_LABEL: Record<string, string> = {
  all_residents: 'כל הדיירים',
  owner_only: 'בעלים בלבד',
  bill_payer_only: 'משלם הוועד בלבד',
};

export default function PollsPage() {
  const { data: polls, error, isLoading } = useSWR<PollRow[]>('/polls', swrFetcher);

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold">סקרים והצבעות</h1>
        <p className="mt-1 text-sm text-slate-600">זכאות לפי תפקיד, אנונימיות, חתימות דיגיטליות</p>
      </header>

      {isLoading && <p className="mt-8 text-sm text-slate-500">טוען…</p>}
      {error && <p className="mt-8 text-sm text-red-600">שגיאה בטעינת הסקרים</p>}
      {!isLoading && !error && (polls ?? []).length === 0 && (
        <p className="mt-8 text-sm text-slate-500">אין סקרים עדיין.</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(polls ?? []).map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className={`rounded-full px-2 py-1 text-xs ${
                p.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                p.status === 'closed' ? 'bg-slate-100 text-slate-700' :
                'bg-amber-100 text-amber-800'
              }`}>
                {STATUS_LABEL[p.status] ?? p.status}
              </span>
            </div>
            <h3 className="mt-4 font-semibold">{p.title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {ELIG_LABEL[p.eligibility] ?? p.eligibility}{p.anonymous ? ' · אנונימי' : ''}
            </p>
            <p className="mt-3 text-sm text-slate-600">{Number(p.vote_count)} הצבעות</p>
            {p.closes_at && <p className="mt-1 text-xs text-slate-400">נסגר: {p.closes_at}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
