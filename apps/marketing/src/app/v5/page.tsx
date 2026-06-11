import Link from 'next/link';
import { Header } from '@/components/v5/Header';
import { Hero } from '@/components/v5/Hero';
import { Ticker } from '@/components/v5/Ticker';
import { TrustStrip } from '@/components/v5/TrustStrip';
import { PlatformStory } from '@/components/v5/PlatformStory';
import { Stats } from '@/components/v5/Stats';
import { Personas } from '@/components/v5/Personas';
import { Quote } from '@/components/v5/Quote';
import { Pricing } from '@/components/v5/Pricing';
import { Faq } from '@/components/v5/Faq';
import { Cta } from '@/components/v5/Cta';
import { Footer } from '@/components/v5/Footer';
import { MobileStickyCta } from '@/components/v5/MobileStickyCta';

export default function V5Page() {
  return (
    <>
      <PreviewRibbon />
      <Header />
      <main>
        <Hero />
        <Ticker />
        <TrustStrip />
        <PlatformStory />
        <Stats />
        <Personas />
        <Quote />
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
        <span style={{ color: 'var(--brass-3)' }}>● סקיצת עיצוב v5 — לא לפרסום</span>
        <Link href="/" style={{ color: 'var(--paper)', opacity: 0.85 }} className="hover:opacity-100">
          חזרה לאתר הפעיל ←
        </Link>
      </div>
    </div>
  );
}
