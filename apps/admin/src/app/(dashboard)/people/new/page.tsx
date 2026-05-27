'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { PageHeader } from '@/components/data-table';
import { Field, FormActions, FormCard, Select, TextInput } from '@/components/form';
import { apiFetch, type Person } from '@/lib/api';

const LANGUAGES = [
  { value: 'he', label: 'עברית' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
];

export default function NewPersonPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [form, setForm] = useState({
    full_name: '',
    phone_e164: '',
    email: '',
    language: 'he',
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
        full_name: form.full_name.trim(),
        language: form.language,
      };
      if (form.phone_e164) payload.phone_e164 = form.phone_e164.trim();
      if (form.email) payload.email = form.email.trim();

      const created = await apiFetch<Person>('/people', { method: 'POST', body: payload });
      await mutate('/people');
      router.replace(`/people/${created.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="הוספת אדם"
        subtitle="לרוב האנשים נוספים אוטומטית כשהם סורקים את ה-QR. כאן ידני."
      />
      <form onSubmit={submit}>
        <FormCard title="פרטי האדם">
          <Field label="שם מלא" required>
            <TextInput
              required
              minLength={2}
              value={form.full_name}
              onChange={(e) => update('full_name', e.target.value)}
              placeholder="ישראל ישראלי"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="טלפון נייד" hint="בפורמט בינלאומי (+972...) או ישראלי">
              <TextInput
                type="tel"
                value={form.phone_e164}
                onChange={(e) => update('phone_e164', e.target.value)}
                placeholder="050-1234567"
              />
            </Field>
            <Field label="אימייל">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="israeli@example.com"
              />
            </Field>
          </div>
          <Field label="שפת תקשורת">
            <Select
              value={form.language}
              onChange={(e) => update('language', e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </Select>
          </Field>
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <FormActions
            loading={loading}
            onCancel={() => router.back()}
            submitLabel="יצירת אדם"
          />
        </FormCard>
      </form>
    </div>
  );
}
