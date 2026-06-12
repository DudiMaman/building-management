import { Header } from '@/components/v5/Header';
import { Hero } from '@/components/v5/Hero';
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
      <Header />
      <main>
        <Hero />
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
