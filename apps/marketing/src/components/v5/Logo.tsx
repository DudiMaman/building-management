import React from 'react';

/**
 * Pulse brand mark — three bold-line skyscrapers with slanted window
 * stripes (small / very tall with sharp triangular crown / tall with
 * sharp crown) standing on a baseline that breaks into a full ECG
 * W-pattern: rise to first peak, deep plunge below baseline, taller
 * second peak, settle. Pulse line is rendered in saturated red, the
 * buildings in ink — the lone color accent in the entire site.
 *
 *   <Logo />         — combined lockup (icon + 'PULSE' wordmark)
 *   <LogoMark />     — icon only, square
 *   <LogoWordmark /> — text only
 *
 * Every variant renders on transparent background and forces LTR
 * direction so the site's RTL context doesn't flip text coordinates.
 */

const INK = '#1c1917';
const PULSE_RED = '#dc2626';

const TOWER_PATHS = (
  <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
    {/* Left short building — flat top rising slightly to the right */}
    <path d="M8 88 L8 62 L26 56 L26 88 Z" strokeWidth="3.5" />
    {/* Center tallest building — sharp triangular peak in the middle */}
    <path d="M30 88 L30 28 L40 4 L50 28 L50 88 Z" strokeWidth="3.5" />
    {/* Right tall building — sharp triangular peak, slightly shorter */}
    <path d="M54 88 L54 36 L65 18 L76 36 L76 88 Z" strokeWidth="3.5" />

    {/* Slanted window stripes — right edge higher than left, creating
        the perspective effect seen in the reference */}
    <g strokeWidth="1.5" strokeLinecap="round">
      {/* Left building */}
      <line x1="22" y1="66" x2="10" y2="69" />
      <line x1="22" y1="72" x2="10" y2="75" />
      <line x1="22" y1="78" x2="10" y2="81" />
      <line x1="22" y1="84" x2="10" y2="87" />
      {/* Center building */}
      <line x1="48" y1="34" x2="32" y2="37" />
      <line x1="48" y1="40" x2="32" y2="43" />
      <line x1="48" y1="46" x2="32" y2="49" />
      <line x1="48" y1="52" x2="32" y2="55" />
      <line x1="48" y1="58" x2="32" y2="61" />
      <line x1="48" y1="64" x2="32" y2="67" />
      <line x1="48" y1="70" x2="32" y2="73" />
      <line x1="48" y1="76" x2="32" y2="79" />
      <line x1="48" y1="82" x2="32" y2="85" />
      {/* Right building */}
      <line x1="74" y1="42" x2="56" y2="45" />
      <line x1="74" y1="48" x2="56" y2="51" />
      <line x1="74" y1="54" x2="56" y2="57" />
      <line x1="74" y1="60" x2="56" y2="63" />
      <line x1="74" y1="66" x2="56" y2="69" />
      <line x1="74" y1="72" x2="56" y2="75" />
      <line x1="74" y1="78" x2="56" y2="81" />
      <line x1="74" y1="84" x2="56" y2="87" />
    </g>
  </g>
);

/**
 * Bold red ECG: long horizontal baseline, rise to a first peak, deep
 * plunge below baseline (the dramatic S valley), taller second peak,
 * settle back to baseline.
 */
const PULSE_PATH = (
  <path
    d="M2 92 L20 92 L26 82 L30 56 L36 100 L42 36 L48 96 L54 82 L58 92 L98 92"
    fill="none"
    stroke={PULSE_RED}
    strokeWidth="4"
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

/** Three bold-line skyscrapers with a red ECG pulse at the base. */
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
 * Combined lockup — icon left (with red pulse), 'PULSE' wordmark right.
 * Wordmark unchanged from previous version per current direction.
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
      {TOWER_PATHS}
      {PULSE_PATH}
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
