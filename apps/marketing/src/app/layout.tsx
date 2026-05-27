import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ניהול מבנים - פלטפורמת CRM מודרנית לחברות ניהול',
  description: 'פלטפורמה אחת לחברת הניהול, לדיירים, לבעלי דירות ולאנשי האחזקה. גבייה אוטומטית, פניות שירות, וואטסאפ, בוט AI ועוד.',
  openGraph: {
    title: 'ניהול מבנים',
    description: 'פלטפורמה אחת לכל ניהול הבניין',
    locale: 'he_IL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
