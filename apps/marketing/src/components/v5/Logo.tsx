import React from 'react';

/**
 * Pulse brand mark — refined from the user's reference sketch: three
 * thin-line towers with slanted crowns (short left rising right, tall
 * center peaking sharply top-right, medium right sloping down-right)
 * and slanted window dashes. The towers stand on a thin ground line
 * that carries a single refined ECG blip to their right — drawn in the
 * site's brass accent so the logo speaks the same visual language as
 * the rest of the page.
 *
 * Wordmark: 'PULSE' in Inter Medium (500), all-caps, open tracking —
 * serious and businesslike, and already part of the site's font stack.
 * Its baseline sits on the same ground line as the towers.
 *
 *   <Logo />         — combined lockup (icon left, PULSE to its right)
 *   <LogoMark />     — icon only, square
 *   <LogoWordmark /> — text only
 *
 * All variants render on transparent backgrounds and force LTR so the
 * site's RTL context doesn't flip text coordinates.
 */

const INK = '#1c1917';
const BRASS = '#a16207';

const TOWER_PATHS = (
  <g fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Left tower — short, crown slants up to the right */}
    <path d="M8 90 L8 58 L24 50 L24 90" />
    {/* Center tower — tallest, diagonal rising to a sharp top-right peak */}
    <path d="M32 90 L32 28 L52 6 L52 90" />
    {/* Right tower — medium, crown slants down to the right */}
    <path d="M58 90 L58 34 L76 44 L76 90" />

    {/* Slanted window dashes — rising gently to the right, like the sketch */}
    <g strokeWidth="1.5">
      {/* Left tower */}
      <line x1="11" y1="64" x2="21" y2="61" />
      <line x1="11" y1="70" x2="21" y2="67" />
      <line x1="11" y1="76" x2="21" y2="73" />
      <line x1="11" y1="82" x2="21" y2="79" />
      {/* Center tower */}
      <line x1="35" y1="34" x2="49" y2="30" />
      <line x1="35" y1="41" x2="49" y2="37" />
      <line x1="35" y1="48" x2="49" y2="44" />
      <line x1="35" y1="55" x2="49" y2="51" />
      <line x1="35" y1="62" x2="49" y2="58" />
      <line x1="35" y1="69" x2="49" y2="65" />
      <line x1="35" y1="76" x2="49" y2="72" />
      <line x1="35" y1="83" x2="49" y2="79" />
      {/* Right tower */}
      <line x1="61" y1="50" x2="73" y2="47" />
      <line x1="61" y1="57" x2="73" y2="54" />
      <line x1="61" y1="64" x2="73" y2="61" />
      <line x1="61" y1="71" x2="73" y2="68" />
      <line x1="61" y1="78" x2="73" y2="75" />
      <line x1="61" y1="84" x2="73" y2="81" />
    </g>
  </g>
);

/**
 * Ground line + a single refined ECG blip just past the towers —
 * small dip, one sharp narrow spike, slight undershoot, settle.
 * Brass, so the pulse reads as the brand's heartbeat without shouting.
 */
const PULSE_PATH = (
  <path
    d="M2 90 L78 90 L81 93 L85 68 L89 97 L92 90 L98 90"
    fill="none"
    stroke={BRASS}
    strokeWidth="2.4"
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

/** Icon only — three slant-crowned towers on a pulsing ground line. */
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

/** "PULSE" wordmark — Inter Medium, all-caps, open tracking. */
export function LogoWordmark({ className = '', title = 'PULSE', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 230 80"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      <text
        x="0"
        y="58"
        fontFamily={WORDMARK_FONT}
        fontSize="46"
        fontWeight="500"
        fill={INK}
        letterSpacing="6"
      >
        PULSE
      </text>
    </svg>
  );
}

/**
 * Full lockup — icon on the left, PULSE to its right, both standing on
 * the same ground line (the wordmark's baseline equals the icon's
 * ground at y=90) so the composition reads as one skyline.
 */
export function Logo({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 300 100"
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
        x="112"
        y="88"
        fontFamily={WORDMARK_FONT}
        fontSize="46"
        fontWeight="500"
        fill={INK}
        letterSpacing="6"
      >
        PULSE
      </text>
    </svg>
  );
}
