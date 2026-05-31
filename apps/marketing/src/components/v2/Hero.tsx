import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BuildingDrawing } from './BuildingDrawing';

export function HeroV2() {
  return (
    <section className="relative overflow-hidden">
      {/* Top meta strip — looks like a magazine masthead */}
      <div className="border-b border-[var(--ink-line)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 lg:px-10">
          <span className="label text-[var(--ink-soft)]">VOL. 1 / 2026 · TEL AVIV</span>
          <span className="label text-[var(--ink-soft)]">
            פלטפורמת ניהול נדל"ן · רישיון רשות המסים · GDPR
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl items-stretch gap-12 px-6 pt-14 pb-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pt-20 lg:pb-28">
        {/* RIGHT (RTL = visual start): editorial copy */}
        <div className="lg:col-span-7">
          <span className="label text-[var(--brass)]">חדש · 2026</span>

          <h1 className="serif mt-6 text-[44px] leading-[1.05] tracking-tight md:text-[64px] lg:text-[76px]">
            ניהול נדל"ן,
            <br />
            <span className="italic text-[var(--ink-soft)]">בסטנדרט</span>{' '}
            עסקי.
          </h1>

          <p className="mt-7 max-w-[36ch] text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">
            מערכת אחת לחברת הניהול, לוועד, לבעלים ולשוכרים — גבייה,
            פניות, מסמכים ותקשורת. בנויה לעולם הנדל"ן הישראלי, מאסיפת
            ועד ועד חשבונית מס.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 bg-[var(--ink)] px-7 py-4 text-base font-medium text-[var(--paper)] hover:bg-[var(--ink-soft)]"
            >
              לקבלת הדגמה אישית
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </Link>
            <Link
              href="#platform"
              className="link inline-flex items-center gap-1 px-2 py-4 text-base font-medium text-[var(--ink)]"
            >
              צפו בפלטפורמה
            </Link>
          </div>

          {/* Inline credibility row */}
          <div className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--ink-line)] pt-6">
            <div>
              <div className="serif tnum text-3xl">8,400+</div>
              <div className="mt-1 text-xs text-[var(--ink-soft)]">דירות בניהול</div>
            </div>
            <div>
              <div className="serif tnum text-3xl">24</div>
              <div className="mt-1 text-xs text-[var(--ink-soft)]">חברות ניהול</div>
            </div>
            <div>
              <div className="serif tnum text-3xl">94%</div>
              <div className="mt-1 text-xs text-[var(--ink-soft)]">גבייה ממוצעת</div>
            </div>
          </div>
        </div>

        {/* LEFT: the architectural drawing on a paper card */}
        <div className="relative lg:col-span-5">
          <div className="relative border border-[var(--ink-line)] bg-[var(--paper-2)] p-5 md:p-7">
            <div className="absolute inset-x-0 -top-3 mx-auto label hidden w-fit bg-[var(--paper)] px-3 text-[var(--ink-soft)] md:block">
              FIG. 01 · LIVE BUILDING VIEW
            </div>
            <div className="aspect-[4/5] w-full">
              <BuildingDrawing />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
