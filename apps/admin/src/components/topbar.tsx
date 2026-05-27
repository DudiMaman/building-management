'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, LogOut, User } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function Topbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="relative w-96">
        <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="חיפוש..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-10 ps-4 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
        </button>
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100"
          >
            <User className="h-5 w-5 text-slate-600" />
            {email && <span className="text-sm text-slate-700">{email}</span>}
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                <span>התנתקות</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
