import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { CtaBanner } from '@/components/cta-banner';

export const metadata: Metadata = {
  title: 'פיצ׳רים — ניהול מבנים',
  description:
    'כל הפיצ׳רים: גבייה אוטומטית, פניות שירות, וואטסאפ, בוט AI, חשבוניות תואמות רשות המסים, ניהול צ׳קים, ודוחות.',
};

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <section className="px-6 pt-16 pb-8 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">פיצ׳רים</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            פלטפורמה אחת. כל הכלים שחברת ניהול צריכה.
          </p>
        </section>
        <Features />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
