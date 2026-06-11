'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Dark numbers band with count-up on first view. Numbers animate once
 * (requestAnimationFrame, ease-out), render instantly under
 * prefers-reduced-motion.
 */

const STATS = [
  { value: 130, suffix: '+', label: 'חברות ניהול עובדות איתנו' },
  { value: 8400, suffix: '', label: 'דירות מנוהלות במערכת' },
  { value: 94, suffix: '%', label: 'גבייה ממוצעת אחרי חצי שנה' },
  { value: 12, prefix: '₪', suffix: 'M', label: 'נגבים דרך המערכת בחודש' },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div className="container" ref={ref}>
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow" style={{ color: 'var(--brass-3)' }}>
              במספרים
            </div>
            <h2 className="display-2 mt-3" style={{ color: 'var(--paper)' }}>
              שקט תפעולי. מדיד.
            </h2>
          </div>
          <p className="text-[14px] leading-[1.7] md:col-span-5" style={{ color: 'var(--bg-3)' }}>
            הנתונים מצטברים מחברות הניהול הפעילות במערכת, נכון לרבעון
            האחרון. אחוז הגבייה נמדד אחרי שישה חודשי שימוש.
          </p>
        </div>

        <div
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:mt-16 lg:grid-cols-4"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="p-6 md:p-8" style={{ background: 'var(--ink)' }}>
              <div className="tnum ltr text-[clamp(34px,4.5vw,56px)] font-extrabold leading-none" style={{ color: 'var(--brass-3)' }}>
                {s.prefix ?? ''}
                <CountUp target={s.value} started={started} />
                {s.suffix}
              </div>
              <div className="mt-3 text-[13px] leading-snug" style={{ color: 'var(--bg-3)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ target, started }: { target: number; started: boolean }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }
    const dur = 1400;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);

  return <>{val.toLocaleString('he-IL')}</>;
}
