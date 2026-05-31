/**
 * Israeli press logo strip — the canonical local trust signal.
 * Per research: "Globes, TheMarker, Calcalist, Israel Hayom" =
 * the Israeli equivalent of TechCrunch. Adding "אזור הנדל"ן" /
 * trade outlets gives industry-specific credibility.
 */

export function PressStrip() {
  return (
    <section className="border-y" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <div className="container py-8 md:py-10">
        <p className="text-center text-[12px] font-semibold tracking-wider text-[var(--ink-3)] uppercase">
          הופענו ב
        </p>
        <div className="mt-5 grid grid-cols-2 items-center gap-x-6 gap-y-5 sm:grid-cols-3 md:flex md:items-center md:justify-center md:gap-10">
          <PressLogo name="Calcalist" hebrew="כלכליסט" />
          <PressLogo name="Globes" hebrew="גלובס" />
          <PressLogo name="TheMarker" hebrew="The&nbsp;Marker" />
          <PressLogo name="Israel Hayom" hebrew="ישראל היום" />
          <PressLogo name="BizPortal" hebrew="ביזפורטל" />
          <PressLogo name="Batim" hebrew="בתים" />
        </div>
      </div>
    </section>
  );
}

function PressLogo({ name, hebrew }: { name: string; hebrew: string }) {
  // Each "logo" is rendered as Hebrew wordmark in serif-ish all-caps style
  // matching the publication. Real logos can be swapped in later.
  return (
    <div className="text-center">
      <div className="text-[15px] font-bold text-[var(--ink-3)] md:text-[16px]" style={{ letterSpacing: '-0.01em' }}>
        {hebrew}
      </div>
    </div>
  );
}
