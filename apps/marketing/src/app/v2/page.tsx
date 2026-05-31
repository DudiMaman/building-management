import Link from 'next/link';
import { HeaderV2 } from '@/components/v2/Header';
import { HeroV2 } from '@/components/v2/Hero';
import { StatsV2 } from '@/components/v2/Stats';
import { FeaturesV2 } from '@/components/v2/Features';
import { HowItWorksV2 } from '@/components/v2/HowItWorks';
import { PricingV2 } from '@/components/v2/Pricing';
import { TestimonialsV2 } from '@/components/v2/Testimonials';
import { FaqV2 } from '@/components/v2/Faq';
import { CtaV2 } from '@/components/v2/Cta';
import { FooterV2 } from '@/components/v2/Footer';

export default function V2Home() {
  return (
    <>
      {/* Sketch banner — fixed at the very top so it's clear this is a draft */}
      <DraftRibbon />
      <HeaderV2 />
      <main>
        <HeroV2 />
        <StatsV2 />
        <FeaturesV2 />
        <HowItWorksV2 />
        <TestimonialsV2 />
        <PricingV2 />
        <FaqV2 />
        <CtaV2 />
      </main>
      <FooterV2 />
    </>
  );
}

function DraftRibbon() {
  return (
    <div className="bg-[var(--brass)] text-[var(--ink)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-1.5 text-xs lg:px-10">
        <span className="label">SKETCH · DESIGN PREVIEW · NOT PRODUCTION</span>
        <Link href="/" className="link text-[var(--ink)]">
          חזרה לאתר הנוכחי
        </Link>
      </div>
    </div>
  );
}
