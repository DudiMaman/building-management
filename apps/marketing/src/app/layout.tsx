import './globals.css';
import type { Metadata, Viewport } from 'next';
import { CookieBanner } from '@/components/cookie-banner';

const BASE = process.env.NEXT_PUBLIC_MARKETING_DOMAIN ?? 'https://building-management.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'ניהול מבנים — פלטפורמת CRM מודרנית לחברות ניהול בישראל',
    template: '%s | ניהול מבנים',
  },
  description:
    'פלטפורמה אחת לחברת הניהול, לדיירים, לבעלי דירות ולאנשי האחזקה. גבייה אוטומטית, פניות שירות, וואטסאפ, בוט AI, פתיחת שערי חניה, חשבוניות תואמות רשות המסים.',
  keywords: [
    'ניהול מבנים',
    'ניהול ועד בית',
    'גבייה אוטומטית',
    'CRM ניהול נכסים',
    'אפליקציה לדיירים',
    'חשבוניות רשות המסים',
    'WhatsApp בוט',
    'AI לחברות ניהול',
  ],
  authors: [{ name: 'Building Management' }],
  creator: 'Building Management',
  publisher: 'Building Management',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    alternateLocale: ['en_US'],
    siteName: 'ניהול מבנים',
    title: 'ניהול מבנים — פלטפורמת CRM מודרנית',
    description:
      'פלטפורמה אחת לחברת הניהול, לדיירים, לבעלי דירות ולאנשי האחזקה.',
    url: BASE,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'ניהול מבנים' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ניהול מבנים',
    description: 'פלטפורמה אחת לכל ניהול הבניין.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: BASE,
    languages: {
      'he-IL': BASE,
      'en-US': `${BASE}/en`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}#org`,
      name: 'ניהול מבנים',
      url: BASE,
      logo: `${BASE}/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+972-3-1234567',
        contactType: 'sales',
        areaServed: 'IL',
        availableLanguage: ['Hebrew', 'English'],
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}#website`,
      url: BASE,
      name: 'ניהול מבנים',
      inLanguage: 'he-IL',
      publisher: { '@id': `${BASE}#org` },
    },
    {
      '@type': 'Product',
      name: 'ניהול מבנים',
      description: 'פלטפורמת CRM לחברות ניהול ואחזקת מבנים בישראל',
      brand: { '@type': 'Brand', name: 'ניהול מבנים' },
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter',
          price: '399',
          priceCurrency: 'ILS',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Pro',
          price: '1290',
          priceCurrency: 'ILS',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon-512.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
