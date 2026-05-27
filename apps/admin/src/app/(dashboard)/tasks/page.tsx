'use client';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PageHeader, StatusPill } from '@/components/data-table';
import { swrFetcher, type Task } from '@/lib/api';

const COLUMNS: { key: Task['status']; label: string; tone: 'slate' | 'sky' | 'amber' | 'emerald' | 'red' }[] = [
  { key: 'todo', label: 'לביצוע', tone: 'slate' },
  { key: 'in_progress', label: 'בעבודה', tone: 'sky' },
  { key: 'blocked', label: 'תקוע', tone: 'amber' },
  { key: 'done', label: 'הושלם', tone: 'emerald' },
  { key: 'cancelled', label: 'בוטל', tone: 'red' },
];

const PRIORITY_TONE: Record<Task['priority'], 'slate' | 'sky' | 'amber' | 'red'> = {
  low: 'slate',
  med: 'sky',
  high: 'amber',
  urgent: 'red',
};

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  low: 'נמוך',
  med: 'רגיל',
  high: 'גבוה',
  urgent: 'דחוף',
};

export default function TasksPage() {
  const { data, error, isLoading } = useSWR<Task[]>('/tasks', swrFetcher);

  const byStatus = COLUMNS.map((col) => ({
    ...col,
    items: (data ?? []).filter((t) => t.status === col.key),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="משימות"
        subtitle={data ? `${data.length} משימות` : 'טוען...'}
        actions={
          <Link
            href="/tasks/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            משימה חדשה
          </Link>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
          טעינת משימות נכשלה: {(error as Error).message}
        </div>
      )}

      {!error && isLoading && !data && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          טוען...
        </div>
      )}

      {!error && data && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {byStatus.map((col) => (
            <div key={col.key} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
              <div className="flex items-center justify-between px-2 pb-3">
                <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
                <span className="text-xs text-slate-500">{col.items.length}</span>
              </div>
              <div className="space-y-2">
                {col.items.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
                    ריק
                  </div>
                ) : (
                  col.items.map((task) => (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="block rounded-xl border border-slate-200 bg-white p-3 transition hover:border-primary-200 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <StatusPill tone={PRIORITY_TONE[task.priority]}>
                          {PRIORITY_LABEL[task.priority]}
                        </StatusPill>
                        <span className="text-[10px] text-slate-400">{task.category}</span>
                      </div>
                      <div className="mt-2 text-sm font-medium leading-tight">{task.title}</div>
                      {task.scheduled_at && (
                        <div className="mt-2 text-xs text-slate-500">
                          {new Date(task.scheduled_at).toLocaleString('he-IL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
