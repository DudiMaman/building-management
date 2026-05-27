import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'בקרוב — ניהול מבנים',
  description: 'לוח הניהול שלנו עומד לעלות לאוויר. הירשמו להתראה.',
};

export default function ComingSoonPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center bg-gradient-to-b from-white to-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm text-primary-700">
            🚀 בעבודה
          </div>
          <h1 className="mt-6 text-4xl font-bold md:text-5xl">לוח הניהול עולה בקרוב</h1>
          <p className="mt-4 text-lg text-slate-600">
            אנחנו בשלבי השקה — הירשמו לרשימת ההמתנה ונחזור אליכם ברגע שהשירות עולה לאוויר.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-4 font-medium text-white hover:bg-primary-700"
          >
            הצטרפו לרשימת המתנה
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            או דברו איתנו ב-
            <Link href="/contact" className="text-primary hover:underline">
              צור קשר
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
