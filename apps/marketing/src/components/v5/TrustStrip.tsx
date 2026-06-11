/** Compact press strip — single quiet row. */

const PRESS = ['Calcalist', 'Globes', 'TheMarker', 'ישראל היום', 'BizPortal', 'בתים'];

export function TrustStrip() {
  return (
    <div className="container">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-10 md:justify-between md:py-12">
        <span className="eyebrow-en">Featured in</span>
        {PRESS.map((name) => (
          <span key={name} className="text-[15px] font-bold tracking-tight text-[var(--ink-4)] md:text-[17px]">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
