import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Faq } from '@/components/faq';
import { CtaBanner } from '@/components/cta-banner';

export const metadata: Metadata = {
  title: 'שאלות נפוצות — ניהול מבנים',
  description: 'שאלות שאנחנו שומעים הכי הרבה. תשובות ברורות בעברית.',
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <section className="px-6 pt-16 pb-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">שאלות נפוצות</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            לא מצאתם תשובה? <a href="/contact" className="text-primary hover:underline">שלחו לנו הודעה</a>.
          </p>
        </section>
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
