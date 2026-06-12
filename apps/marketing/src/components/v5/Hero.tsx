import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LivingTower } from './LivingTower';
import { Reveal } from './Reveal';

/**
 * v5 hero — one idea, one CTA pair. Copy on the right (RTL start),
 * the Living Tower photo on the left. No persona tabs, no rotating
 * mockups: the live building IS the pitch.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container pb-14 pt-10 md:pb-20 md:pt-12 lg:pb-24 lg:pt-14">
        {/* lg:items-start so the right text column rises to the row top
            instead of getting vertically centered against the tall tower
            (the wasted whitespace the user flagged). The tower keeps its
            current geometry — only the text moves up. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
                style={{ borderColor: 'var(--line-2)', background: 'var(--paper)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--brass)' }} />
                <span className="text-[12px] font-semibold text-[var(--ink-2)]">
                  מערכת התפעול לנדל"ן מנוהל · ישראל 2026
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="hero-h1 mt-6">
                כל מה שקורה בבניין.
                <br />
                <span style={{ color: 'var(--brass)' }}>במסך אחד, בזמן אמת.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="lead mt-6 max-w-[44ch]">
                גבייה אוטומטית, פניות שירות, מסמכים ותקשורת — מסונכרנים סביב
                כל בניין בתיק שלכם. לחברת הניהול, לוועד, לבעלים ולדיירים.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="#cta" className="btn btn-ink">
                  תאמו הדגמה — 25 דק׳
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link href="/signup" className="btn btn-ghost">
                  ניסיון חינם 30 יום
                </Link>
              </div>
              <p className="mt-4 text-[13px] text-[var(--ink-3)]">
                ללא התחייבות · ללא כרטיס אשראי · הקמה ב-10 דקות
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={200}>
              {/* Frameless bleed: edge-to-edge on mobile, oversized toward
                  the viewport edge on desktop (hero section clips overflow).
                  Photo attribution lives in the site footer to keep the
                  hero clean while honoring the CC BY-SA license. */}
              <div className="-mx-8 sm:mx-0 lg:-me-[28%] lg:-mt-10 lg:w-[134%]">
                <LivingTower />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
