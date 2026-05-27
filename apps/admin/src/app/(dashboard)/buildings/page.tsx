'use client';
import Link from 'next/link';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { swrFetcher, type Building } from '@/lib/api';

export default function BuildingsPage() {
  const { data: buildings, error, isLoading } = useSWR<Building[]>('/buildings', swrFetcher);

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">בניינים</h1>
          <p className="mt-1 text-sm text-slate-600">
            {buildings ? `${buildings.length} בניינים פעילים` : 'טוען...'}
          </p>
        </div>
        <Link
          href="/buildings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          בניין חדש
        </Link>
      </header>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {error && (
          <div className="px-6 py-8 text-sm text-red-600">
            טעינת בניינים נכשלה: {(error as Error).message}
          </div>
        )}
        {isLoading && !buildings && (
          <div className="px-6 py-8 text-sm text-slate-500">טוען...</div>
        )}
        {buildings && buildings.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-700">עדיין לא נוספו בניינים</p>
            <Link
              href="/buildings/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              הוסיפו את הבניין הראשון
            </Link>
          </div>
        )}
        {buildings && buildings.length > 0 && (
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">שם</th>
                <th className="px-6 py-3">כתובת</th>
                <th className="px-6 py-3">עיר</th>
                <th className="px-6 py-3">דירות</th>
                <th className="px-6 py-3">קומות</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((b) => (
                <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{b.name}</td>
                  <td className="px-6 py-4 text-slate-600">{b.address_line}</td>
                  <td className="px-6 py-4 text-slate-600">{b.city}</td>
                  <td className="px-6 py-4">{b.num_apartments ?? '—'}</td>
                  <td className="px-6 py-4">{b.num_floors ?? '—'}</td>
                  <td className="px-6 py-4 text-left">
                    <Link
                      href={`/buildings/${b.id}`}
                      className="text-primary hover:underline"
                    >
                      פרטים
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
