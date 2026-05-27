'use client';
import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEY = 'bm.cookies.consent';

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = window.localStorage.getItem(STORAGE_KEY);
    if (!consent) setOpen(true);
  }, []);

  function accept(level: 'all' | 'essential') {
    window.localStorage.setItem(STORAGE_KEY, level);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] sm:right-auto sm:left-3 sm:max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">עוגיות הכרחיות בלבד</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              אנחנו משתמשים בעוגיות הכרחיות לתפעול האתר ובמדידה אנונימית.
              אין עוגיות מעקב פרסומי. פרטים ב-
              <Link href="/legal/privacy" className="text-primary hover:underline">
                מדיניות פרטיות
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => accept('all')}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
              >
                מסכימ.ה
              </button>
              <button
                onClick={() => accept('essential')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                רק הכרחיות
              </button>
            </div>
          </div>
          <button
            onClick={() => accept('essential')}
            aria-label="סגירה"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
