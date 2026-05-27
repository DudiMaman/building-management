'use client';
import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/** RTL-friendly label + control + error wrapper used by every form. */
export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ms-1 text-red-500">*</span>}
      </span>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

/** Text / number / email / tel input with the default styling. */
export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary ${props.className ?? ''}`}
    />
  );
}

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <TextInput type="number" {...props} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary ${props.className ?? ''}`}
    >
      {children}
    </select>
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary ${props.className ?? ''}`}
    />
  );
}

/** Primary submit + cancel pair (RTL). */
export function FormActions({
  loading,
  onCancel,
  submitLabel = 'שמירה',
}: {
  loading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {loading ? 'שומר...' : submitLabel}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          ביטול
        </button>
      )}
    </div>
  );
}

/** Card shell used by single-form pages. */
export function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}
