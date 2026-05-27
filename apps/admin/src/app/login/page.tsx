'use client';
import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">טוען...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!configured) {
      setError('Supabase לא הוגדר — בדקו את NEXT_PUBLIC_SUPABASE_URL ו-NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      router.replace(next);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'התחברות נכשלה';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function sendMagicLink() {
    setError(null);
    if (!configured) {
      setError('Supabase לא הוגדר');
      return;
    }
    if (!email) {
      setError('הזינו כתובת אימייל');
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authErr } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
      });
      if (authErr) throw authErr;
      setError(null);
      alert('שלחנו לכם קישור התחברות לאימייל');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'שליחת לינק נכשלה';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold">התחברות</h1>
        <p className="mt-2 text-sm text-slate-600">לחברות ניהול מבנים</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-primary"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'מתחבר...' : 'התחברות'}
          </button>
          <button
            type="button"
            onClick={sendMagicLink}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            שליחת קישור התחברות לאימייל
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          אין לכם חשבון?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            הירשמו
          </Link>
        </p>
      </div>
    </div>
  );
}
