/**
 * Trust band — Israeli press logos + investor/integration logos.
 * Per research: this is the canonical local trust signal for
 * Israeli B2B SaaS. Single horizontal strip, low-contrast wordmarks.
 */

export function TrustBand() {
  return (
    <section
      className="border-y"
      style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
    >
      <div className="container py-10 md:py-12">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-10">
          <div className="md:border-l md:pl-10" style={{ borderColor: 'var(--line)' }}>
            <div className="eyebrow-en">FEATURED IN</div>
            <p className="mt-2 text-[14px] text-[var(--ink-2)]">העיתונות הישראלית</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-x-6 gap-y-4 sm:grid-cols-6 md:gap-x-10">
            {['Calcalist', 'Globes', 'TheMarker', 'ישראל היום', 'BizPortal', 'בתים'].map((n) => (
              <div
                key={n}
                className="text-center text-[14px] font-bold text-[var(--ink-3)] md:text-[15px]"
                style={{ letterSpacing: '-0.005em' }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
