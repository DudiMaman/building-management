import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Testimonials } from '@/components/testimonials';
import { CtaBanner } from '@/components/cta-banner';

export const metadata: Metadata = {
  title: 'לקוחות מספרים — ניהול מבנים',
  description: 'חברות ניהול שעברו לפלטפורמה — והפסיקו לרדוף אחרי תזכורות.',
};

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <section className="px-6 pt-16 pb-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">לקוחות מספרים</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            סיפורים אמיתיים מחברות ניהול ישראליות.
          </p>
        </section>
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
