'use client';
import { type ReactNode } from 'react';

export interface Column<T> {
  header: string;
  /** Cell content. Receives the row + index. */
  cell: (row: T, index: number) => ReactNode;
  /** Optional Tailwind classes for the <td> / <th>. */
  className?: string;
  align?: 'right' | 'left' | 'center';
}

interface DataTableProps<T> {
  rows: T[] | undefined;
  columns: Column<T>[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: { message: string } | null;
  empty?: ReactNode;
  /** Renders a row click handler — usually a Link wrapper. */
  onRowClick?: (row: T) => void;
}

/**
 * Tiny RTL-friendly data table used across admin pages. Keeps the
 * loading / empty / error states consistent so every screen looks the
 * same when the API is slow or empty.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  isLoading,
  error,
  empty,
  onRowClick,
}: DataTableProps<T>) {
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
        טעינה נכשלה: {error.message}
      </div>
    );
  }
  if (isLoading && (!rows || rows.length === 0)) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        טוען...
      </div>
    );
  }
  if (rows && rows.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
        {empty ?? <p className="text-sm text-slate-500">אין נתונים להצגה.</p>}
      </div>
    );
  }
  if (!rows) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-right text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {columns.map((c, idx) => (
              <th
                key={idx}
                className={`px-6 py-3 ${c.align === 'left' ? 'text-left' : c.align === 'center' ? 'text-center' : ''} ${c.className ?? ''}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-t border-slate-100 ${onRowClick ? 'cursor-pointer' : ''} hover:bg-slate-50`}
            >
              {columns.map((c, idx) => (
                <td
                  key={idx}
                  className={`px-6 py-4 ${c.align === 'left' ? 'text-left' : c.align === 'center' ? 'text-center' : ''} ${c.className ?? ''}`}
                >
                  {c.cell(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Status chip — used to render enum-style statuses with a consistent palette. */
export function StatusPill({
  children,
  tone = 'slate',
}: {
  children: ReactNode;
  tone?: 'slate' | 'emerald' | 'amber' | 'red' | 'primary' | 'sky';
}) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    primary: 'bg-primary-50 text-primary-700',
    sky: 'bg-sky-100 text-sky-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Page header shared across admin pages. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </header>
  );
}
