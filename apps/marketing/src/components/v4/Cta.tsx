import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function Cta() {
  return (
    <section
      id="cta"
      className="section relative overflow-hidden"
      style={{ background: 'var(--ink)', color: 'var(--paper)' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, var(--brass) 0, transparent 50%), radial-gradient(circle at 80% 70%, var(--brass) 0, transparent 50%)',
        }}
      />

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase"
              style={{
                background: 'rgba(161, 98, 7, 0.18)',
                color: 'var(--brass-3)',
                border: '1px solid rgba(161, 98, 7, 0.3)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--brass-3)' }} />
              הדגמה אישית · 25 דק׳
            </div>

            <h2 className="display-1 mt-6 max-w-[16ch]" style={{ color: 'var(--paper)' }}>
              נראה לכם את המערכת על
              <br />
              <span style={{ color: 'var(--brass-3)' }}>הבניינים שלכם.</span>
            </h2>

            <p className="lead mt-6 max-w-md" style={{ color: 'var(--bg-2)' }}>
              שיחה קצרה של 25 דקות. אנחנו לוקחים את הרשימה שלכם, מטעינים
              דירות אמיתיות, ומראים איך הגבייה והפניות יעבדו אצלכם —
              לא דמו גנרי.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                'ללא התחייבות',
                'נחזור תוך 24 שעות',
                'דמו על הדאטה שלכם',
                'מחיר חודש ראשון: ₪0',
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: 'var(--bg-2)' }}
                >
                  <span
                    className="grid h-4 w-4 shrink-0 place-items-center rounded-full"
                    style={{ background: 'var(--brass)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l5 5L20 7"
                        stroke="var(--ink)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div
              className="rounded-2xl border p-6 md:p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <form className="space-y-3">
                <Field placeholder="שם מלא" type="text" />
                <Field placeholder="חברת ניהול / בניין" type="text" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field placeholder="050-0000000" type="tel" ltr />
                  <Field placeholder="email@company.co.il" type="email" ltr />
                </div>
                <label className="block">
                  <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: 'var(--bg-3)' }}>
                    כמה בניינים בניהולכם?
                  </span>
                  <select
                    className="mt-1.5 w-full rounded-md border bg-transparent px-4 py-3 text-[15px] outline-none focus:border-[var(--brass)]"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.18)',
                      color: 'var(--paper)',
                    }}
                  >
                    <option style={{ background: 'var(--ink)' }}>1-3 בניינים</option>
                    <option style={{ background: 'var(--ink)' }}>4-10 בניינים</option>
                    <option style={{ background: 'var(--ink)' }}>11-30 בניינים</option>
                    <option style={{ background: 'var(--ink)' }}>30+ בניינים</option>
                  </select>
                </label>

                <button
                  type="submit"
                  className="btn btn-brass mt-2 w-full"
                  style={{ minHeight: 52, fontSize: 16 }}
                >
                  תאמו הדגמה
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <p className="pt-1 text-center text-[12px]" style={{ color: 'var(--bg-3)' }}>
                  או{' '}
                  <Link
                    href="/signup"
                    className="underline-offset-2 hover:underline"
                    style={{ color: 'var(--brass-3)' }}
                  >
                    התחילו ניסיון של 30 יום בעצמכם ←
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Brand-as-verb closer */}
        <div className="mt-20 border-t pt-12 md:mt-28" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p
            className="text-center font-extrabold leading-tight tracking-tight"
            style={{
              color: 'var(--brass-3)',
              fontSize: 'clamp(28px, 5vw, 56px)',
            }}
          >
            ניהול הנדל"ן זה אצלנו.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  placeholder,
  type,
  ltr,
}: {
  placeholder: string;
  type: string;
  ltr?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      dir={ltr ? 'ltr' : undefined}
      className={`w-full rounded-md border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--brass)] ${ltr ? 'ltr' : ''}`}
      style={{
        borderColor: 'rgba(255, 255, 255, 0.18)',
        color: 'var(--paper)',
      }}
    />
  );
}
