import React from 'react';

/**
 * Pulse brand mark — three thin-line skyscrapers (tallest in the middle
 * with a sharp angled crown, shorter towers flanking it) standing on a
 * horizontal baseline that breaks into a single teal pulse spike rising
 * between the center and right towers. Wordmark uses Bricolage Grotesque
 * 800 in site ink so it integrates with body type while the mark keeps
 * its navy + teal brand identity.
 *
 *   <Logo />         — combined lockup (icon + wordmark), text-dominant
 *   <LogoMark />     — icon only, square
 *   <LogoWordmark /> — text only
 *
 * Every variant renders on transparent background and forces LTR
 * direction so the site's RTL context doesn't flip text coordinates.
 */

const NAVY = '#1e3a5f';
const TEAL = '#2dd4bf';
const INK = '#1c1917';

const TOWER_PATHS = (
  <g fill="none" stroke={NAVY} strokeLinecap="square" strokeLinejoin="miter">
    {/* Left tower — shorter, top slants up to the right */}
    <path d="M14 92 L14 56 L30 46 L30 92 Z" strokeWidth="2.2" />
    {/* Center tower — tallest, sharp diagonal crown */}
    <path d="M36 92 L36 24 L54 6 L54 92 Z" strokeWidth="2.2" />
    {/* Right tower — medium, top slants up to the left */}
    <path d="M60 92 L60 40 L76 30 L76 92 Z" strokeWidth="2.2" />

    {/* Window stripes — thin horizontals densely packed for the
        "many floors" feel of the reference */}
    <g strokeWidth="1.1" strokeLinecap="round">
      {/* Left tower */}
      <line x1="18" y1="60" x2="26" y2="60" />
      <line x1="18" y1="66" x2="26" y2="66" />
      <line x1="18" y1="72" x2="26" y2="72" />
      <line x1="18" y1="78" x2="26" y2="78" />
      <line x1="18" y1="84" x2="26" y2="84" />
      {/* Center tower */}
      <line x1="40" y1="32" x2="50" y2="32" />
      <line x1="40" y1="40" x2="50" y2="40" />
      <line x1="40" y1="48" x2="50" y2="48" />
      <line x1="40" y1="56" x2="50" y2="56" />
      <line x1="40" y1="64" x2="50" y2="64" />
      <line x1="40" y1="72" x2="50" y2="72" />
      <line x1="40" y1="80" x2="50" y2="80" />
      <line x1="40" y1="86" x2="50" y2="86" />
      {/* Right tower */}
      <line x1="64" y1="44" x2="72" y2="44" />
      <line x1="64" y1="52" x2="72" y2="52" />
      <line x1="64" y1="60" x2="72" y2="60" />
      <line x1="64" y1="68" x2="72" y2="68" />
      <line x1="64" y1="76" x2="72" y2="76" />
      <line x1="64" y1="84" x2="72" y2="84" />
    </g>
  </g>
);

/** Single sharp pulse spike rising between the center and right towers. */
const PULSE_PATH = (
  <path
    d="M2 96 L52 96 L58 62 L64 96 L98 96"
    fill="none"
    stroke={TEAL}
    strokeWidth="2.8"
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

/** Three thin-line skyscrapers with a teal pulse rising between them. */
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
 * Combined lockup — wordmark dominates, mark reads as a clear three-tower
 * skyline on the left.
 */
export function Logo({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 310 92"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      {/* Mark — scaled into ~84x84 region on the left */}
      <g transform="translate(2, 4) scale(0.84)">
        {TOWER_PATHS}
        {PULSE_PATH}
      </g>
      {/* Wordmark — Bricolage 800 in ink */}
      <text
        x="96"
        y="70"
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
