'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

type Cycle = 'monthly' | 'annual';

interface Tier {
  name: string;
  badge?: string;
  monthly: number | 'free' | 'custom';
  description: string;
  cta: string;
  href: string;
  popular?: boolean;
  features: string[];
  limits: { buildings: string; apartments: string };
}

const tiers: Tier[] = [
  {
    name: 'Trial',
    monthly: 'free',
    description: 'ניסיון חינם של 30 יום',
    cta: 'התחילו עכשיו',
    href: '/signup?plan=trial',
    features: ['כל הפיצ׳רים זמינים', 'בניין יחיד', 'עד 20 דירות', 'ללא כרטיס אשראי'],
    limits: { buildings: 'בניין אחד', apartments: 'עד 20' },
  },
  {
    name: 'Starter',
    monthly: 399,
    description: 'לחברות ניהול קטנות',
    cta: 'בחרו ב-Starter',
    href: '/signup?plan=starter',
    features: [
      'גבייה אוטומטית',
      'פניות שירות + ניהול משימות',
      'חשבוניות תואמות רשות המסים',
      'WhatsApp תמיכה',
      'תמיכה במייל',
    ],
    limits: { buildings: 'עד 3', apartments: 'עד 100' },
  },
  {
    name: 'Pro',
    badge: 'הפופולרי ביותר',
    monthly: 1290,
    description: 'הבחירה של רוב חברות הניהול',
    cta: 'בחרו ב-Pro',
    popular: true,
    href: '/signup?plan=pro',
    features: [
      'כל מה ב-Starter',
      'בוט AI ב-WhatsApp',
      'ייצוא לחשבשבת / ריווחית / פריוריטי',
      'דוחות מתקדמים',
      'תמיכה בטלפון',
      'אפליקציית דסקטופ',
    ],
    limits: { buildings: 'עד 15', apartments: 'עד 600' },
  },
  {
    name: 'Enterprise',
    monthly: 'custom',
    description: 'לחברות גדולות',
    cta: 'צרו קשר',
    href: '/contact',
    features: [
      'כל מה ב-Pro',
      'SLA חוזי',
      'SSO + ניהול הרשאות מתקדם',
      'מנהל לקוח ייעודי',
      'אינטגרציות מותאמות',
      'On-prem אופציונלי',
    ],
    limits: { buildings: 'ללא הגבלה', apartments: 'ללא הגבלה' },
  },
];

const ANNUAL_DISCOUNT = 0.15;

function formatPrice(price: number) {
  return `₪${price.toLocaleString('he-IL')}`;
}

