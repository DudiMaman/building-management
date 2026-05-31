import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductMockup } from './ProductMockup';

export function Hero() {
  return (
    <section className="paper-texture relative overflow-hidden">
      <div className="container pt-10 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Right column (in RTL = visual start): editorial copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-[var(--paper)] px-3 py-1.5"
                 style={{ borderColor: 'var(--line)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brass)]" />
              <span className="text-[12px] font-semibold text-[var(--ink-2)]">
                מערכת תפעול 2026 · נבנתה בישראל
              </span>
            </div>

            <h1 className="display-1 mt-6 max-w-[17ch]">
              ניהול הנדל"ן שלכם.
              <br />
              <span style={{ color: 'var(--brass)' }}>הכל במקום אחד.</span>
            </h1>

            <p className="lead mt-5 max-w-[42ch]">
              מערכת תפעול אחת לחברת הניהול, לוועד, לבעלים ולשוכרים — גבייה, אחזקה ותקשורת.
              בנויה לעולם הנדל"ן הישראלי, מאסיפת ועד ועד חשבונית מס.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="#cta" className="btn-primary justify-center sm:justify-start">
                לקבלת הדגמה אישית
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="/signup" className="btn-ghost justify-center sm:justify-start">
                ניסיון חינם 30 יום
              </Link>
            </div>

            {/* Sub-CTA microcopy — lifted from research */}
            <p className="mt-4 text-[13px] text-[var(--ink-3)]">
              ללא התחייבות · 5 דקות התקנה · ללא כרטיס אשראי בניסיון
            </p>

            {/* Inline credibility row */}
            <div
              className="mt-10 grid grid-cols-3 gap-4 border-t pt-6 md:gap-8"
              style={{ borderColor: 'var(--line)' }}
            >
              <Stat value="130+" label="חברות ניהול" />
              <Stat value="8,400" label="דירות בניהול" />
              <Stat value="94%" label="גבייה ממוצעת" />
            </div>
          </div>

          {/* Left column: real product mockup */}
          <div className="lg:col-span-5 lg:pt-10">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="tnum text-2xl font-extrabold leading-none text-[var(--ink)] md:text-3xl ltr">
        {value}
      </div>
      <div className="mt-1.5 text-[12px] text-[var(--ink-3)] md:text-[13px]">{label}</div>
    </div>
  );
}
