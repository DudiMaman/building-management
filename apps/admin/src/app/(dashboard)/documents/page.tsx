'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { FolderArchive, AlertCircle, Search } from 'lucide-react';
import { apiFetch, swrFetcher, type Building } from '@/lib/api';

interface DocRow {
  id: string;
  title: string;
  category: string;
  expires_at: string | null;
  ai_summary?: string | null;
}

const CAT_LABEL: Record<string, string> = {
  insurance: 'ביטוח',
  contract: 'חוזה',
  permit: 'אישור',
  blueprint: 'תוכניות',
  certificate: 'תעודה',
  bylaws: 'תקנון',
  minutes: 'פרוטוקול',
  other: 'אחר',
};

function isExpiringSoon(expires_at: string | null): boolean {
  if (!expires_at) return false;
  const days = (new Date(expires_at).getTime() - Date.now()) / 86_400_000;
  return days >= 0 && days <= 30;
}

export default function DocumentsPage() {
  const { data: buildings } = useSWR<Building[]>('/buildings', swrFetcher);
  const [buildingId, setBuildingId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocRow[] | null>(null);
  const activeBuilding = buildingId || buildings?.[0]?.id || '';

  const { data: docs, error, isLoading } = useSWR<DocRow[]>(
    activeBuilding ? `/documents?building_id=${activeBuilding}` : null,
    swrFetcher,
  );

  async function runSearch() {
    if (!query.trim() || !activeBuilding) {
      setSearchResults(null);
      return;
    }
    const rows = await apiFetch<DocRow[]>(
      `/documents/search?building_id=${activeBuilding}&q=${encodeURIComponent(query.trim())}`,
    );
    setSearchResults(rows);
  }

  const shown = searchResults ?? docs ?? [];

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">מסמכים</h1>
          <p className="mt-1 text-sm text-slate-600">כספת מסמכים פר-בניין, גרסאות, תזכורות תפוגה</p>
        </div>
        <select
          value={activeBuilding}
          onChange={(e) => { setBuildingId(e.target.value); setSearchResults(null); }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {(buildings ?? []).map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </header>

      <div className="mt-5 flex gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder="חיפוש בתוכן המסמכים (OCR)…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-9 pl-3 text-sm"
          />
        </div>
        <button onClick={runSearch} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          חיפוש
        </button>
        {searchResults && (
          <button
            onClick={() => { setQuery(''); setSearchResults(null); }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            נקה
          </button>
        )}
      </div>

      {isLoading && <p className="mt-8 text-sm text-slate-500">טוען…</p>}
      {error && <p className="mt-8 text-sm text-red-600">שגיאה בטעינת המסמכים</p>}
      {!isLoading && !error && shown.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">אין מסמכים להצגה.</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((d) => (
          <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-primary-200 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <FolderArchive className="h-5 w-5" />
              </div>
              {isExpiringSoon(d.expires_at) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                  <AlertCircle className="h-3 w-3" />
                  עתיד לפוג
                </span>
              )}
            </div>
            <h3 className="mt-4 font-semibold">{d.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{CAT_LABEL[d.category] ?? d.category}</p>
            {d.ai_summary && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{d.ai_summary}</p>}
            {d.expires_at && <p className="mt-3 text-xs text-slate-400">תפוגה: {d.expires_at}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