export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>('monthly');

  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold">מחירים שקופים</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          ללא דמי הקמה, ללא התחייבות. שדרגו או בטלו בכל עת.
        </p>

        {/* Cycle toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
            <button
              onClick={() => setCycle('monthly')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                cycle === 'monthly' ? 'bg-primary text-white' : 'text-slate-700 hover:text-primary-700'
              }`}
            >
              חיוב חודשי
            </button>
            <button
              onClick={() => setCycle('annual')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                cycle === 'annual' ? 'bg-primary text-white' : 'text-slate-700 hover:text-primary-700'
              }`}
            >
              חיוב שנתי
              <span className="ms-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                חיסכון 15%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <PriceCard key={tier.name} tier={tier} cycle={cycle} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          המחירים אינם כוללים מע"מ. עמלת סליקה: 0.9% + ₪1.20 לעסקה (Tranzila).
        </p>

        <RoiCalculator />
      </div>
    </section>
  );
}

function PriceCard({ tier, cycle }: { tier: Tier; cycle: Cycle }) {
  const display = (() => {
    if (tier.monthly === 'free') return { headline: 'חינם', subline: '30 יום' };
    if (tier.monthly === 'custom') return { headline: 'נדבר', subline: '' };
    const monthly = tier.monthly;
    if (cycle === 'monthly') return { headline: formatPrice(monthly), subline: 'לחודש' };
    const annualized = Math.round(monthly * (1 - ANNUAL_DISCOUNT));
    return { headline: formatPrice(annualized), subline: 'לחודש, בחיוב שנתי' };
  })();

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        tier.popular
          ? 'border-primary-500 bg-gradient-to-b from-primary-50 to-white shadow-xl shadow-primary-100'
          : 'border-slate-200 bg-white'
      }`}
    >
      {tier.badge && (
        <span className="absolute -top-3 right-1/2 inline-flex translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
          <Sparkles className="h-3 w-3" />
          {tier.badge}
        </span>
      )}
      <h3 className="text-lg font-semibold">{tier.name}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold">{display.headline}</span>
        {display.subline && <span className="text-sm text-slate-500">{display.subline}</span>}
      </div>
      <p className="mt-2 text-sm text-slate-600">{tier.description}</p>

      <ul className="mt-5 space-y-2 text-xs text-slate-700">
        <li className="flex justify-between border-b border-slate-100 pb-2">
          <span>בניינים</span>
          <span className="font-semibold">{tier.limits.buildings}</span>
        </li>
        <li className="flex justify-between">
          <span>דירות</span>
          <span className="font-semibold">{tier.limits.apartments}</span>
        </li>
      </ul>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={tier.href}
        className={`mt-6 inline-block w-full rounded-lg py-3 text-center text-sm font-medium ${
          tier.popular
            ? 'bg-primary text-white hover:bg-primary-700'
            : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
        }`}
      >
        {tier.cta}
      </Link>
    </div>
  );
}

/**
 * Simple ROI calculator per SPEC §6.3.
 * Inputs:  # buildings, # apartments, current collection rate %
 * Outputs: monthly platform fee, recovered uncollected rev assuming our +4pp
 *          improvement, net monthly gain.
 */
function RoiCalculator() {
  const [buildings, setBuildings] = useState(5);
  const [apartments, setApartments] = useState(120);
  const [currentRate, setCurrentRate] = useState(85);
  const [avgDue, setAvgDue] = useState(350);

  const calc = useMemo(() => {
    const monthlyBilling = apartments * avgDue;
    const uncollected = monthlyBilling * (1 - currentRate / 100);
    const targetRate = Math.min(98, currentRate + 4);
    const recovered = monthlyBilling * ((targetRate - currentRate) / 100);

    let platformFee = 1290; // Pro default
    if (buildings <= 1 && apartments <= 20) platformFee = 0;
    else if (buildings <= 3 && apartments <= 100) platformFee = 399;
    else if (buildings <= 15 && apartments <= 600) platformFee = 1290;
    else platformFee = 1290 + Math.ceil((apartments - 600) / 100) * 200;

    const net = recovered - platformFee;
    return {
      monthlyBilling,
      uncollected,
      recovered,
      platformFee,
      targetRate,
      net,
      breakeven: net > 0,
    };
  }, [buildings, apartments, currentRate, avgDue]);

  return (
    <div className="mt-16 rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-8 md:p-12">
      <div className="grid gap-8 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold">חישוב החזר השקעה (ROI)</h3>
          <p className="mt-3 text-slate-600">
            הכניסו את הנתונים שלכם וראו כמה תוכלו לחסוך / לגבות בחודש עם
            הפלטפורמה. ההערכה מבוססת על שיפור ממוצע של 4 נקודות אחוז באחוז
            הגבייה.
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="מספר בניינים" value={buildings} onChange={setBuildings} min={1} max={500} />
            <Field label="סך דירות" value={apartments} onChange={setApartments} min={1} max={5000} />
            <Field label="אחוז גבייה כיום (%)" value={currentRate} onChange={setCurrentRate} min={50} max={99} />
            <Field label="ועד ממוצע לדירה (₪)" value={avgDue} onChange={setAvgDue} min={100} max={2000} />
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-3">
            <Stat label="גביה חודשית פוטנציאלית" value={`₪${calc.monthlyBilling.toLocaleString('he-IL')}`} />
            <Stat
              label="צפי גביה נוסף"
              value={`+₪${Math.round(calc.recovered).toLocaleString('he-IL')}`}
              tone="green"
            />
            <Stat
              label="עלות חודשית"
              value={`₪${calc.platformFee.toLocaleString('he-IL')}`}
              tone="slate"
            />
          </div>
          <div className="mt-3 rounded-2xl bg-primary text-white p-5">
            <div className="text-sm opacity-90">רווח חודשי נטו משוער</div>
            <div className="mt-1 text-3xl font-bold">
              {calc.net >= 0 ? '+' : ''}₪{Math.round(calc.net).toLocaleString('he-IL')}
            </div>
            <div className="mt-1 text-xs opacity-90">
              ({calc.breakeven ? 'מעבר לנקודת איזון' : 'מתחת לנקודת איזון'} —
              ROI שנתי משוער {Math.round((calc.net * 12 / Math.max(calc.platformFee * 12, 1)) * 100)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <div className="mt-1 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
          className="w-full bg-transparent text-right text-lg font-semibold outline-none"
        />
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-primary"
      />
    </label>
  );
}

function Stat({
  label,
  value,
  tone = 'primary',
}: {
  label: string;
  value: string;
  tone?: 'primary' | 'green' | 'slate';
}) {
  const tones: Record<string, string> = {
    primary: 'text-primary-700',
    green: 'text-emerald-700',
    slate: 'text-slate-700',
  };
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 text-xl font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
