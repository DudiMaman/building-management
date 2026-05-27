'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 8400, label: 'דירות מנוהלות' },
  { value: 24, label: 'חברות ניהול בפלטפורמה' },
  { value: 12, suffix: 'M ₪', label: 'נגבו אוטומטית השנה' },
  { value: 94, suffix: '%', label: 'אחוז גבייה ממוצע' },
];

export function StatsBar() {
  return (
    <section className="border-y border-slate-200 bg-white px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatItem key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1100;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(stat.value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-primary-700 md:text-5xl">
        {stat.prefix}
        {n.toLocaleString('he-IL')}
        {stat.suffix}
      </div>
      <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
    </div>
  );
}
