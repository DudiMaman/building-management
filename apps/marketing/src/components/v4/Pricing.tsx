'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

type Cycle = 'monthly' | 'annual';

interface Tier {
  name: string;
  tagline: string;
  monthly: number | 'free' | 'custom';
  features: string[];
  buildings: string;
  apartments: string;
  cta: string;
  href: string;
  emphasis?: boolean;
}

const tiers: Tier[] = [
  {
    name: 'Trial',
    tagline: 'ניסיון 30 יום, ללא כרטיס אשראי.',
    monthly: 'free',
    features: ['כל הפיצ׳רים', 'תמיכה במייל', 'ייבוא נתונים בעצמכם'],
    buildings: 'בניין אחד',
    apartments: 'עד 20',
    cta: 'התחילו ניסיון',
    href: '/signup',
  },
  {
    name: 'Starter',
    tagline: 'לחברות עם עד 3 בניינים פעילים.',
    monthly: 399,
    features: [
      'גביה אוטומטית בכרטיס אשראי',
      'פניות שירות + ניהול משימות',
      'חשבוניות תואמות רשות המסים',
      'תמיכה במייל',
    ],
    buildings: 'עד 3',
    apartments: 'עד 100',
    cta: 'התחילו ניסיון',
    href: '/signup',
  },
  {
    name: 'Pro',
    tagline: 'הבחירה של רוב חברות הניהול.',
    monthly: 1290,
    features: [
      'הכל ב-Starter, ובנוסף:',
      'בוט AI ב-WhatsApp',
      'ייצוא לחשבשבת / ריווחית / פריוריטי',
      'דוחות מתקדמים',
      'אפליקציית דסקטופ',
      'תמיכה בטלפון',
    ],
    buildings: 'עד 15',
    apartments: 'עד 600',
    cta: 'התחילו ניסיון',
    href: '/signup',
    emphasis: true,
  },
  {
    name: 'Enterprise',
    tagline: 'לחברות עם 50+ בניינים.',
    monthly: 'custom',
    features: [
      'הכל ב-Pro, ובנוסף:',
      'SLA חוזי',
      'SSO + הרשאות מתקדמות',
      'מנהל לקוח ייעודי',
      'אינטגרציות מותאמות',
    ],
    buildings: 'ללא הגבלה',
    apartments: 'ללא הגבלה',
    cta: 'דברו איתנו',
    href: '/contact',
  },
];

const ANNUAL_DISCOUNT = 0.15;

export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>('monthly');

  return (
    <section id="pricing" className="section">
      <div className="container">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow">תמחור</div>
            <h2 className="display-2 mt-3 max-w-[16ch]">
              שקיפות מלאה. ללא מנגנון.
            </h2>
            <p className="lead mt-4 max-w-md">
              ללא דמי הקמה. ללא התחייבות שנתית. ביטול בכל עת.
            </p>
          </div>

          <div className="md:col-span-5 md:text-end">
            <div
              className="inline-flex items-center rounded-full border p-1"
              style={{ borderColor: 'var(--line-2)', background: 'var(--paper)' }}
            >
              <button
                onClick={() => setCycle('monthly')}
                className="rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
                style={{
                  background: cycle === 'monthly' ? 'var(--ink)' : 'transparent',
                  color: cycle === 'monthly' ? 'var(--paper)' : 'var(--ink-3)',
                }}
              >
                חיוב חודשי
              </button>
              <button
                onClick={() => setCycle('annual')}
                className="rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
                style={{
                  background: cycle === 'annual' ? 'var(--ink)' : 'transparent',
                  color: cycle === 'annual' ? 'var(--paper)' : 'var(--ink-3)',
                }}
              >
                חיוב שנתי{' '}
                <span style={{ color: cycle === 'annual' ? 'var(--brass-3)' : 'var(--brass)' }}>
                  −15%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, i) => (
            <PriceCard key={t.name} tier={t} cycle={cycle} delay={i * 60} />
          ))}
        </div>

        <p className="mt-6 text-[12px] text-[var(--ink-3)]">
          המחירים אינם כוללים מע"מ. עמלת סליקה (Tranzila): 0.9% +{' '}
          <span className="ltr">₪1.20</span> לעסקה. תשלום במס"ב או צ׳ק — חינם.
        </p>

        <RoiCalculator />
      </div>
    </section>
  );
}

