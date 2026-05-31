import type { Metadata } from 'next';
import './v2.css';

export const metadata: Metadata = {
  title: 'ניהול מבנים — סקיצת עיצוב',
  description: 'גרסת עיצוב חדשה לסקירה. עוד לא ב-production.',
  robots: { index: false, follow: false },
};

/**
 * Standalone visual scope for the v2 redesign sketch.
 *
 * The root layout sets <html lang="he" dir="rtl"> and loads the regular
 * Heebo + Inter fonts; we layer Frank Ruhl Libre (serif, for editorial
 * headlines) and IBM Plex Sans (technical numerals) on top, scoped to
 * the .v2-scope wrapper so nothing leaks into the live site.
 */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
      />
      <div className="v2-scope min-h-screen">{children}</div>
    </>
  );
}
