'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { PageHeader } from '@/components/data-table';
import { Field, FormActions, FormCard, Textarea, TextInput } from '@/components/form';
import { apiFetch, type Vendor } from '@/lib/api';

export default function NewVendorPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [form, setForm] = useState({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    vat_id: '',
    iban: '',
    services: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
      };
      if (form.contact_name) payload.contact_name = form.contact_name;
      if (form.phone) payload.phone = form.phone;
      if (form.email) payload.email = form.email;
      if (form.vat_id) payload.vat_id = form.vat_id;
      if (form.iban) payload.iban = form.iban;
      if (form.services)
        payload.services = form.services
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      if (form.notes) payload.notes = form.notes;

      const created = await apiFetch<Vendor>('/vendors', { method: 'POST', body: payload });
      await mutate('/vendors');
      router.replace(`/vendors/${created.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="הוספת ספק" subtitle="ספקים שמופיעים בחשבוניות יוצרות אוטומטית מקבלות OCR." />
      <form onSubmit={submit}>
        <FormCard title="פרטי הספק">
          <Field label="שם הספק" required>
            <TextInput
              required
              minLength={2}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="לדוגמה: חברת ניקיון הירוק"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="איש קשר">
              <TextInput
                value={form.contact_name}
                onChange={(e) => update('contact_name', e.target.value)}
                placeholder="משה כהן"
              />
            </Field>
            <Field label="טלפון">
              <TextInput
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="03-1234567"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="אימייל">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="info@vendor.co.il"
              />
            </Field>
            <Field label="ע.מ. / ח.פ.">
              <TextInput
                value={form.vat_id}
                onChange={(e) => update('vat_id', e.target.value)}
              />
            </Field>
          </div>
          <Field label="IBAN" hint="לתשלום אוטומטי דרך מס&quot;ב">
            <TextInput
              value={form.iban}
              onChange={(e) => update('iban', e.target.value)}
              placeholder="IL62 0108 0000 0009 9999 999"
            />
          </Field>
          <Field label="שירותים" hint="מפרידים בפסיק. למשל: ניקיון, גינון">
            <TextInput
              value={form.services}
              onChange={(e) => update('services', e.target.value)}
              placeholder="ניקיון, גינון"
            />
          </Field>
          <Field label="הערות">
            <Textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </Field>
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <FormActions
            loading={loading}
            onCancel={() => router.back()}
            submitLabel="יצירת ספק"
          />
        </FormCard>
      </form>
    </div>
  );
}
