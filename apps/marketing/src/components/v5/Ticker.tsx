/**
 * Live operations ticker — a continuous strip of (simulated) system events
 * directly under the hero. The "alive" feeling without animation noise:
 * pure CSS marquee, pauses on hover, static under reduced motion.
 */

const EVENTS = [
  { dot: 'var(--brass)', text: '₪420 ועד יוני שולם · הרצל 12, רעננה' },
  { dot: 'var(--moss)', text: 'תקלה #482 נסגרה · מעלית, בן גוריון 8' },
  { dot: 'var(--brass-2)', text: 'שער נפתח · חניון א׳, רוטשילד 4' },
  { dot: 'var(--ink-3)', text: 'הצבעה אושרה · שיפוץ לובי, ויצמן 3' },
  { dot: 'var(--moss)', text: 'הבוט ענה ל-3 פניות · אבן גבירול 22' },
  { dot: 'var(--brass)', text: 'קבלה #2031 נשלחה · דירה 14, סוקולוב 9' },
  { dot: 'var(--rust)', text: 'תזכורת נשלחה · 4 דיירים באיחור' },
  { dot: 'var(--brass)', text: 'צ׳ק נפרע · ₪1,850 · ספק גינון' },
];

export function Ticker() {
  return (
    <div className="border-y" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <p className="sr-only">
        דוגמאות לאירועים שזורמים במערכת בזמן אמת: תשלומי ועד, סגירת תקלות, פתיחת שערים, הצבעות והודעות בוט.
      </p>
      <div className="ticker-mask py-3.5" aria-hidden>
        <div className="ticker-strip">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {EVENTS.map((e, i) => (
                <span key={`${copy}-${i}`} className="flex items-center whitespace-nowrap px-5 text-[13px] text-[var(--ink-2)]">
                  <span className="ms-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: e.dot }} />
                  <span className="me-2" />
                  {e.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
