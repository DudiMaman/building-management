import type { Metadata } from 'next';
import './v5.css';

export const metadata: Metadata = {
  title: 'ניהול מבנים — v5',
  description:
    'כל מה שקורה בבניין — במסך אחד, בזמן אמת. גבייה, אחזקה, מסמכים ותקשורת לחברות ניהול וועדי בית.',
  robots: { index: false, follow: false },
};

/**
 * v5 — "The Living Building". One hero idea (v2's building drawing,
 * rebuilt), scroll-driven product story, and the v3/v4 token system
 * pruned to its calmest form.
 */
export default function V5Layout({ children }: { children: React.ReactNode }) {
  return <div className="v5">{children}</div>;
}
