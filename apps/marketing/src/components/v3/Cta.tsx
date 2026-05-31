import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Closing CTA — dark navy section (per research, premium SaaS often
 * uses a single dark band as the closing CTA, with brass as the
 * single highlight). Mobile-first stack; desktop is 2-column.
 */

export function Cta() {
  return (
    <section
      id="cta"
      className="section"
      style={{ background: 'var(--ink)', color: 'var(--paper)' }}
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div
              className="inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase"
              style={{ background: 'rgba(176,136,80,0.2)', color: 'var(--brass-2)' }}
            >
              הדגמה
            </div>
            <h2 className="display-1 mt-5 max-w-[18ch]" style={{ color: 'var(--paper)' }}>
              נראה לכם את המערכת על
              <br />
              <span style={{ color: 'var(--brass)' }}>הבניינים שלכם.</span>
            </h2>
            <p className="lead mt-6 max-w-md" style={{ color: 'var(--bg-2)' }}>
              שיחה קצרה של 25 דקות. אנחנו לוקחים את הרשימה שלכם, מטעינים
              דירות אמיתיות, ומראים איך הגבייה והפניות יעבדו אצלכם —
              לא דמו גנרי.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form className="space-y-3">
              <input
                type="text"
                placeholder="שם מלא"
                className="w-full rounded-md border bg-transparent px-4 py-3 text-[15px] text-[var(--paper)] placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--brass)]"
                style={{ borderColor: 'rgba(255,255,255,0.18)' }}
              />
              <input
                type="text"
                placeholder="חברת ניהול"
                className="w-full rounded-md border bg-transparent px-4 py-3 text-[15px] text-[var(--paper)] placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--brass)]"
                style={{ borderColor: 'rgba(255,255,255,0.18)' }}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="tel"
                  placeholder="050-0000000"
                  dir="ltr"
                  className="w-full rounded-md border bg-transparent px-4 py-3 text-[15px] text-[var(--paper)] placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--brass)] ltr"
                  style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                />
                <input
                  type="email"
                  placeholder="email@company.co.il"
                  dir="ltr"
                  className="w-full rounded-md border bg-transparent px-4 py-3 text-[15px] text-[var(--paper)] placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--brass)] ltr"
                  style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[15px] font-bold transition-colors"
                style={{ background: 'var(--brass)', color: 'var(--ink)' }}
              >
                תאמו הדגמה — 25 דק׳
                <ArrowLeft className="h-4 w-4" />
              </button>
              <p className="text-center text-[12px]" style={{ color: 'var(--bg-2)' }}>
                ללא התחייבות · נחזור תוך 24 שעות
              </p>
            </form>
          </div>
        </div>

        {/* Bottom row: alternative path */}
        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 text-[14px] md:flex-row md:gap-0"
          style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--bg-2)' }}
        >
          <span>מעדיפים לנסות לבד?</span>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 font-semibold"
            style={{ color: 'var(--paper)' }}
          >
            ניסיון חינם ל-30 יום
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
