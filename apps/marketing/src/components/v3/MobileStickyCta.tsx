'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Sticky bottom CTA bar — mobile only. Per research, Mercury/Cal/Stripe
 * all use this pattern. Shows after the user scrolls past the hero.
 */
export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past ~one hero (roughly 500px on mobile)
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        background: 'var(--paper)',
        borderColor: 'var(--line-strong)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href="#cta"
          className="btn-brass flex-1 justify-center"
          style={{ minHeight: 44, padding: '12px 18px', fontSize: 15 }}
        >
          תאמו הדגמה
        </Link>
        <Link
          href="tel:+97231234567"
          className="btn-ghost"
          style={{ minHeight: 44, padding: '12px 18px', fontSize: 14 }}
        >
          חייגו
        </Link>
      </div>
    </div>
  );
}
