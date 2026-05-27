'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export default function SignupPage() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!configured) {
      setError('Supabase לא הוגדר — בדקו את NEXT_PUBLIC_SUPABASE_* בהגדרות');
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: companyName, phone } },
      });
      if (authErr) throw authErr;
      const userId = data.user?.id;
      if (!userId) throw new Error('הרשמה נכשלה — נסה שוב');

      const accessToken = data.session?.access_token;
      const res = await fetch(`${API_URL}/v1/tenants/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          name: companyName,
          billing_email: email,
          phone,
          admin_user_id: userId,
          admin_full_name: companyName,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`יצירת חברה נכשלה: ${body.slice(0, 160)}`);
      }
      setDone(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'הרשמה נכשלה';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-white px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold">החשבון נוצר!</h1>
          <p className="mt-2 text-sm text-slate-600">
            שלחנו אליכם קישור אימות לאימייל. אחרי האימות, היכנסו ללוח הניהול.
          </p>
          <Link
            href={process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001/login'}
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-700"
          >
            מעבר ללוח הניהול
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold">הרשמה לניסיון חינם</h1>
        <p className="mt-2 text-sm text-slate-600">30 יום ניסיון, ללא כרטיס אשראי</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="שם חברת הניהול"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            minLength={2}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
          />
          <input
            type="email"
            placeholder="כתובת אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
          />
          <input
            type="tel"
            placeholder="מספר טלפון (05X-XXX-XXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="סיסמה (לפחות 6 תווים)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'יוצר חשבון...' : 'צרו חשבון'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          כבר רשומים?{' '}
          <Link
            href={process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001/login'}
            className="text-primary hover:underline"
          >
            התחברו
          </Link>
        </p>
      </div>
    </div>
  );
}
