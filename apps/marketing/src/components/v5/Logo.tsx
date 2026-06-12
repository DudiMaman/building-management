import React from 'react';

/**
 * Pulse brand mark — three thin-line skyscrapers (short / tall-with-
 * angled-crown / medium) standing on a baseline that breaks into a
 * single bold teal pulse spike rising between the center and right
 * towers, halfway up their height so the heartbeat is unmistakable.
 *
 * Wordmark uses IBM Plex Sans Medium (500) with open tracking and is
 * cap-top-aligned with the icon's tallest point so the whole lockup
 * reads as one unified header.
 *
 *   <Logo />         — combined lockup (icon + wordmark), top-aligned
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
    <path d="M14 92 L14 56 L30 46 L30 92 Z" strokeWidth="2.6" />
    {/* Center tower — tallest, sharp diagonal crown */}
    <path d="M36 92 L36 24 L54 6 L54 92 Z" strokeWidth="2.6" />
    {/* Right tower — medium, top slants up to the left */}
    <path d="M60 92 L60 40 L76 30 L76 92 Z" strokeWidth="2.6" />

    {/* Window stripes — thin horizontals densely packed */}
    <g strokeWidth="1.2" strokeLinecap="round">
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

/**
 * Bold pulse spike rising between the center and right towers, peaking
 * roughly mid-tower so it reads unambiguously as a heartbeat. Stroke
 * width bumped from 2.8 to 5 and rounded for a confident pulse mark.
 */
const PULSE_PATH = (
  <path
    d="M2 95 L46 95 L58 32 L70 95 L98 95"
    fill="none"
    stroke={TEAL}
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const WORDMARK_FONT =
  "'IBM Plex Sans', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

interface BaseProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  title?: string;
}

/** Three thin-line skyscrapers with a bold teal pulse rising between them. */
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

/** "Pulse" wordmark in IBM Plex Sans 500. */
export function LogoWordmark({ className = '', title = 'Pulse', ...rest }: BaseProps) {
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
        y="62"
        fontFamily={WORDMARK_FONT}
        fontSize="60"
        fontWeight="500"
        fill={INK}
        letterSpacing="1.6"
      >
        Pulse
      </text>
    </svg>
  );
}

/**
 * Combined lockup — wordmark is top-aligned with the icon: 'P' cap-top
 * sits at the same vertical line where the tallest tower's crown
 * begins, so the whole logo reads as one unit rather than text floating
 * mid-icon.
 */
export function Logo({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 280 100"
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
      {/* Wordmark — IBM Plex Sans Medium in ink, top-aligned with the
          icon's tallest crown (baseline y=48 places 'P' cap-top at ~y=6,
          matching the center tower's peak). */}
      <text
        x="110"
        y="48"
        fontFamily={WORDMARK_FONT}
        fontSize="56"
        fontWeight="500"
        fill={INK}
        letterSpacing="1.4"
      >
        Pulse
      </text>
    </svg>
  );
}
