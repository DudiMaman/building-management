import React from 'react';

/**
 * Pulse brand mark — three thin-line skyscrapers with dramatically
 * varied heights (small / very tall with a sharp diagonal crown /
 * medium), standing on a single ECG pulse line that runs through them
 * with a full QRS spike: small Q dip, sharp R peak, deep S valley
 * below the baseline, and a small T rise.
 *
 * Single ink color throughout (#1c1917) so the mark reads as a unified
 * line drawing rather than a multi-color icon. Wordmark uses Inter 300
 * (Light) all-caps with very open tracking — minimal, modern, serious.
 *
 *   <Logo />         — combined lockup (icon + 'PULSE' wordmark)
 *   <LogoMark />     — icon only, square
 *   <LogoWordmark /> — text only
 *
 * Every variant renders on transparent background and forces LTR
 * direction so the site's RTL context doesn't flip text coordinates.
 */

const INK = '#1c1917';

const TOWER_PATHS = (
  <g fill="none" stroke={INK} strokeLinecap="square" strokeLinejoin="miter">
    {/* Left tower — short, top slants up to the right */}
    <path d="M12 92 L12 64 L28 54 L28 92 Z" strokeWidth="2" />
    {/* Center tower — tallest, sharp diagonal crown with peak top-right */}
    <path d="M32 92 L32 32 L50 4 L50 92 Z" strokeWidth="2" />
    {/* Right tower — medium, top slants down to the right */}
    <path d="M54 92 L54 28 L70 38 L70 92 Z" strokeWidth="2" />

    {/* Thin horizontal window stripes — densely packed for "many floors" */}
    <g strokeWidth="1" strokeLinecap="round">
      {/* Left tower */}
      <line x1="16" y1="68" x2="24" y2="68" />
      <line x1="16" y1="74" x2="24" y2="74" />
      <line x1="16" y1="80" x2="24" y2="80" />
      <line x1="16" y1="86" x2="24" y2="86" />
      {/* Center tower */}
      <line x1="36" y1="36" x2="46" y2="36" />
      <line x1="36" y1="44" x2="46" y2="44" />
      <line x1="36" y1="52" x2="46" y2="52" />
      <line x1="36" y1="60" x2="46" y2="60" />
      <line x1="36" y1="68" x2="46" y2="68" />
      <line x1="36" y1="76" x2="46" y2="76" />
      <line x1="36" y1="84" x2="46" y2="84" />
      {/* Right tower */}
      <line x1="58" y1="44" x2="66" y2="44" />
      <line x1="58" y1="52" x2="66" y2="52" />
      <line x1="58" y1="60" x2="66" y2="60" />
      <line x1="58" y1="68" x2="66" y2="68" />
      <line x1="58" y1="76" x2="66" y2="76" />
      <line x1="58" y1="84" x2="66" y2="84" />
    </g>
  </g>
);

/**
 * Full ECG trace at the baseline: long horizontal run, a small Q dip,
 * a sharp R peak rising halfway up the towers, then dropping below
 * the baseline for the S wave, and a small T rise before settling.
 */
const PULSE_PATH = (
  <path
    d="M2 92 L34 92 L36 90 L38 50 L42 98 L46 84 L48 92 L98 92"
    fill="none"
    stroke={INK}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const WORDMARK_FONT =
  "'Inter', 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

interface BaseProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  title?: string;
}

/** Three skyscrapers with a full ECG pulse line at the base. */
export function LogoMark({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      {TOWER_PATHS}
      {PULSE_PATH}
    </svg>
  );
}

/** "PULSE" wordmark — Inter Light all-caps with very open tracking. */
export function LogoWordmark({ className = '', title = 'PULSE', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 240 80"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      <text
        x="0"
        y="56"
        fontFamily={WORDMARK_FONT}
        fontSize="48"
        fontWeight="300"
        fill={INK}
        letterSpacing="7"
      >
        PULSE
      </text>
    </svg>
  );
}

/**
 * Combined lockup — icon left, 'PULSE' right. Wordmark baseline sits
 * just below the icon's pulse line so the lockup looks like the
 * skyline and word both stand on the same ground.
 */
export function Logo({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 290 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      {/* Mark — full-height, no scaling */}
      {TOWER_PATHS}
      {PULSE_PATH}
      {/* Wordmark — Inter Light all-caps in ink, very open tracking,
          baseline sits where the pulse line settles so the lockup reads
          like one ground-level composition. */}
      <text
        x="106"
        y="72"
        fontFamily={WORDMARK_FONT}
        fontSize="44"
        fontWeight="300"
        fill={INK}
        letterSpacing="6"
      >
        PULSE
      </text>
    </svg>
  );
}
