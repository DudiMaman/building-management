import type { Metadata } from 'next';
import './v4.css';

export const metadata: Metadata = {
  title: 'ניהול מבנים — v4',
  description:
    'מערכת תפעול אחת לחברת הניהול, לוועד, לבעלים ולשוכרים. גבייה, אחזקה ותקשורת במקום אחד.',
  robots: { index: false, follow: false },
};

/**
 * v4 — informed by the ui-ux-pro-max skill's "Enterprise Gateway"
 * pattern + 5-agent deep research findings. Mobile-first, Heebo-only,
 * WCAG-compliant brass accent on warm cream + near-black ink.
 */
export default function V4Layout({ children }: { children: React.ReactNode }) {
  return <div className="v4">{children}</div>;
}
