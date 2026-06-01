'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        background: 'rgba(250, 249, 246, 0.92)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        borderColor: 'var(--line-2)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href="#cta"
          className="btn btn-brass flex-1"
          style={{ minHeight: 48, fontSize: 15 }}
        >
          תאמו הדגמה
        </Link>
        <Link
          href="tel:+97231234567"
          aria-label="חייגו אלינו"
          className="btn btn-ghost shrink-0"
          style={{ minHeight: 48, padding: '12px 16px' }}
        >
          <Phone className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
