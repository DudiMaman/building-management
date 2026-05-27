'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { Plus, Pin } from 'lucide-react';
import { PageHeader, StatusPill } from '@/components/data-table';
import { swrFetcher, type BulletinPost } from '@/lib/api';

const STATUS_TONE: Record<BulletinPost['status'], 'amber' | 'emerald' | 'slate'> = {
  draft: 'amber',
  published: 'emerald',
  archived: 'slate',
};

const STATUS_LABEL: Record<BulletinPost['status'], string> = {
  draft: 'טיוטה',
  published: 'פורסם',
  archived: 'בארכיון',
};

export default function BulletinPage() {
  const { data, error, isLoading } = useSWR<BulletinPost[]>('/bulletin', swrFetcher);

  return (
    <div className="space-y-6">
      <PageHeader
        title="לוח מודעות"
        subtitle={data ? `${data.length} פוסטים` : 'טוען...'}
        actions={
          <Link
            href="/bulletin/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            פוסט חדש
          </Link>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
          {(error as Error).message}
        </div>
      )}

      {!error && isLoading && !data && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          טוען...
        </div>
      )}

      {!error && data && data.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          עדיין לא פורסם פוסט.
        </div>
      )}

      {!error && data && data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((p) => (
            <article
              key={p.id}
              className={`rounded-2xl border bg-white p-5 ${
                p.pinned ? 'border-primary-300 ring-1 ring-primary-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <StatusPill tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</StatusPill>
                {p.pinned && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-700">
                    <Pin className="h-3 w-3" />
                    מוצמד
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-bold leading-tight">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.body_md}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {p.published_at
                    ? `פורסם ${new Date(p.published_at).toLocaleString('he-IL', { dateStyle: 'short' })}`
                    : 'טרם פורסם'}
                </span>
                <Link href={`/bulletin/${p.id}`} className="text-primary hover:underline">
                  פרטים
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
