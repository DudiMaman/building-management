'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const nav = [
  { href: '#platform', label: 'הפלטפורמה' },
  { href: '#how', label: 'איך זה עובד' },
  { href: '#proof', label: 'לקוחות' },
  { href: '#pricing', label: 'תמחור' },
  { href: '#faq', label: 'שאלות' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled ? 'border-b bg-[var(--bg)]/95 backdrop-blur' : 'bg-transparent'
      }`}
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="container flex h-[60px] items-center justify-between md:h-[68px]">
        {/* Logo */}
        <Link href="/v3" className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-[6px] text-base font-bold"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            aria-label="ניהול מבנים"
          >
            נ
          </span>
          <span className="text-[17px] font-bold tracking-tight">ניהול מבנים</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-[15px] text-[var(--ink-2)] hover:text-[var(--ink)]">
            התחברות
          </Link>
          <Link
            href="#cta"
            className="btn-primary"
            style={{ padding: '10px 18px', minHeight: 'auto', fontSize: 14 }}
          >
            הדגמה חינם
          </Link>
        </div>

        {/* Mobile burger — at the FAR end of the row, which is the left in RTL */}
        <button
          aria-label="פתיחת תפריט"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--ink)] hover:bg-[var(--bg-2)] md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="absolute inset-x-0 top-full border-t bg-[var(--bg)] md:hidden"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="container py-4">
            <nav className="flex flex-col">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b py-3 text-[15px] text-[var(--ink)]"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/login" className="btn-ghost w-full justify-center" onClick={() => setOpen(false)}>
                התחברות
              </Link>
              <Link href="#cta" className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>
                הדגמה חינם
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
