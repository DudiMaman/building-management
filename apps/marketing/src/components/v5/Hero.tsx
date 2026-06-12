import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LivingTower } from './LivingTower';
import { Reveal } from './Reveal';

/**
 * v5 hero — one idea, one CTA. Copy on the right (RTL start), the live
 * tower on the left. Pruned to its essentials: H1 + lead + single
 * primary CTA. No category pill, no secondary "trial" button, no
 * legal microcopy under the buttons.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container pb-2 pt-10 md:pb-2 md:pt-12 lg:pb-2 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className="hero-h1">
                כל מה שקורה בבניין.
                <br />
                <span style={{ color: 'var(--brass)' }}>במסך אחד, בזמן אמת.</span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="lead mt-6 max-w-[44ch]">
                גבייה אוטומטית, פניות שירות, מסמכים ותקשורת — מסונכרנים סביב
                כל בניין בתיק שלכם. לחברת הניהול, לוועד, לבעלים ולדיירים.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-9">
                <Link href="#cta" className="btn btn-ink">
                  תאמו הדגמה — 25 דק׳
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
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
