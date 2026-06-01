import Link from 'next/link';
import { Header } from '@/components/v4/Header';
import { Hero } from '@/components/v4/Hero';
import { TrustBand } from '@/components/v4/TrustBand';
import { Platform } from '@/components/v4/Platform';
import { HowItWorks } from '@/components/v4/HowItWorks';
import { Stats } from '@/components/v4/Stats';
import { Testimonials } from '@/components/v4/Testimonials';
import { Pricing } from '@/components/v4/Pricing';
import { Faq } from '@/components/v4/Faq';
import { Cta } from '@/components/v4/Cta';
import { Footer } from '@/components/v4/Footer';
import { MobileStickyCta } from '@/components/v4/MobileStickyCta';

export default function V4Page() {
  return (
    <>
      <PreviewRibbon />
      <Header />
      <main>
        <Hero />
        <TrustBand />
        <Platform />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}

function PreviewRibbon() {
  return (
    <div className="border-b" style={{ background: 'var(--ink)', borderColor: 'var(--ink)' }}>
      <div className="container flex flex-wrap items-center justify-between gap-2 py-1.5 text-[11px]">
        <span style={{ color: 'var(--brass-3)' }}>● סקיצת עיצוב v4 — לא לפרסום</span>
        <Link href="/" style={{ color: 'var(--paper)', opacity: 0.85 }} className="hover:opacity-100">
          חזרה לאתר הפעיל ←
        </Link>
      </div>
    </div>
  );
}
