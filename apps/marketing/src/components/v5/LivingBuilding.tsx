'use client';
import { useEffect, useRef, useState } from 'react';
import { CreditCard, Wrench, MessageCircle, FileCheck, DoorOpen } from 'lucide-react';

/**
 * The Living Building — v5's centerpiece. A hand-built SVG elevation of a
 * residential building through which system events visibly flow. Reused in
 * two modes:
 *   - 'auto'       (hero): cycles through the five zones on a timer,
 *                  pauses on hover, freezes under prefers-reduced-motion.
 *   - 'controlled' (platform story): the active zone is scroll-driven
 *                  by the parent via the `zone` prop.
 *
 * Successor to v2's BuildingDrawing — same idea, rebuilt on the v3/v4
 * token system: Heebo-only chips, brass/ink palette, CSS-transition
 * highlights instead of mixed-font SVG text.
 */

export type Zone = 'billing' | 'maintenance' | 'comms' | 'docs' | 'access';

export const ZONES: Zone[] = ['billing', 'maintenance', 'comms', 'docs', 'access'];

export const ZONE_LABELS: Record<Zone, string> = {
  billing: 'גבייה',
  maintenance: 'אחזקה',
  comms: 'תקשורת',
  docs: 'מסמכים',
  access: 'גישה',
};

const CHIPS: {
  zone: Zone;
  icon: typeof CreditCard;
  color: string;
  title: string;
  sub: string;
  pos: React.CSSProperties;
}[] = [
  {
    zone: 'billing',
    icon: CreditCard,
    color: 'var(--brass)',
    title: 'ועד יוני נגבה',
    sub: '₪420 · דירה 12 · הוראת קבע',
    pos: { top: '15%', insetInlineStart: '52%' },
  },
  {
    zone: 'maintenance',
    icon: Wrench,
    color: 'var(--rust)',
    title: 'נזילה בקומה 3',
    sub: 'שויכה · צילום אצל העובד',
    pos: { top: '38%', insetInlineStart: '52%' },
  },
  {
    zone: 'comms',
    icon: MessageCircle,
    color: 'var(--moss)',
    title: 'הבוט ענה לדייר',
    sub: 'WhatsApp · 8 שניות',
    pos: { top: '3%', insetInlineStart: '4%' },
  },
  {
    zone: 'docs',
    icon: FileCheck,
    color: 'var(--ink-2)',
    title: 'פרוטוקול אסיפה נחתם',
    sub: '12 חתימות דיגיטליות',
    pos: { top: '63%', insetInlineStart: '46%' },
  },
  {
    zone: 'access',
    icon: DoorOpen,
    color: 'var(--brass-2)',
    title: 'שער החניה נפתח',
    sub: 'דייר מזוהה · חניון א׳',
    pos: { top: '76%', insetInlineStart: '2%' },
  },
];

/* Window grid geometry: 4 residential floors x 3 columns */
const COLS = [108, 211, 314];
const ROWS = [96, 178, 260, 342];
const WIN_W = 58;
const WIN_H = 34;

const LIT_BY_ZONE: Record<Zone, [number, number][]> = {
  billing: [
    [0, 2],
    [1, 0],
    [2, 1],
    [3, 2],
  ],
  maintenance: [[1, 2]],
  comms: [[0, 0]],
  docs: [],
  access: [],
};

