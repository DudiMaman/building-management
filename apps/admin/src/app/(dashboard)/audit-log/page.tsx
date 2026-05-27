'use client';
import useSWR from 'swr';
import { DataTable, PageHeader, StatusPill, type Column } from '@/components/data-table';
import { swrFetcher, type AuditEntry } from '@/lib/api';

export default function AuditLogPage() {
  const { data, error, isLoading } = useSWR<AuditEntry[]>('/audit-log', swrFetcher);

  const columns: Column<AuditEntry>[] = [
    {
      header: 'מתי',
      cell: (e) => (
        <span className="text-xs text-slate-500">
          {new Date(e.created_at).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      header: 'משתמש',
      cell: (e) => (
        <span className="font-mono text-xs">{e.actor_user_id?.slice(0, 8) ?? e.actor_type}</span>
      ),
    },
    {
      header: 'פעולה',
      cell: (e) => <StatusPill tone="primary">{e.action}</StatusPill>,
    },
    {
      header: 'ישות',
      cell: (e) => (
        <span>
          <span className="text-slate-700">{e.entity_type}</span>
          {e.entity_id && (
            <span className="ms-2 font-mono text-xs text-slate-400">{e.entity_id.slice(0, 8)}</span>
          )}
        </span>
      ),
    },
    {
      header: 'IP',
      cell: (e) => <span className="font-mono text-xs text-slate-500">{e.ip ?? '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="לוג ביקורת"
        subtitle="כל שינוי במערכת מתועד בשרשרת hash לעמידות בטיפוח"
      />
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(e) => e.id}
        isLoading={isLoading}
        error={error as Error | null}
        empty={<p className="text-sm text-slate-500">הלוג ריק.</p>}
      />
    </div>
  );
}
