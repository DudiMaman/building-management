'use client';
import { useEffect, useRef } from 'react';

/**
 * Scroll-reveal wrapper. Adds the `in` class once the element enters the
 * viewport; v5.css handles the transition (and disables it entirely under
 * prefers-reduced-motion). One-shot — no re-hiding on scroll-up.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ['--reveal-delay' as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}
