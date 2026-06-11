'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

/**
 * v5 pricing — pruned from v4: three tiers (no separate Trial card,
 * no ROI calculator). The 30-day trial is a banner line that applies
 * to every plan.
 */

type Cycle = 'monthly' | 'annual';
const ANNUAL_DISCOUNT = 0.15;

const tiers = [
  {
    name: 'Starter',
    tagline: 'לחברות עם עד 3 בניינים.',
    monthly: 399 as number | 'custom',
    buildings: 'עד 3 בניינים · 100 דירות',
    features: ['גבייה אוטומטית בכרטיס אשראי', 'פניות שירות ומשימות', 'חשבוניות תואמות רשות המסים', 'אפליקציית דיירים'],
    cta: 'התחילו ניסיון',
    href: '/signup',
  },
  {
    name: 'Pro',
    tagline: 'הבחירה של רוב חברות הניהול.',
    monthly: 1290 as number | 'custom',
    buildings: 'עד 15 בניינים · 600 דירות',
    features: ['הכל ב-Starter, ובנוסף:', 'בוט AI ב-WhatsApp', 'ייצוא לחשבשבת / ריווחית', 'דוחות מתקדמים', 'תמיכה בטלפון'],
    cta: 'התחילו ניסיון',
    href: '/signup',
    emphasis: true,
  },
  {
    name: 'Enterprise',
    tagline: 'לחברות עם 50+ בניינים.',
    monthly: 'custom' as number | 'custom',
    buildings: 'ללא הגבלה',
    features: ['הכל ב-Pro, ובנוסף:', 'SLA חוזי + SSO', 'מנהל לקוח ייעודי', 'אינטגרציות מותאמות'],
    cta: 'דברו איתנו',
    href: '/contact',
  },
];

export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>('monthly');

  return (
    <section id="pricing" className="section border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="container">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow">תמחור</div>
            <h2 className="display-2 mt-3 max-w-[16ch]">מחיר אחד. בלי הפתעות.</h2>
            <p className="lead mt-4 max-w-md">ללא דמי הקמה. ללא התחייבות שנתית. ביטול בכל עת.</p>
          </div>

          <div className="md:col-span-5 md:text-end">
            <div
              className="inline-flex items-center rounded-full border p-1"
              style={{ borderColor: 'var(--line-2)', background: 'var(--paper)' }}
              role="group"
              aria-label="מחזור חיוב"
            >
              {(
                [
                  ['monthly', 'חיוב חודשי'],
                  ['annual', 'חיוב שנתי'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setCycle(key)}
                  aria-pressed={cycle === key}
                  className="rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
                  style={{
                    background: cycle === key ? 'var(--ink)' : 'transparent',
                    color: cycle === key ? 'var(--paper)' : 'var(--ink-3)',
                  }}
                >
                  {label}
                  {key === 'annual' && (
                    <span className="ms-1.5" style={{ color: cycle === 'annual' ? 'var(--brass-3)' : 'var(--brass)' }}>
                      −15%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trial banner — replaces v4's fourth card */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border px-5 py-3.5 text-center text-[14px] md:mt-12"
          style={{ borderColor: 'var(--line-2)', background: 'var(--brass-soft)' }}
        >
          <span className="font-bold" style={{ color: 'var(--brass-2)' }}>
            30 יום ניסיון חינם בכל המסלולים
          </span>
          <span className="text-[var(--ink-3)]">· ללא כרטיס אשראי · כל הפיצ׳רים פתוחים</span>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {tiers.map((t) => {
            const price =
              t.monthly === 'custom'
                ? { big: 'בהתאמה', small: '' }
                : cycle === 'monthly'
                  ? { big: `₪${t.monthly.toLocaleString('he-IL')}`, small: 'לחודש' }
                  : {
                      big: `₪${Math.round((t.monthly as number) * (1 - ANNUAL_DISCOUNT)).toLocaleString('he-IL')}`,
                      small: 'לחודש, בחיוב שנתי',
                    };
            return (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-2xl p-7 ${t.emphasis ? '' : 'border'}`}
                style={{
                  background: t.emphasis ? 'var(--ink)' : 'var(--paper)',
                  borderColor: 'var(--line)',
                  color: t.emphasis ? 'var(--paper)' : 'var(--ink)',
                  boxShadow: t.emphasis ? '0 30px 60px -22px rgba(28,25,23,0.45)' : undefined,
                }}
              >
                {t.emphasis && (
                  <span
                    className="absolute -top-3 right-7 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wider"
                    style={{ background: 'var(--brass-3)', color: 'var(--ink)' }}
                  >
                    המומלץ
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[20px] font-extrabold">{t.name}</h3>
                  <span className="text-[12px]" style={{ color: t.emphasis ? 'var(--bg-3)' : 'var(--ink-3)' }}>
                    {t.buildings}
                  </span>
                </div>
                <p className="mt-1 text-[13px]" style={{ color: t.emphasis ? 'var(--bg-3)' : 'var(--ink-3)' }}>
                  {t.tagline}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="tnum ltr text-[38px] font-extrabold leading-none">{price.big}</span>
                  {price.small && (
                    <span className="text-[12px]" style={{ color: t.emphasis ? 'var(--bg-3)' : 'var(--ink-3)' }}>
                      {price.small}
                    </span>
                  )}
                </div>
                <ul className="mt-6 flex-1 space-y-2.5 border-t pt-5 text-[14px]" style={{ borderColor: t.emphasis ? 'rgba(255,255,255,0.14)' : 'var(--line)' }}>
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0" style={{ color: t.emphasis ? 'var(--brass-3)' : 'var(--brass)' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={t.href}
                  className="btn mt-7 w-full"
                  style={{
                    background: t.emphasis ? 'var(--brass-3)' : 'var(--ink)',
                    color: t.emphasis ? 'var(--ink)' : 'var(--paper)',
                  }}
                >
                  {t.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[12px] text-[var(--ink-3)]">
          המחירים אינם כוללים מע"מ. עמלת סליקה (Tranzila): 0.9% + <span className="ltr">₪1.20</span> לעסקה. מס"ב וצ׳קים — חינם.
        </p>
      </div>
    </section>
  );
}
