'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Building } from 'lucide-react';

const nav = [
  { href: '/#features', label: 'פיצ׳רים' },
  { href: '/#who', label: 'למי זה מתאים' },
  { href: '/#pricing', label: 'מחירים' },
  { href: '/#testimonials', label: 'לקוחות' },
  { href: '/#faq', label: 'שאלות' },
  { href: '/contact', label: 'צור קשר' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001/login';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Building className="h-4 w-4" />
          </span>
          ניהול מבנים
        </Link>

        <nav className="hidden gap-6 text-sm text-slate-700 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden gap-3 md:flex">
          <Link
            href={adminUrl}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            התחברות
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            ניסיון חינם
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-3 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3 border-t border-slate-100 pt-3">
              <Link
                href={adminUrl}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm"
              >
                התחברות
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white"
              >
                ניסיון חינם
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
