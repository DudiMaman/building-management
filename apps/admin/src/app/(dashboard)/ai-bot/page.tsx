'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { apiFetch, swrFetcher } from '@/lib/api';

interface BotSettings {
  tone?: string;
  custom_rules?: string;
  enabled?: boolean;
}

const TONES = [
  { v: '', l: 'ברירת מחדל' },
  { v: 'formal', l: 'רשמי' },
  { v: 'friendly', l: 'ידידותי' },
  { v: 'concise', l: 'תמציתי' },
];

export default function AiBotPage() {
  const { data, mutate } = useSWR<BotSettings>('/ai-bot/settings', swrFetcher);
  const [tone, setTone] = useState('');
  const [rules, setRules] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setTone(data.tone ?? '');
      setRules(data.custom_rules ?? '');
      setEnabled(data.enabled !== false);
    }
  }, [data]);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await apiFetch('/ai-bot/settings', {
        method: 'PUT',
        body: { tone: tone || undefined, custom_rules: rules || undefined, enabled },
      });
      await mutate();
      setSaved(true);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold">בוט AI — כוונון</h1>
        <p className="mt-1 text-sm text-slate-600">סגנון דיבור, חוקים מותאמים והפעלה — מוזרק לפרומפט של הבוט</p>
      </header>

      <div className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4" />
          <span className="text-sm font-medium">הבוט פעיל</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-slate-700">סגנון דיבור</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {TONES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">חוקים והנחיות מותאמים</label>
          <p className="text-xs text-slate-500">למשל: שעות קבלת קהל, מדיניות, FAQ ספציפי לחברה.</p>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="כתבו כאן הנחיות שיתווספו לפרומפט של הבוט…"
          />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
            {saving ? 'שומר…' : 'שמירה'}
          </button>
          {saved && <span className="text-sm text-emerald-600">נשמר ✓</span>}
        </div>
      </div>
    </div>
  );
}