export function LivingBuilding({
  mode = 'auto',
  zone: zoneProp,
  className = '',
}: {
  mode?: 'auto' | 'controlled';
  zone?: Zone;
  className?: string;
}) {
  const [autoZone, setAutoZone] = useState<Zone>('billing');
  const paused = useRef(false);

  useEffect(() => {
    if (mode !== 'auto') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      if (paused.current) return;
      setAutoZone((z) => ZONES[(ZONES.indexOf(z) + 1) % ZONES.length]);
    }, 3800);
    return () => clearInterval(t);
  }, [mode]);

  const zone = mode === 'controlled' ? (zoneProp ?? 'billing') : autoZone;
  const lit = LIT_BY_ZONE[zone];

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label="איור חי של בניין מגורים שמציג אירועי מערכת בזמן אמת: גבייה, אחזקה, תקשורת, מסמכים ובקרת גישה"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <svg viewBox="0 0 480 560" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id="lbGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fcd34d" stopOpacity="0.95" />
            <stop offset="1" stopColor="#a16207" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Ground */}
        <line x1="16" y1="488" x2="464" y2="488" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="16" y1="495" x2="464" y2="495" stroke="var(--ink)" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.4" />

        {/* Building shell */}
        <rect x="84" y="72" width="312" height="416" fill="#fffdf8" stroke="var(--ink)" strokeWidth="1.4" />
        <rect x="78" y="64" width="324" height="8" fill="#fffdf8" stroke="var(--ink)" strokeWidth="1.2" />
        {[154, 236, 318, 400].map((y) => (
          <line key={y} x1="84" y1={y} x2="396" y2={y} stroke="var(--ink)" strokeWidth="0.8" opacity="0.55" />
        ))}

        {/* Windows — base */}
        {ROWS.map((y, r) =>
          COLS.map((x, c) => (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width={WIN_W} height={WIN_H} fill="rgba(28,25,23,0.05)" stroke="var(--ink)" strokeWidth="0.9" />
              <line x1={x + WIN_W / 2} y1={y} x2={x + WIN_W / 2} y2={y + WIN_H} stroke="var(--ink)" strokeWidth="0.45" opacity="0.6" />
            </g>
          )),
        )}

        {/* Windows — brass glow overlays (zone-driven) */}
        {ROWS.map((y, r) =>
          COLS.map((x, c) => {
            const isLit = lit.some(([lr, lc]) => lr === r && lc === c);
            return (
              <rect
                key={`lit-${r}-${c}`}
                className="lb-zone"
                data-active={isLit}
                x={x + 1}
                y={y + 1}
                width={WIN_W - 2}
                height={WIN_H - 2}
                fill="url(#lbGlow)"
              />
            );
          }),
        )}

        {/* Maintenance: rust outline on the affected unit + riser highlight */}
        <g className="lb-zone" data-active={zone === 'maintenance'}>
          <rect x={COLS[2] - 3} y={ROWS[1] - 3} width={WIN_W + 6} height={WIN_H + 6} fill="none" stroke="var(--rust)" strokeWidth="2" rx="2" />
          <line x1="388" y1="80" x2="388" y2="484" stroke="var(--brass)" strokeWidth="1.6" strokeDasharray="5 4" />
          {[154, 236, 318, 400].map((y) => (
            <circle key={y} className="lb-blink" cx="388" cy={y} r="3" fill="var(--brass)" />
          ))}
        </g>
        {/* Riser — always faintly present */}
        <line x1="388" y1="80" x2="388" y2="484" stroke="var(--ink)" strokeWidth="0.7" strokeDasharray="4 5" opacity="0.25" />

        {/* Entrance */}
        <line x1="208" y1="414" x2="272" y2="414" stroke="var(--ink)" strokeWidth="1.2" />
        <rect x="216" y="420" width="48" height="68" fill="#fffdf8" stroke="var(--ink)" strokeWidth="1.2" />
        <line x1="240" y1="420" x2="240" y2="488" stroke="var(--ink)" strokeWidth="0.6" />
        <circle cx="233" cy="456" r="1.5" fill="var(--ink)" />
        <circle cx="247" cy="456" r="1.5" fill="var(--ink)" />

        {/* Lobby windows */}
        <rect x="108" y="424" width="58" height="28" fill="rgba(28,25,23,0.05)" stroke="var(--ink)" strokeWidth="0.9" />
        <rect x="314" y="424" width="58" height="28" fill="rgba(28,25,23,0.05)" stroke="var(--ink)" strokeWidth="0.9" />

        {/* Docs vault — folder in the left lobby window */}
        <g className="lb-zone" data-active={zone === 'docs'}>
          <rect x="109" y="425" width="56" height="26" fill="url(#lbGlow)" />
          <rect x="124" y="431" width="26" height="15" fill="#fffdf8" stroke="var(--ink-2)" strokeWidth="1.2" rx="1.5" />
          <path d="M124 434 h8 l3 -3 h6" fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />
        </g>

        {/* Antenna (comms) — left roof */}
        <line x1="148" y1="64" x2="148" y2="32" stroke="var(--ink)" strokeWidth="1.1" />
        <line x1="141" y1="40" x2="155" y2="40" stroke="var(--ink)" strokeWidth="0.8" />
        <circle cx="148" cy="28" r="2.4" fill="var(--ink)" />
        <g className="lb-zone" data-active={zone === 'comms'}>
          <circle cx="148" cy="28" r="2.4" fill="var(--moss)" />
          <circle className="lb-wave" cx="148" cy="28" r="10" fill="none" stroke="var(--moss)" strokeWidth="1.4" />
          <circle className="lb-wave lb-wave-2" cx="148" cy="28" r="10" fill="none" stroke="var(--moss)" strokeWidth="1.2" />
          <circle className="lb-wave lb-wave-3" cx="148" cy="28" r="10" fill="none" stroke="var(--moss)" strokeWidth="1" />
        </g>

        {/* Parking gate (access) — far left at ground */}
        <rect x="30" y="462" width="9" height="26" fill="#fffdf8" stroke="var(--ink)" strokeWidth="1.1" />
        <rect
          x="39"
          y="468"
          width="44"
          height="5"
          rx="2.5"
          fill={zone === 'access' ? 'var(--brass)' : 'var(--ink)'}
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'left center',
            transform: zone === 'access' ? 'rotate(-52deg)' : 'rotate(0deg)',
            transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), fill 300ms',
          }}
        />
        <g className="lb-zone" data-active={zone === 'access'}>
          <circle className="lb-blink" cx="34.5" cy="458" r="3" fill="var(--moss)" />
        </g>

        {/* Tree — right of entrance */}
        <line x1="432" y1="488" x2="432" y2="466" stroke="var(--ink)" strokeWidth="1.1" />
        <circle cx="432" cy="454" r="13" fill="none" stroke="var(--ink)" strokeWidth="1.1" />
        <circle cx="424" cy="460" r="7" fill="none" stroke="var(--ink)" strokeWidth="0.8" opacity="0.6" />

        {/* Dimension line — quiet engineering charm */}
        <g stroke="var(--ink)" strokeWidth="0.6" opacity="0.45">
          <line x1="420" y1="72" x2="420" y2="488" />
          <line x1="415" y1="72" x2="425" y2="72" />
          <line x1="415" y1="488" x2="425" y2="488" />
        </g>
        <text
          x="428"
          y="300"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill="var(--ink-3)"
          letterSpacing="0.08em"
        >
          18m
        </text>
      </svg>

      {/* Address plate */}
      <div
        className="absolute flex items-center gap-2 rounded-md border px-2.5 py-1.5"
        style={{ top: '1%', insetInlineEnd: '2%', background: 'var(--paper)', borderColor: 'var(--line)' }}
        aria-hidden
      >
        <span className="lb-blink inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--moss)' }} />
        <span className="text-[11px] font-bold" style={{ color: 'var(--ink)' }}>
          רוטשילד 4, תל אביב
        </span>
        <span className="eyebrow-en !text-[9px]">LIVE</span>
      </div>

      {/* Event chips */}
      {CHIPS.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.zone}
            className="lb-chip absolute flex items-start gap-2 rounded-lg border px-3 py-2 shadow-lg"
            data-active={zone === c.zone}
            style={{ ...c.pos, background: 'var(--paper)', borderColor: 'var(--line)', boxShadow: '0 10px 24px -10px rgba(28,25,23,0.25)' }}
            aria-hidden
          >
            <span
              className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md"
              style={{ background: 'var(--bg-2)', color: c.color }}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span>
              <span className="block whitespace-nowrap text-[12px] font-bold leading-tight" style={{ color: 'var(--ink)' }}>
                {c.title}
              </span>
              <span className="block max-w-[150px] text-[11px] leading-snug" style={{ color: 'var(--ink-3)' }}>
                {c.sub}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