function PriceCard({ tier, cycle, delay }: { tier: Tier; cycle: Cycle; delay: number }) {
  const display = (() => {
    if (tier.monthly === 'free') return { big: 'חינם', small: '30 יום' };
    if (tier.monthly === 'custom') return { big: 'בהתאמה', small: '' };
    const m = tier.monthly;
    return cycle === 'monthly'
      ? { big: `₪${m.toLocaleString('he-IL')}`, small: 'לחודש' }
      : {
          big: `₪${Math.round(m * (1 - ANNUAL_DISCOUNT)).toLocaleString('he-IL')}`,
          small: 'לחודש, בחיוב שנתי',
        };
  })();

  return (
    <div
      className={`reveal relative flex flex-col rounded-2xl p-6 md:p-7 ${
        tier.emphasis ? '' : 'border'
      }`}
      style={{
        background: tier.emphasis ? 'var(--ink)' : 'var(--paper)',
        borderColor: tier.emphasis ? 'transparent' : 'var(--line)',
        color: tier.emphasis ? 'var(--paper)' : 'var(--ink)',
        animationDelay: `${delay}ms`,
        boxShadow: tier.emphasis
          ? '0 30px 60px -20px rgba(28, 25, 23, 0.4)'
          : undefined,
      }}
    >
      {tier.emphasis && (
        <span
          className="absolute -top-3 right-6 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase"
          style={{ background: 'var(--brass)', color: 'var(--ink)' }}
        >
          המומלץ
        </span>
      )}

      <h3 className="text-[20px] font-extrabold">{tier.name}</h3>
      <p
        className="mt-1 text-[13px]"
        style={{ color: tier.emphasis ? 'var(--bg-2)' : 'var(--ink-3)' }}
      >
        {tier.tagline}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="tnum text-[36px] font-extrabold leading-none ltr">{display.big}</span>
        {display.small && (
          <span
            className="text-[12px]"
            style={{ color: tier.emphasis ? 'var(--bg-2)' : 'var(--ink-3)' }}
          >
            {display.small}
          </span>
        )}
      </div>

      <ul
        className="mt-6 space-y-2 border-t pt-4 text-[12px]"
        style={{
          borderColor: tier.emphasis ? 'rgba(255,255,255,0.15)' : 'var(--line)',
          color: tier.emphasis ? 'var(--bg-2)' : 'var(--ink-3)',
        }}
      >
        <li className="flex justify-between">
          <span>בניינים</span>
          <span className="font-extrabold" style={{ color: tier.emphasis ? 'var(--paper)' : 'var(--ink)' }}>
            {tier.buildings}
          </span>
        </li>
        <li className="flex justify-between">
          <span>דירות</span>
          <span className="font-extrabold" style={{ color: tier.emphasis ? 'var(--paper)' : 'var(--ink)' }}>
            {tier.apartments}
          </span>
        </li>
      </ul>

      <ul className="mt-5 flex-1 space-y-2.5 text-[14px]">
        {tier.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2"
            style={{ color: tier.emphasis ? 'var(--paper)' : 'var(--ink)' }}
          >
            <Check
              className="mt-1 h-3.5 w-3.5 shrink-0"
              style={{ color: 'var(--brass)' }}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={tier.href}
        className="btn mt-7 w-full"
        style={{
          background: tier.emphasis ? 'var(--brass)' : 'var(--ink)',
          color: tier.emphasis ? 'var(--ink)' : 'var(--paper)',
        }}
      >
        {tier.cta}
      </Link>
    </div>
  );
}

function RoiCalculator() {
  const [buildings, setBuildings] = useState(5);
  const [apartments, setApartments] = useState(120);
  const [currentRate, setCurrentRate] = useState(85);
  const [avgDue, setAvgDue] = useState(350);

  const calc = useMemo(() => {
    const monthlyBilling = apartments * avgDue;
    const recovered = (monthlyBilling * (Math.min(98, currentRate + 4) - currentRate)) / 100;
    let fee = 1290;
    if (buildings <= 1 && apartments <= 20) fee = 0;
    else if (buildings <= 3 && apartments <= 100) fee = 399;
    else if (buildings <= 15 && apartments <= 600) fee = 1290;
    else fee = 1290 + Math.ceil((apartments - 600) / 100) * 200;
    return { monthlyBilling, recovered, fee, net: recovered - fee };
  }, [buildings, apartments, currentRate, avgDue]);

  return (
    <div
      className="mt-16 overflow-hidden rounded-2xl border md:mt-20"
      style={{ borderColor: 'var(--line-2)' }}
    >
      <div className="grid md:grid-cols-5">
        <div
          className="border-b p-6 md:col-span-2 md:border-b-0 md:border-l md:p-8"
          style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}
        >
          <div className="eyebrow">מחשבון ROI</div>
          <h3 className="display-3 mt-3 max-w-[14ch]">
            כמה תרוויחו במעבר אלינו?
          </h3>
          <p className="mt-4 text-[14px] leading-[1.6] text-[var(--ink-3)]">
            ההערכה מבוססת על שיפור ממוצע של 4 נקודות אחוז באחוז הגבייה
            בששת החודשים הראשונים אצל לקוחותינו.
          </p>
        </div>

        <div className="p-6 md:col-span-3 md:p-8" style={{ background: 'var(--paper)' }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumField label="בניינים" value={buildings} setValue={setBuildings} min={1} max={500} />
            <NumField label="דירות" value={apartments} setValue={setApartments} min={1} max={5000} />
            <NumField label="גביה כיום" value={currentRate} setValue={setCurrentRate} min={50} max={99} suffix="%" />
            <NumField label="ועד ממוצע" value={avgDue} setValue={setAvgDue} min={100} max={2000} prefix="₪" />
          </div>

          <div
            className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border"
            style={{ borderColor: 'var(--line)', background: 'var(--line)' }}
          >
            <ResCell label="גבייה חודשית" value={`₪${calc.monthlyBilling.toLocaleString('he-IL')}`} />
            <ResCell
              label="צפי גביה נוספת"
              value={`+₪${Math.round(calc.recovered).toLocaleString('he-IL')}`}
              accent
            />
            <ResCell label="עלות מערכת" value={`₪${calc.fee.toLocaleString('he-IL')}`} />
          </div>

          <div
            className="mt-3 rounded-lg p-5"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <div
              className="text-[10px] font-bold tracking-wider uppercase"
              style={{ color: 'var(--brass-3)' }}
            >
              NET MONTHLY GAIN
            </div>
            <div className="tnum mt-1 text-[32px] font-extrabold ltr">
              {calc.net >= 0 ? '+' : ''}₪{Math.round(calc.net).toLocaleString('he-IL')}
            </div>
            <div className="mt-1.5 text-[12px]" style={{ color: 'var(--bg-2)' }}>
              ROI שנתי משוער ≈{' '}
              {Math.round((calc.net * 12) / Math.max(calc.fee * 12, 1) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  setValue,
  min,
  max,
  suffix,
  prefix,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wider text-[var(--ink-3)] uppercase">
        {label}
      </span>
      <div
        className="mt-1 flex items-baseline justify-between border-b py-1.5"
        style={{ borderColor: 'var(--ink)', direction: 'ltr' }}
      >
        {prefix && <span className="text-[18px] text-[var(--ink-3)]">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) =>
            setValue(Math.max(min, Math.min(max, Number(e.target.value) || min)))
          }
          className="tnum w-full bg-transparent text-[24px] font-extrabold outline-none"
          style={{ textAlign: 'right' }}
        />
        {suffix && <span className="text-[16px] text-[var(--ink-3)]">{suffix}</span>}
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-3 w-full"
        style={{ accentColor: 'var(--ink)' }}
      />
    </label>
  );
}

function ResCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="p-3" style={{ background: 'var(--paper)' }}>
      <div className="text-[10px] font-bold tracking-wider text-[var(--ink-3)] uppercase">{label}</div>
      <div
        className="tnum mt-0.5 text-[17px] font-extrabold ltr"
        style={{ color: accent ? 'var(--brass)' : 'var(--ink)' }}
      >
        {value}
      </div>
    </div>
  );
}
