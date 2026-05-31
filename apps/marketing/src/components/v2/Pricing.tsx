'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

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
    tagline: 'ניסיון 30 יום — ללא כרטיס אשראי.',
    monthly: 'free',
    features: ['כל הפיצ׳רים זמינים', 'תמיכה במייל', 'ייבוא נתונים בעצמכם'],
    buildings: 'בניין אחד',
    apartments: 'עד 20',
    cta: 'התחלת ניסיון',
    href: '/signup?plan=trial',
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
    cta: 'התחלת ניסיון',
    href: '/signup?plan=starter',
  },
  {
    name: 'Pro',
    tagline: 'הבחירה של רוב חברות הניהול.',
    monthly: 1290,
    features: [
      'הכל ב-Starter, ובנוסף:',
      'בוט AI ב-WhatsApp',
      'ייצוא לחשבשבת / ריווחית / פריוריטי',
      'דוחות מתקדמים + אפליקציית דסקטופ',
      'תמיכה בטלפון',
    ],
    buildings: 'עד 15',
    apartments: 'עד 600',
    cta: 'התחלת ניסיון',
    href: '/signup?plan=pro',
    emphasis: true,
  },
  {
    name: 'Enterprise',
    tagline: 'לחברות עם 50+ בניינים.',
    monthly: 'custom',
    features: [
      'הכל ב-Pro, ובנוסף:',
      'SLA חוזי + מנהל לקוח ייעודי',
      'SSO + ניהול הרשאות מתקדם',
      'אינטגרציות מותאמות',
    ],
    buildings: 'ללא הגבלה',
    apartments: 'ללא הגבלה',
    cta: 'דברו איתנו',
    href: '/contact',
  },
];

const ANNUAL_DISCOUNT = 0.15;

export function PricingV2() {
  const [cycle, setCycle] = useState<Cycle>('monthly');

  return (
    <section id="pricing" className="border-b border-[var(--ink-line)] bg-[var(--paper-2)]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="label text-[var(--brass)]">PRICING</span>
            <h2 className="serif mt-3 text-4xl leading-tight md:text-5xl">
              שקיפות מלאה.{' '}
              <span className="italic text-[var(--ink-soft)]">בלי מנגנון.</span>
            </h2>
            <p className="mt-4 max-w-md text-base text-[var(--ink-soft)]">
              ללא דמי הקמה. ללא התחייבות שנתית. החיוב מתבצע בכרטיס אשראי
              בתחילת כל חודש. ביטול בכל עת.
            </p>
          </div>

          <div className="inline-flex border border-[var(--ink)] bg-[var(--paper)]">
            <button
              onClick={() => setCycle('monthly')}
              className={`px-5 py-2 text-sm transition ${
                cycle === 'monthly'
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'text-[var(--ink-soft)]'
              }`}
            >
              חודשי
            </button>
            <button
              onClick={() => setCycle('annual')}
              className={`px-5 py-2 text-sm transition ${
                cycle === 'annual'
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'text-[var(--ink-soft)]'
              }`}
            >
              שנתי
              <span className="ms-1 text-[10px] tracking-wider text-[var(--brass)]">−15%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-px border border-[var(--ink)] bg-[var(--ink)] md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <PriceCard key={t.name} tier={t} cycle={cycle} />
          ))}
        </div>

        <p className="mt-6 text-xs text-[var(--ink-soft)]">
          המחירים אינם כוללים מע&quot;מ. עמלת סליקה (Tranzila): 0.9% + ₪1.20
          לעסקה. תשלום במס&quot;ב או צ&apos;ק — חינם.
        </p>

        <RoiCalculator />
      </div>
    </section>
  );
}

