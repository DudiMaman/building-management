import type { Metadata } from 'next';
import './v3.css';

export const metadata: Metadata = {
  title: 'ניהול נדל"ן זה אצלנו — סקיצת עיצוב v3',
  description:
    'מערכת תפעול אחת לחברת הניהול, ועד הבית, הבעלים והשוכרים. גבייה אוטומטית, אחזקה ותקשורת — במקום אחד.',
  robots: { index: false, follow: false },
};

/**
 * v3 — research-backed redesign.
 * Mobile-first. Heebo only (no serif marketing copy per Hebrew RTL research).
 * Warm cream + deep navy + single brass accent — TLV "quiet luxury".
 */
export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <div className="v3">{children}</div>;
}
