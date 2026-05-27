'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DataTable, PageHeader, StatusPill, type Column } from '@/components/data-table';
import { swrFetcher, type Ticket } from '@/lib/api';

const STATUS_TONE: Record<string, 'slate' | 'sky' | 'amber' | 'emerald' | 'red' | 'primary'> = {
  new: 'primary',
  triaged: 'sky',
  assigned: 'sky',
  in_progress: 'amber',
  pending_parts: 'amber',
  resolved: 'emerald',
  closed: 'slate',
};

const STATUS_LABEL: Record<string, string> = {
  new: 'חדשה',
  triaged: 'סווגה',
  assigned: 'הוקצתה',
  in_progress: 'בטיפול',
  pending_parts: 'ממתינה לחלקים',
  resolved: 'נפתרה',
  closed: 'סגורה',
};

const PRIORITY_TONE: Record<Ticket['priority'], 'slate' | 'sky' | 'amber' | 'red'> = {
  low: 'slate',
  med: 'sky',
  high: 'amber',
  urgent: 'red',
};

const CHANNEL_LABEL: Record<string, string> = {
  app: 'אפליקציה',
  whatsapp: 'WhatsApp',
  bot: 'בוט',
  phone: 'טלפון',
  walkin: 'במשרד',
  email: 'אימייל',
};

export default function TicketsPage() {
  const { data, error, isLoading } = useSWR<Ticket[]>('/tickets', swrFetcher);
  const open = (data ?? []).filter((t) => !['resolved', 'closed'].includes(t.status)).length;

  const columns: Column<Ticket>[] = [
    {
      header: 'דחיפות',
      cell: (t) => (
        <StatusPill tone={PRIORITY_TONE[t.priority]}>
          {{ low: 'נמוך', med: 'רגיל', high: 'גבוה', urgent: 'דחוף' }[t.priority]}
        </StatusPill>
      ),
    },
    { header: 'נושא', cell: (t) => <span className="font-medium">{t.title}</span> },
    { header: 'קטגוריה', cell: (t) => t.category },
    { header: 'ערוץ', cell: (t) => CHANNEL_LABEL[t.intake_channel] ?? t.intake_channel },
    {
      header: 'נפתחה',
      cell: (t) => new Date(t.opened_at).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
      header: 'סטטוס',
      cell: (t) => <StatusPill tone={STATUS_TONE[t.status] ?? 'slate'}>{STATUS_LABEL[t.status] ?? t.status}</StatusPill>,
    },
    {
      header: '',
      align: 'left',
      cell: (t) => <Link href={`/tickets/${t.id}`} className="text-primary hover:underline">פרטים</Link>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="פניות שירות"
        subtitle={data ? `${data.length} פניות · ${open} פתוחות` : 'טוען...'}
        actions={
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            פנייה חדשה
          </Link>
        }
      />
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(t) => t.id}
        isLoading={isLoading}
        error={error as Error | null}
      />
    </div>
  );
}
