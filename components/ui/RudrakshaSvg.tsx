import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  mukhi: number;
  size?: number;
}

// Rudraksha SVG: textured brown bead with mukhi line cuts.
// The number of vertical cuts on the bead corresponds to the mukhi count
// (capped at 14 visible cuts for legibility).

export function RudrakshaSvg({ mukhi, size = 96, ...rest }: Props) {
  const visibleCuts = Math.min(mukhi, 14);
  const cuts = [];
  for (let i = 0; i < visibleCuts; i++) {
    const angle = (i / visibleCuts) * Math.PI * 2;
    cuts.push({
      x1: 50 + Math.cos(angle) * 12,
      y1: 50 + Math.sin(angle) * 12,
      x2: 50 + Math.cos(angle) * 38,
      y2: 50 + Math.sin(angle) * 38,
    });
  }
  // Surface bumps (random-ish but stable per render)
  const bumps = [
    { cx: 38, cy: 38, r: 1.5 },
    { cx: 62, cy: 35, r: 1.2 },
    { cx: 70, cy: 55, r: 1.4 },
    { cx: 55, cy: 70, r: 1.3 },
    { cx: 32, cy: 60, r: 1.1 },
    { cx: 45, cy: 28, r: 1.0 },
    { cx: 65, cy: 65, r: 1.0 },
    { cx: 30, cy: 48, r: 1.2 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      {...rest}
    >
      <defs>
        <radialGradient
          id={`rudra-grad-${mukhi}`}
          cx="35%"
          cy="32%"
          r="78%"
        >
          <stop offset="0%" stopColor="#c9806c" />
          <stop offset="35%" stopColor="#8a4534" />
          <stop offset="70%" stopColor="#5e2718" />
          <stop offset="100%" stopColor="#3a160c" />
        </radialGradient>
        <radialGradient
          id={`rudra-shine-${mukhi}`}
          cx="32%"
          cy="28%"
          r="40%"
        >
          <stop offset="0%" stopColor="rgba(255,220,200,0.55)" />
          <stop offset="100%" stopColor="rgba(255,220,200,0)" />
        </radialGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse
        cx="50"
        cy="92"
        rx="32"
        ry="4"
        fill="rgba(0,0,0,0.30)"
      />

      {/* Bead body */}
      <circle cx="50" cy="50" r="42" fill={`url(#rudra-grad-${mukhi})`} />

      {/* Mukhi line cuts radiating from centre */}
      {cuts.map((c, i) => (
        <line
          key={i}
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke="rgba(40,18,8,0.85)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Outer ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="rgba(40,18,8,0.55)"
        strokeWidth="1.2"
      />

      {/* Surface texture bumps */}
      {bumps.map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill="rgba(40,18,8,0.40)"
        />
      ))}

      {/* Highlight gloss */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill={`url(#rudra-shine-${mukhi})`}
      />

      {/* Mukhi count badge */}
      <g>
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="rgba(0,0,0,0.55)"
          stroke="rgba(245,166,35,0.55)"
          strokeWidth="1"
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontFamily="Playfair Display, serif"
          fontSize="14"
          fontWeight="700"
          fill="#f5a623"
        >
          {mukhi}
        </text>
      </g>
    </svg>
  );
}
