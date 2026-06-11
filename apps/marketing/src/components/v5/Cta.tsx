import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Closing CTA — dark band, three-field form (trimmed from v4's five),
 * and the lineage closer: "ניהול הנדל"ן זה אצלנו."
 */
export function Cta() {
  return (
    <section id="cta" className="section" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider"
              style={{ background: 'rgba(252,211,77,0.12)', color: 'var(--brass-3)', border: '1px solid rgba(252,211,77,0.25)' }}
            >
              הדגמה אישית · 25 דק׳
            </div>
            <h2 className="hero-h1 mt-6" style={{ color: 'var(--paper)' }}>
              נראה לכם את המערכת
              <br />
              <span style={{ color: 'var(--brass-3)' }}>על הבניינים שלכם.</span>
            </h2>
            <p className="lead mt-6 max-w-md" style={{ color: 'var(--bg-3)' }}>
              שולחים רשימת בניינים, אנחנו מטעינים דירות אמיתיות, ומראים
              איך הגבייה והפניות יעבדו אצלכם. לא דמו גנרי.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form
              className="rounded-2xl border p-6 md:p-8"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)' }}
            >
              <div className="space-y-3">
                <label className="block">
                  <span className="sr-only">שם מלא</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="שם מלא"
                    className="w-full rounded-lg border bg-transparent px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[var(--brass-3)]"
                    style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'var(--paper)' }}
                  />
                </label>
                <label className="block">
                  <span className="sr-only">טלפון</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="050-0000000"
                    dir="ltr"
                    className="ltr w-full rounded-lg border bg-transparent px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[var(--brass-3)]"
                    style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'var(--paper)', textAlign: 'right' }}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold tracking-wider" style={{ color: 'var(--bg-3)' }}>
                    כמה בניינים בניהולכם?
                  </span>
                  <select
                    name="buildings"
                    className="w-full rounded-lg border bg-transparent px-4 py-3.5 text-[15px] outline-none focus:border-[var(--brass-3)]"
                    style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'var(--paper)' }}
                  >
                    <option style={{ background: 'var(--ink)' }}>1–3 בניינים</option>
                    <option style={{ background: 'var(--ink)' }}>4–10 בניינים</option>
                    <option style={{ background: 'var(--ink)' }}>11–30 בניינים</option>
                    <option style={{ background: 'var(--ink)' }}>30+ בניינים</option>
                  </select>
                </label>
                <button type="submit" className="btn w-full" style={{ background: 'var(--brass-3)', color: 'var(--ink)', minHeight: 52, fontSize: 16 }}>
                  תאמו הדגמה
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <p className="pt-1 text-center text-[12px]" style={{ color: 'var(--bg-3)' }}>
                  ללא התחייבות · נחזור תוך 24 שעות · או{' '}
                  <Link href="/signup" className="underline underline-offset-2" style={{ color: 'var(--brass-3)' }}>
                    התחילו ניסיון לבד
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-20 border-t pt-12 md:mt-24" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p
            className="text-center font-extrabold leading-tight tracking-tight"
            style={{ color: 'var(--brass-3)', fontSize: 'clamp(26px, 4.6vw, 52px)' }}
          >
            ניהול הנדל"ן זה אצלנו.
          </p>
        </div>
      </div>
    </section>
  );
}
