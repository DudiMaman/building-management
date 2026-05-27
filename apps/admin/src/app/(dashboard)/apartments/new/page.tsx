'use client';
import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';
import { PageHeader } from '@/components/data-table';
import { Field, FormActions, FormCard, NumberInput, Select, TextInput } from '@/components/form';
import { apiFetch, swrFetcher, type Apartment, type Building } from '@/lib/api';
import { Suspense } from 'react';

export default function NewApartmentPage() {
  return (
    <Suspense fallback={null}>
      <NewApartmentForm />
    </Suspense>
  );
}

function NewApartmentForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { mutate } = useSWRConfig();
  const { data: buildings } = useSWR<Building[]>('/buildings', swrFetcher);

  const [form, setForm] = useState({
    building_id: params.get('building_id') ?? '',
    unit_number: '',
    floor: '',
    size_sqm: '',
    num_rooms: '',
    monthly_dues_amount: '',
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
      if (!form.building_id) throw new Error('בחרו בניין');
      const payload: Record<string, unknown> = {
        building_id: form.building_id,
        unit_number: form.unit_number.trim(),
      };
      if (form.floor) payload.floor = Number(form.floor);
      if (form.size_sqm) payload.size_sqm = Number(form.size_sqm);
      if (form.num_rooms) payload.num_rooms = Number(form.num_rooms);
      if (form.monthly_dues_amount) payload.monthly_dues_amount = Number(form.monthly_dues_amount);

      const created = await apiFetch<Apartment>('/apartments', { method: 'POST', body: payload });
      await mutate('/apartments');
      await mutate(`/apartments?building_id=${form.building_id}`);
      router.replace(`/apartments/${created.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="הוספת דירה" subtitle="לייבוא של כמה דירות בבת אחת — היכנסו לעמוד הבניין → CSV import." />
      <form onSubmit={submit}>
        <FormCard title="פרטי הדירה">
          <Field label="בניין" required>
            <Select
              required
              value={form.building_id}
              onChange={(e) => update('building_id', e.target.value)}
            >
              <option value="">בחרו בניין...</option>
              {(buildings ?? []).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.city}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="מספר יחידה" required hint='לדוגמה: 4ב, 12, A-3'>
              <TextInput
                required
                value={form.unit_number}
                onChange={(e) => update('unit_number', e.target.value)}
              />
            </Field>
            <Field label="קומה">
              <NumberInput
                value={form.floor}
                onChange={(e) => update('floor', e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="מ&quot;ר">
              <NumberInput
                step="0.1"
                min={0}
                value={form.size_sqm}
                onChange={(e) => update('size_sqm', e.target.value)}
              />
            </Field>
            <Field label="חדרים">
              <NumberInput
                step="0.5"
                min={0}
                value={form.num_rooms}
                onChange={(e) => update('num_rooms', e.target.value)}
              />
            </Field>
          </div>
          <Field label="ועד חודשי (₪)" hint="הסכום ירש לתוכנית גבייה אם תיצרו אחת לבניין">
            <NumberInput
              min={0}
              value={form.monthly_dues_amount}
              onChange={(e) => update('monthly_dues_amount', e.target.value)}
              placeholder="350"
            />
          </Field>
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <FormActions
            loading={loading}
            onCancel={() => router.back()}
            submitLabel="יצירת דירה"
          />
        </FormCard>
      </form>
    </div>
  );
}
