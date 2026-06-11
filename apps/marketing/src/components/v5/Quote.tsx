import { Reveal } from './Reveal';

/**
 * One strong voice instead of three equal cards (v4) — a single hero
 * quote with its before/after metric. Less proof-clutter, more weight.
 */
export function Quote() {
  return (
    <section id="proof" className="section border-t" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="eyebrow">לקוחות מספרים</div>
              <blockquote className="mt-6">
                <p className="display-2 max-w-[24ch]" style={{ fontWeight: 700 }}>
                  ”מה שהיה לוקח שעות — תיק לעורך דין על צ׳ק שחזר —{' '}
                  <span style={{ color: 'var(--brass)' }}>הופך לשתי דקות.</span>“
                </p>
                <footer className="mt-7 flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-full text-[14px] font-extrabold"
                    style={{ background: 'var(--bg-2)', color: 'var(--ink)' }}
                  >
                    יל
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold">יוסי לוי</span>
                    <span className="block text-[13px] text-[var(--ink-3)]">מנהל תפעול · ניהול הירוק · 38 בניינים</span>
                  </span>
                </footer>
              </blockquote>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal delay={120}>
              <div className="card overflow-hidden">
                <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--line)' }}>
                  <div className="p-5" style={{ background: 'var(--paper)' }}>
                    <div className="eyebrow-en !text-[10px]">לפני</div>
                    <div className="tnum mt-1 text-[26px] font-extrabold leading-none text-[var(--ink-4)]">
                      <s>3 שעות</s>
                    </div>
                  </div>
                  <div className="p-5" style={{ background: 'var(--paper)' }}>
                    <div className="eyebrow-en !text-[10px]" style={{ color: 'var(--brass)' }}>
                      אחרי
                    </div>
                    <div className="tnum mt-1 text-[26px] font-extrabold leading-none" style={{ color: 'var(--brass)' }}>
                      2 דק׳
                    </div>
                  </div>
                </div>
                <div className="border-t px-5 py-3 text-[12px] text-[var(--ink-3)]" style={{ borderColor: 'var(--line)' }}>
                  טיפול בצ׳ק חוזר — כולל מכתב התראה ותיעוד
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
