'use client';
import { useEffect, useState } from 'react';

/**
 * Editorial architectural drawing of a residential building.
 *
 * Hand-built SVG (no stock illustrations). Style: thin-line technical
 * drawing on cream paper, with a small set of "live" activity markers
 * that fade in to suggest the building has data flowing through it —
 * subtle, not animated-for-the-sake-of-it.
 *
 * Designed to live in the hero. Aspect ratio ~ 4:5 portrait so it sits
 * tall next to the editorial headline.
 */
export function BuildingDrawing() {
  // Tiny pulse — we don't animate everything, just a single brass dot
  // moving through the timeline at the bottom. Subtle, not glitter.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => (x + 1) % 4), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <svg
      viewBox="0 0 520 640"
      role="img"
      aria-label="שרטוט חזית בניין מגורים עם נקודות נתונים חיות"
      className="h-full w-full"
    >
      <defs>
        <pattern id="paper-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(11,22,35,0.05)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="window-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9c184" stopOpacity="0.95" />
          <stop offset="1" stopColor="#b88747" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Faint grid */}
      <rect width="520" height="640" fill="url(#paper-grid)" />

      {/* Ground line */}
      <line x1="20" y1="590" x2="500" y2="590" stroke="#0b1623" strokeWidth="1.2" />
      <line x1="20" y1="595" x2="500" y2="595" stroke="#0b1623" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* Title block (engineering drawing aesthetic) */}
      <g transform="translate(20, 22)">
        <rect width="280" height="36" fill="none" stroke="#0b1623" strokeWidth="0.8" />
        <text x="14" y="18" fontFamily="'IBM Plex Sans', monospace" fontSize="10" fill="#0b1623" letterSpacing="0.12em">
          BUILDING_104 · TLV
        </text>
        <text x="14" y="30" fontFamily="'IBM Plex Sans', monospace" fontSize="8" fill="#0b1623" opacity="0.55" letterSpacing="0.1em">
          ELEVATION · SCALE 1:200 · DWG 4
        </text>
      </g>

      {/* Dimension indicator on right */}
      <g stroke="#0b1623" strokeWidth="0.6" fill="none">
        <line x1="476" y1="60" x2="476" y2="590" />
        <line x1="470" y1="60" x2="482" y2="60" />
        <line x1="470" y1="590" x2="482" y2="590" />
      </g>
      <text x="486" y="320" fontFamily="'IBM Plex Sans', monospace" fontSize="9" fill="#0b1623" letterSpacing="0.1em">
        H 18.2m
      </text>

      {/* Building outline */}
      <g stroke="#0b1623" fill="none" strokeWidth="1.3">
        <rect x="80" y="60" width="360" height="530" />
        {/* Floor lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="80" y1={60 + (530 / 6) * (i + 1)} x2="440" y2={60 + (530 / 6) * (i + 1)} />
        ))}
        {/* Vertical columns */}
        <line x1="200" y1="60" x2="200" y2="590" />
        <line x1="320" y1="60" x2="320" y2="590" />
      </g>

      {/* Floor labels on left */}
      {[6, 5, 4, 3, 2, 1].map((floor, idx) => (
        <text
          key={floor}
          x="60"
          y={60 + (530 / 6) * (idx + 0.55)}
          fontFamily="'IBM Plex Sans', monospace"
          fontSize="9"
          fill="#0b1623"
          opacity="0.6"
          textAnchor="end"
        >
          F{String(floor).padStart(2, '0')}
        </text>
      ))}

      {/* Windows — small rectangles inside each cell */}
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => {
          const x = 80 + 120 * col + 22;
          const y = 60 + (530 / 6) * row + 12;
          const w = 76;
          const h = 36;
          const idx = row * 3 + col;
          // A few highlighted apartments — feels alive but restrained
          const lit = [2, 4, 7, 11, 13, 16].includes(idx);
          return (
            <g key={`${row}-${col}`}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={lit ? 'url(#window-glow)' : 'rgba(11,22,35,0.04)'}
                stroke="#0b1623"
                strokeWidth="0.8"
              />
              {/* Mullion */}
              <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#0b1623" strokeWidth="0.4" />
            </g>
          );
        }),
      )}

      {/* Entrance */}
      <g>
        <rect x="220" y="540" width="80" height="50" fill="#fbf8f3" stroke="#0b1623" strokeWidth="1.2" />
        <line x1="260" y1="540" x2="260" y2="590" stroke="#0b1623" strokeWidth="0.6" />
        <circle cx="252" cy="568" r="1.4" fill="#0b1623" />
        <circle cx="268" cy="568" r="1.4" fill="#0b1623" />
      </g>

      {/* Rooftop antenna / utility detail */}
      <line x1="180" y1="60" x2="180" y2="38" stroke="#0b1623" strokeWidth="0.8" />
      <line x1="340" y1="60" x2="340" y2="46" stroke="#0b1623" strokeWidth="0.8" />
      <line x1="172" y1="44" x2="188" y2="44" stroke="#0b1623" strokeWidth="0.6" />

      {/* Data callout 1 — payment captured */}
      <g transform="translate(330, 138)">
        <line x1="-104" y1="20" x2="-12" y2="20" stroke="#b08850" strokeWidth="0.8" strokeDasharray="2 3" />
        <circle cx="-104" cy="20" r="3" fill="#b08850" />
        <rect width="180" height="44" fill="#fbf8f3" stroke="#0b1623" strokeWidth="0.8" />
        <text x="10" y="16" fontFamily="'IBM Plex Sans', monospace" fontSize="9" fill="#0b1623" letterSpacing="0.08em" opacity="0.65">
          14:22 · APT 4B
        </text>
        <text x="10" y="34" fontFamily="'Frank Ruhl Libre', serif" fontSize="14" fill="#0b1623" fontWeight="500">
          ועד מאי — שולם
        </text>
      </g>

      {/* Data callout 2 — ticket */}
      <g transform="translate(330, 300)">
        <line x1="-228" y1="20" x2="-12" y2="20" stroke="#ce6a3d" strokeWidth="0.8" strokeDasharray="2 3" />
        <circle cx="-228" cy="20" r="3" fill="#ce6a3d" />
        <rect width="190" height="44" fill="#fbf8f3" stroke="#0b1623" strokeWidth="0.8" />
        <text x="10" y="16" fontFamily="'IBM Plex Sans', monospace" fontSize="9" fill="#0b1623" letterSpacing="0.08em" opacity="0.65">
          11:08 · APT 3A
        </text>
        <text x="10" y="34" fontFamily="'Frank Ruhl Libre', serif" fontSize="14" fill="#0b1623" fontWeight="500">
          פנייה: נזילה במטבח
        </text>
      </g>

      {/* Data callout 3 — gate */}
      <g transform="translate(330, 470)">
        <line x1="-140" y1="20" x2="-12" y2="20" stroke="#4f6f52" strokeWidth="0.8" strokeDasharray="2 3" />
        <circle cx="-140" cy="20" r="3" fill="#4f6f52" />
        <rect width="170" height="44" fill="#fbf8f3" stroke="#0b1623" strokeWidth="0.8" />
        <text x="10" y="16" fontFamily="'IBM Plex Sans', monospace" fontSize="9" fill="#0b1623" letterSpacing="0.08em" opacity="0.65">
          09:47 · GATE A
        </text>
        <text x="10" y="34" fontFamily="'Frank Ruhl Libre', serif" fontSize="14" fill="#0b1623" fontWeight="500">
          שער חניה נפתח
        </text>
      </g>

      {/* Tiny pulsing dot on the activity timeline */}
      <g transform="translate(40, 612)">
        <line x1="0" y1="0" x2="440" y2="0" stroke="#0b1623" strokeWidth="0.6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <circle
            key={i}
            cx={110 * i + 10}
            cy={0}
            r={i === tick ? 3.5 : 1.6}
            fill={i === tick ? '#b08850' : '#0b1623'}
            opacity={i === tick ? 1 : 0.4}
          />
        ))}
        <text x="0" y="16" fontFamily="'IBM Plex Sans', monospace" fontSize="8" fill="#0b1623" opacity="0.55" letterSpacing="0.1em">
          LIVE FEED · 24 EVENTS / HR
        </text>
      </g>
    </svg>
  );
}
