import React from 'react';

/**
 * Pulse brand mark — a clearly-tower-shaped landmark (setback crown +
 * antenna, multiple floor lines) with a prominent teal ECG pulse along
 * its base. Wordmark uses Bricolage Grotesque 800 — a free Google Font
 * with the kind of geometric character iconic tech wordmarks lean on
 * (Vercel/Linear/Cal.com territory) — rendered in the site's ink so the
 * mark stays cohesive with body copy.
 *
 *   <Logo />         — combined lockup (icon + wordmark), text-dominant
 *   <LogoMark />     — icon only, square
 *   <LogoWordmark /> — text only
 *
 * Every variant renders on a transparent background and forces LTR
 * direction so the site's RTL context does not flip text coordinates.
 */

const INK = '#1c1917';
const TEAL = '#2dd4bf';

const TOWER_PATHS = (
  <g
    fill="none"
    stroke={INK}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Antenna */}
    <line x1="50" y1="2" x2="50" y2="14" strokeWidth="2.2" />
    {/* Crown — narrower top section sitting on the main body */}
    <path d="M40 14 L40 28 L60 28 L60 14 Z" strokeWidth="3" />
    {/* Main body — wider tower */}
    <path d="M26 28 L26 86 L74 28 Z" stroke="none" />
    <path d="M26 28 L26 86 L74 86 L74 28 Z" strokeWidth="3.2" />
    {/* Floor lines — five evenly-spaced divisions read clearly as windows */}
    <line x1="26" y1="38" x2="74" y2="38" strokeWidth="1.6" />
    <line x1="26" y1="48" x2="74" y2="48" strokeWidth="1.6" />
    <line x1="26" y1="58" x2="74" y2="58" strokeWidth="1.6" />
    <line x1="26" y1="68" x2="74" y2="68" strokeWidth="1.6" />
    <line x1="26" y1="78" x2="74" y2="78" strokeWidth="1.6" />
    {/* Vertical mullions — two columns of windows per floor */}
    <line x1="42" y1="30" x2="42" y2="86" strokeWidth="1.4" />
    <line x1="58" y1="30" x2="58" y2="86" strokeWidth="1.4" />
    {/* Crown mullion */}
    <line x1="50" y1="16" x2="50" y2="28" strokeWidth="1.4" />
  </g>
);

const PULSE_PATH = (
  <path
    d="M2 96 L24 96 L30 96 L36 86 L44 108 L52 70 L60 106 L66 88 L72 96 L98 96"
    fill="none"
    stroke={TEAL}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const WORDMARK_FONT =
  "'Bricolage Grotesque', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

interface BaseProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  title?: string;
}

/** Tower icon with teal pulse along the foundation. */
export function LogoMark({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 100 116"
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

/** "Pulse" wordmark in Bricolage Grotesque 800. */
export function LogoWordmark({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 220 80"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      <text
        x="0"
        y="64"
        fontFamily={WORDMARK_FONT}
        fontSize="72"
        fontWeight="800"
        fill={INK}
        letterSpacing="-2.2"
      >
        Pulse
      </text>
    </svg>
  );
}

/**
 * Combined lockup — wordmark dominates while the tower mark reads as a
 * recognizable landmark on the left.
 */
export function Logo({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 300 88"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      {/* Mark — scaled to ~70 tall sitting alongside the wordmark */}
      <g transform="translate(2, 0) scale(0.66)">
        {TOWER_PATHS}
        {PULSE_PATH}
      </g>
      {/* Wordmark — Bricolage 800 in ink */}
      <text
        x="78"
        y="66"
        fontFamily={WORDMARK_FONT}
        fontSize="68"
        fontWeight="800"
        fill={INK}
        letterSpacing="-2"
      >
        Pulse
      </text>
    </svg>
  );
}
