'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const nav = [
  { href: '#platform', label: 'הפלטפורמה' },
  { href: '#how', label: 'איך זה עובד' },
  { href: '#proof', label: 'לקוחות' },
  { href: '#pricing', label: 'מחירים' },
  { href: '#faq', label: 'שאלות' },
];

export function HeaderV2() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--ink-line)] bg-[var(--paper)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/v2" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center bg-[var(--ink)] text-[var(--paper)]">
            <span className="serif text-lg leading-none">נ</span>
          </span>
          <span className="serif text-xl tracking-tight">ניהול מבנים</span>
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
            התחברות
          </Link>
          <Link
            href="/signup"
            className="rounded-none bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] hover:bg-[var(--ink-soft)]"
          >
            תיאום הדגמה
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-[var(--ink)] md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--ink-line)] bg-[var(--paper)] md:hidden">
          <nav className="flex flex-col px-6 py-3 text-sm">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[var(--ink-soft)]"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/signup"
              className="mt-2 inline-block bg-[var(--ink)] px-4 py-3 text-center font-medium text-[var(--paper)]"
            >
              תיאום הדגמה
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
