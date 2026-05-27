'use client';
import { useState, type FormEvent } from 'react';
import { Send, Check } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (apiBase) {
        await fetch(`${apiBase}/v1/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Newsletter signup',
            email,
            source: 'newsletter',
          }),
        });
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-700">
        <Check className="h-4 w-4" />
        תודה! נשלח לכם תוכן בקרוב.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="המייל שלכם"
        className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">הרשמה</span>
      </button>
    </form>
  );
}
