import React from 'react';

/**
 * Pulse brand mark — single thin-line modernist building with a teal ECG
 * pulse running along its base. Inline SVG so it inherits the page's
 * font for the wordmark variant.
 *
 *   <Logo />         — combined lockup (icon + wordmark), text-dominant
 *   <LogoMark />     — icon only, square
 *   <LogoWordmark /> — text only
 *
 * All three render on transparent backgrounds. Wordmark uses Inter
 * (loaded globally by the marketing app) at weight 600 with tight
 * tracking — substituted gracefully by system-ui in fallback contexts.
 */

const NAVY = '#1e3a5f';
const TEAL = '#2dd4bf';

const PULSE_PATH =
  'M2 92 L26 92 L32 92 L38 84 L44 104 L52 72 L60 102 L66 84 L72 92 L98 92';

interface BaseProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  title?: string;
}

/** Single thin-line tower + teal pulse along its foundation. */
export function LogoMark({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 100 110"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      <g
        fill="none"
        stroke={NAVY}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Tower body */}
        <path d="M34 22 L34 86 L66 86 L66 22 Z" strokeWidth="3" />
        {/* Antenna */}
        <line x1="50" y1="22" x2="50" y2="8" strokeWidth="2" />
        {/* Floor dividers */}
        <line x1="34" y1="42" x2="66" y2="42" strokeWidth="1.6" />
        <line x1="34" y1="62" x2="66" y2="62" strokeWidth="1.6" />
        {/* Vertical mullion */}
        <line x1="50" y1="24" x2="50" y2="86" strokeWidth="1.4" />
      </g>
      {/* ECG pulse along the foundation */}
      <path
        d={PULSE_PATH}
        fill="none"
        stroke={TEAL}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "Pulse" wordmark — inline so it inherits Inter from the page. */
export function LogoWordmark({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 260 88"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      <text
        x="0"
        y="72"
        fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="84"
        fontWeight="600"
        fill={NAVY}
        letterSpacing="-2.5"
      >
        Pulse
      </text>
    </svg>
  );
}

/**
 * Combined lockup. Text-dominant: the icon takes ~22% of the lockup
 * width while the wordmark fills the rest — addresses the previous
 * version where the icon felt too heavy next to the text.
 */
export function Logo({ className = '', title = 'Pulse', ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 360 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...rest}
      style={{ direction: 'ltr', ...(rest.style ?? {}) }}
    >
      {/* Mark — scaled to ~70x77 in the lockup */}
      <g transform="translate(0, 8) scale(0.7)">
        <g
          fill="none"
          stroke={NAVY}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M34 22 L34 86 L66 86 L66 22 Z" strokeWidth="3" />
          <line x1="50" y1="22" x2="50" y2="8" strokeWidth="2" />
          <line x1="34" y1="42" x2="66" y2="42" strokeWidth="1.6" />
          <line x1="34" y1="62" x2="66" y2="62" strokeWidth="1.6" />
          <line x1="50" y1="24" x2="50" y2="86" strokeWidth="1.4" />
        </g>
        <path
          d={PULSE_PATH}
          fill="none"
          stroke={TEAL}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* Wordmark — sized to dominate */}
      <text
        x="84"
        y="78"
        fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="84"
        fontWeight="600"
        fill={NAVY}
        letterSpacing="-2.5"
      >
        Pulse
      </text>
    </svg>
  );
}
