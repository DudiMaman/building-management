'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { PageHeader } from '@/components/data-table';
import { Field, FormActions, FormCard, NumberInput, TextInput } from '@/components/form';
import { apiFetch, type Building } from '@/lib/api';

export default function NewBuildingPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [form, setForm] = useState({
    name: '',
    address_line: '',
    city: '',
    postal_code: '',
    num_floors: '',
    num_apartments: '',
    year_built: '',
    bank_account_iban: '',
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
        address_line: form.address_line.trim(),
        city: form.city.trim(),
      };
      if (form.postal_code) payload.postal_code = form.postal_code;
      if (form.num_floors) payload.num_floors = Number(form.num_floors);
      if (form.num_apartments) payload.num_apartments = Number(form.num_apartments);
      if (form.year_built) payload.year_built = Number(form.year_built);
      if (form.bank_account_iban) payload.bank_account_iban = form.bank_account_iban;

      const created = await apiFetch<Building>('/buildings', { method: 'POST', body: payload });
      // Refresh the buildings list cache
      await mutate('/buildings');
      router.replace(`/buildings/${created.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="הוספת בניין" subtitle="הזינו את הפרטים. שדות עם * חובה." />
      <form onSubmit={submit}>
        <FormCard title="פרטי הבניין">
          <Field label="שם הבניין" required>
            <TextInput
              required
              minLength={2}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="לדוגמה: הרצל 10"
            />
          </Field>
          <Field label="כתובת" required>
            <TextInput
              required
              minLength={2}
              value={form.address_line}
              onChange={(e) => update('address_line', e.target.value)}
              placeholder="רחוב הרצל 10"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="עיר" required>
              <TextInput
                required
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="תל אביב-יפו"
              />
            </Field>
            <Field label="מיקוד">
              <TextInput
                value={form.postal_code}
                onChange={(e) => update('postal_code', e.target.value)}
                placeholder="6499210"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="קומות">
              <NumberInput
                min={1}
                value={form.num_floors}
                onChange={(e) => update('num_floors', e.target.value)}
                placeholder="6"
              />
            </Field>
            <Field label="דירות">
              <NumberInput
                min={1}
                value={form.num_apartments}
                onChange={(e) => update('num_apartments', e.target.value)}
                placeholder="24"
              />
            </Field>
            <Field label="שנת בנייה">
              <NumberInput
                min={1800}
                max={new Date().getFullYear() + 5}
                value={form.year_built}
                onChange={(e) => update('year_built', e.target.value)}
                placeholder="1995"
              />
            </Field>
          </div>
          <Field label="IBAN לחשבון הבניין" hint="ישמש לאיסוף הוועד והפקדות צ׳קים">
            <TextInput
              value={form.bank_account_iban}
              onChange={(e) => update('bank_account_iban', e.target.value)}
              placeholder="IL62 0108 0000 0009 9999 999"
            />
          </Field>
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <FormActions
            loading={loading}
            onCancel={() => router.back()}
            submitLabel="יצירת בניין"
          />
        </FormCard>
      </form>
    </div>
  );
}
