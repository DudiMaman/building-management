import { PersonaGateway } from './PersonaGateway';
import { ProductShowcase } from './ProductShowcase';

export function Hero() {
  return (
    <section className="paper-grain relative overflow-hidden">
      <div className="container pt-10 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Right column (RTL = start): editorial copy with persona switcher */}
          <div className="lg:col-span-7">
            <PersonaGateway />

            {/* Inline credibility row */}
            <div
              className="reveal mt-12 grid grid-cols-3 gap-4 border-t pt-6 md:gap-8"
              style={{ animationDelay: '500ms', borderColor: 'var(--line)' }}
            >
              <Stat value="130+" label="חברות ניהול" />
              <Stat value="8,400" label="דירות בניהול" />
              <Stat value="94%" label="גבייה ממוצעת" />
            </div>
          </div>

          {/* Left column: product showcase (rotating) */}
          <div className="lg:col-span-5 lg:pt-12">
            <ProductShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="tnum text-2xl font-extrabold leading-none text-[var(--ink)] md:text-3xl ltr">
        {value}
      </div>
      <div className="mt-1.5 text-[12px] text-[var(--ink-3)] md:text-[13px]">{label}</div>
    </div>
  );
}
