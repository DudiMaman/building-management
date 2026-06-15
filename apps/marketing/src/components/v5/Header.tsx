'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

/**
 * v5 header — deliberately simpler than v4: no mega menu. Brand, four
 * anchors, login, one CTA. Keeps the proven scroll-aware glass compression.
 */

const NAV = [
  ['הפלטפורמה', '#story'],
  ['למי זה מתאים', '#who'],
  ['תמחור', '#pricing'],
  ['שאלות', '#faq'],
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass border-b' : 'bg-transparent'}`}
      style={{ borderColor: scrolled ? 'var(--line)' : 'transparent' }}
    >
      <div
        className={`container flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-[76px] lg:h-[88px]' : 'h-[84px] lg:h-[112px]'
        }`}
      >
        <Link href="/v5" aria-label="Pulse — דף הבית" className="flex shrink-0 items-center">
          {/* Combined logo, inline so the wordmark font always loads.
              Aspect ratio 300:100 (= 3:1). Eased down from the earlier
              oversized desktop mark for better proportion; mobile sizes
              keep the wordmark inside the viewport. */}
          <div
            className={`block transition-all duration-300 ${
              scrolled
                ? 'h-[56px] w-[168px] lg:h-[64px] lg:w-[192px]'
                : 'h-[64px] w-[192px] lg:h-[88px] lg:w-[264px]'
            }`}
          >
            <Logo className="h-full w-full" />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="ניווט ראשי">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-md px-3.5 py-2 text-[15px] font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--bg-2)] hover:text-[var(--ink)]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link
            href="/login"
            className="btn btn-ink"
            style={{ minHeight: 42, padding: '10px 22px', fontSize: 14 }}
          >
            התחברות
          </Link>
        </div>

        <button
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--ink)] hover:bg-[var(--bg-2)] lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass absolute inset-x-0 top-full border-b lg:hidden" style={{ borderColor: 'var(--line)' }}>
          <div className="container py-2">
            <nav className="flex flex-col" aria-label="ניווט נייד">
              {NAV.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="border-b py-4 text-[16px] font-medium text-[var(--ink)]"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mb-4 mt-4">
              <Link href="/login" className="btn btn-ghost w-full" onClick={() => setOpen(false)}>
                התחברות
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

