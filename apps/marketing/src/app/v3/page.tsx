import Link from 'next/link';
import { Header } from '@/components/v3/Header';
import { Hero } from '@/components/v3/Hero';
import { PressStrip } from '@/components/v3/PressStrip';
import { Platform } from '@/components/v3/Platform';
import { HowItWorks } from '@/components/v3/HowItWorks';
import { Stats } from '@/components/v3/Stats';
import { Testimonials } from '@/components/v3/Testimonials';
import { Pricing } from '@/components/v3/Pricing';
import { Faq } from '@/components/v3/Faq';
import { Cta } from '@/components/v3/Cta';
import { Footer } from '@/components/v3/Footer';
import { MobileStickyCta } from '@/components/v3/MobileStickyCta';

export default function V3Page() {
  return (
    <>
      <PreviewRibbon />
      <Header />
      <main>
        <Hero />
        <PressStrip />
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
        <span style={{ color: 'var(--brass)' }}>● סקיצת עיצוב v3 — לא לפרסום</span>
        <Link href="/" style={{ color: 'var(--paper)', opacity: 0.85 }} className="hover:opacity-100">
          חזרה לאתר הפעיל ←
        </Link>
      </div>
    </div>
  );
}
