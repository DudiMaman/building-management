'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

/**
 * Sticky scroll-aware header. Compresses height + adds glass backdrop on
 * scroll. Mega menu on "הפלטפורמה" (Enterprise Gateway pattern from skill).
 */

const platformMenu = {
  finance: {
    label: 'גבייה ופיננסים',
    items: [
      { label: 'גבייה אוטומטית', desc: 'אשראי, 1-12 תשלומים' },
      { label: 'חשבוניות ITA', desc: 'מספור רציף, רשות המסים' },
      { label: 'צ׳קים דחויים', desc: 'הפקדות + טיפול בחזרה' },
      { label: 'תשלומי ספקים', desc: 'מס"ב, יומן הוצאות' },
    ],
  },
  ops: {
    label: 'תפעול ואחזקה',
    items: [
      { label: 'פניות שירות', desc: 'סיווג AI, SLA, ניתוב' },
      { label: 'משימות אחזקה', desc: 'תכנון, צילום, מעקב' },
      { label: 'מסמכי הבניין', desc: 'כספת + תזכורות תפוגה' },
      { label: 'שערי חניה', desc: 'פתיחה + יומן גישה' },
    ],
  },
  comms: {
    label: 'תקשורת ו-AI',
    items: [
      { label: 'בוט AI WhatsApp', desc: 'עברית, 24/7' },
      { label: 'לוח מודעות', desc: 'טירגוט לפי תפקיד' },
      { label: 'הצבעות וסקרים', desc: 'חתימה דיגיטלית' },
      { label: 'אפליקציה לדיירים', desc: 'iOS + Android' },
    ],
  },
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass border-b' : 'bg-transparent'
      }`}
      style={{ borderColor: scrolled ? 'var(--line)' : 'transparent' }}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div
        className={`container flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-[58px]' : 'h-[72px]'
        }`}
      >
        {/* Brand mark */}
        <Link href="/v4" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-[17px] font-extrabold tracking-tight">ניהול מבנים</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <button
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((v) => !v)}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-[var(--ink-2)] hover:bg-[var(--bg-2)] hover:text-[var(--ink)]"
          >
            הפלטפורמה
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
          </button>
          <a href="#how" className="rounded-md px-3 py-2 text-[15px] text-[var(--ink-2)] hover:text-[var(--ink)]">
            איך זה עובד
          </a>
          <a href="#proof" className="rounded-md px-3 py-2 text-[15px] text-[var(--ink-2)] hover:text-[var(--ink)]">
            לקוחות
          </a>
          <a href="#pricing" className="rounded-md px-3 py-2 text-[15px] text-[var(--ink-2)] hover:text-[var(--ink)]">
            תמחור
          </a>
          <a href="#faq" className="rounded-md px-3 py-2 text-[15px] text-[var(--ink-2)] hover:text-[var(--ink)]">
            שאלות
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-[14px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)]">
            התחברות
          </Link>
          <Link href="#cta" className="btn btn-ink" style={{ minHeight: 40, padding: '10px 18px', fontSize: 14 }}>
            הדגמה חינם
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          aria-label={mobileOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--ink)] hover:bg-[var(--bg-2)] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop mega menu */}
      {megaOpen && (
        <div
          className="absolute inset-x-0 top-full border-t border-b bg-[var(--paper)] shadow-2xl"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="container py-10">
            <div className="grid gap-10 lg:grid-cols-3">
              {Object.entries(platformMenu).map(([key, group]) => (
                <div key={key}>
                  <div className="eyebrow mb-4">{group.label}</div>
                  <ul className="space-y-1">
                    {group.items.map((it) => (
                      <li key={it.label}>
                        <a
                          href="#platform"
                          onClick={() => setMegaOpen(false)}
                          className="block rounded-md p-3 hover:bg-[var(--bg-2)]"
                        >
                          <div className="text-[14px] font-bold text-[var(--ink)]">{it.label}</div>
                          <div className="mt-0.5 text-[12px] text-[var(--ink-3)]">{it.desc}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div
              className="mt-8 flex flex-col items-start justify-between gap-3 border-t pt-6 md:flex-row md:items-center"
              style={{ borderColor: 'var(--line)' }}
            >
              <p className="text-[13px] text-[var(--ink-3)]">
                לסקירה מלאה של 20+ המודולים —{' '}
                <a href="#platform" className="link">צפו במסך הפלטפורמה</a>
              </p>
              <Link
                href="#cta"
                onClick={() => setMegaOpen(false)}
                className="btn btn-brass"
                style={{ minHeight: 40, padding: '10px 20px', fontSize: 14 }}
              >
                תאמו הדגמה
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="absolute inset-x-0 top-full border-t bg-[var(--bg)] lg:hidden"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="container py-2">
            <nav className="flex flex-col">
              {[
                ['הפלטפורמה', '#platform'],
                ['איך זה עובד', '#how'],
                ['לקוחות', '#proof'],
                ['תמחור', '#pricing'],
                ['שאלות', '#faq'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b py-4 text-[16px] font-medium text-[var(--ink)]"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-4 mb-4 flex flex-col gap-2">
              <Link href="/login" className="btn btn-ghost w-full" onClick={() => setMobileOpen(false)}>
                התחברות
              </Link>
              <Link href="#cta" className="btn btn-ink w-full" onClick={() => setMobileOpen(false)}>
                הדגמה חינם
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/** Mark — small bezel-style logo with brass line accent */
function BrandMark() {
  return (
    <span
      className="relative grid h-9 w-9 place-items-center rounded-[8px]"
      style={{ background: 'var(--ink)' }}
    >
      <span style={{ color: 'var(--paper)' }} className="text-[15px] font-extrabold">
        נ
      </span>
      <span
        className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full"
        style={{ background: 'var(--brass)' }}
      />
    </span>
  );
}
