import { Hero } from '@/components/hero';
import { StatsBar } from '@/components/stats-bar';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { WhoItsFor } from '@/components/who-its-for';
import { Compare } from '@/components/compare';
import { Integrations } from '@/components/integrations';
import { Pricing } from '@/components/pricing';
import { Testimonials } from '@/components/testimonials';
import { Faq } from '@/components/faq';
import { CtaBanner } from '@/components/cta-banner';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <Hero />
        <StatsBar />
        <Features />
        <HowItWorks />
        <WhoItsFor />
        <Compare />
        <Integrations />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