function PriceCard({ tier, cycle }: { tier: Tier; cycle: Cycle }) {
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
      className={`relative flex flex-col p-7 lg:p-8 ${
        tier.emphasis ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-[var(--paper)]'
      }`}
    >
      {tier.emphasis && (
        <span className="absolute -top-3 right-7 bg-[var(--brass)] px-3 py-1 text-[10px] tracking-wider text-[var(--ink)]">
          הפופולרי ביותר
        </span>
      )}

      <h3 className="serif text-2xl">{tier.name}</h3>
      <p className={`mt-1 text-sm ${tier.emphasis ? 'text-[var(--paper-2)]' : 'text-[var(--ink-soft)]'}`}>
        {tier.tagline}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="serif tnum text-5xl leading-none">{display.big}</span>
        {display.small && (
          <span className={`text-sm ${tier.emphasis ? 'text-[var(--paper-2)]' : 'text-[var(--ink-soft)]'}`}>
            {display.small}
          </span>
        )}
      </div>

      <ul
        className={`mt-6 space-y-2 border-t pt-4 text-xs ${
          tier.emphasis ? 'border-[var(--ink-soft)] text-[var(--paper-2)]' : 'border-[var(--ink-line)] text-[var(--ink-soft)]'
        }`}
      >
        <li className="flex justify-between">
          <span>בניינים</span>
          <span className="font-semibold">{tier.buildings}</span>
        </li>
        <li className="flex justify-between">
          <span>דירות</span>
          <span className="font-semibold">{tier.apartments}</span>
        </li>
      </ul>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {tier.features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-2 ${tier.emphasis ? 'text-[var(--paper)]' : 'text-[var(--ink)]'}`}
          >
            <span className={`mt-2 inline-block h-1 w-1 ${tier.emphasis ? 'bg-[var(--brass)]' : 'bg-[var(--ink)]'}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={tier.href}
        className={`mt-8 inline-flex items-center justify-center px-5 py-3 text-sm font-medium transition ${
          tier.emphasis
            ? 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)]'
            : 'border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]'
        }`}
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
    const recovered = monthlyBilling * (Math.min(98, currentRate + 4) - currentRate) / 100;
    let fee = 1290;
    if (buildings <= 1 && apartments <= 20) fee = 0;
    else if (buildings <= 3 && apartments <= 100) fee = 399;
    else if (buildings <= 15 && apartments <= 600) fee = 1290;
    else fee = 1290 + Math.ceil((apartments - 600) / 100) * 200;
    return { monthlyBilling, recovered, fee, net: recovered - fee };
  }, [buildings, apartments, currentRate, avgDue]);

  return (
    <div className="mt-20 border border-[var(--ink)] bg-[var(--paper)]">
      <div className="grid gap-px bg-[var(--ink)] lg:grid-cols-5">
        <div className="bg-[var(--paper)] p-8 lg:col-span-2">
          <span className="label text-[var(--brass)]">ROI · CALCULATOR</span>
          <h3 className="serif mt-3 text-3xl leading-tight">
            חישבו את החזר ההשקעה.
          </h3>
          <p className="mt-4 text-sm text-[var(--ink-soft)]">
            ההערכה מבוססת על שיפור ממוצע של 4 נקודות אחוז באחוז הגבייה
            בששת החודשים הראשונים אצל לקוחותינו. החישוב כולל את עלות
            המנוי, לא כולל עמלות סליקה.
          </p>
        </div>

        <div className="bg-[var(--paper)] p-8 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumField label="בניינים" value={buildings} setValue={setBuildings} min={1} max={500} />
            <NumField label="דירות" value={apartments} setValue={setApartments} min={1} max={5000} />
            <NumField label="אחוז גביה כיום" value={currentRate} setValue={setCurrentRate} min={50} max={99} suffix="%" />
            <NumField label="ועד ממוצע (₪)" value={avgDue} setValue={setAvgDue} min={100} max={2000} />
          </div>

          <div className="mt-8 grid gap-px border border-[var(--ink-line)] bg-[var(--ink-line)] sm:grid-cols-3">
            <ResultCell label="גביה חודשית" value={`₪${calc.monthlyBilling.toLocaleString('he-IL')}`} />
            <ResultCell label="צפי גביה נוספת" value={`+₪${Math.round(calc.recovered).toLocaleString('he-IL')}`} accent />
            <ResultCell label="עלות המערכת" value={`₪${calc.fee.toLocaleString('he-IL')}`} />
          </div>

          <div className="mt-px bg-[var(--ink)] p-6 text-[var(--paper)]">
            <div className="label text-[var(--brass-soft)]">NET MONTHLY GAIN</div>
            <div className="serif tnum mt-1 text-4xl">
              {calc.net >= 0 ? '+' : ''}₪{Math.round(calc.net).toLocaleString('he-IL')}
            </div>
            <div className="mt-2 text-xs text-[var(--paper-2)]">
              ROI שנתי משוער ≈ {Math.round((calc.net * 12) / Math.max(calc.fee * 12, 1) * 100)}%
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
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="label text-[var(--ink-soft)]">{label}</span>
      <div className="mt-1 flex items-baseline justify-between border-b border-[var(--ink)] pb-1.5">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) =>
            setValue(Math.max(min, Math.min(max, Number(e.target.value) || min)))
          }
          className="w-full bg-transparent text-right serif tnum text-2xl outline-none"
        />
        {suffix && <span className="text-sm text-[var(--ink-soft)]">{suffix}</span>}
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--ink)]"
      />
    </label>
  );
}

function ResultCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-[var(--paper)] p-4">
      <div className="label text-[var(--ink-soft)]">{label}</div>
      <div className={`serif tnum mt-1 text-xl ${accent ? 'text-[var(--moss)]' : 'text-[var(--ink)]'}`}>
        {value}
      </div>
    </div>
  );
}
