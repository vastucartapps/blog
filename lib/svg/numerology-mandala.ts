// ─────────────────────────────────────────────────────────────────
// numerology-mandala.ts — locked Vedic-numerology in-body mandala.
//
// Produces the canonical 1024×1024 SVG for the secondary in-body
// figure on every numerology Life Path post. Cream parchment with
// gold corner brackets, outer ornamental ring, 24-star Lakshmi-coin
// ring, four cardinal Devanagari rim labels, an N-petal lotus
// mandala, central yantra-style triple-ring medallion, and a
// bottom Sanskrit cartouche.
//
// SVG template authored by the brand owner. This module substitutes
// the per-post fields (numeral, planet glyph, planet devanagari,
// accent colour, petal count, cartouche lines) into the locked SVG.
// ─────────────────────────────────────────────────────────────────

import { NUMEROLOGY_PLANETS, NUMEROLOGY_NUMBERS } from "./numerology-hero-card";
import { renderPlanetSymbol, type PlanetSymbolKey } from "./planet-symbols";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Build N evenly-spaced petals around the centre, first petal pointing
// straight up. Geometry matches the brand-owner's locked 6-petal
// default exactly: outer tip at radius 320, inner base at radius 110,
// shoulder bulge at radius 150.
function buildPetalRing(n: number): string {
  const step = 360 / n;
  const petals: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = i * step;
    petals.push(
      `      <g transform="rotate(${angle.toFixed(4)})">\n` +
      `        <path d="M 0 -320 C 22 -280 36 -200 30 -150 Q 22 -118 0 -110 Q -22 -118 -30 -150 C -36 -200 -22 -280 0 -320 Z"\n` +
      `              fill="var(--accent-color)" fill-opacity="0.22"\n` +
      `              stroke="url(#goldLine)" stroke-opacity="0.7" stroke-width="1.6"/>\n` +
      `        <circle cx="0" cy="-138" r="2.6" fill="#B8893E"/>\n` +
      `      </g>`,
    );
  }
  return petals.join("\n");
}

// Build the 24-star Lakshmi-coin ring at radius 410, evenly spaced.
function buildLakshmiRing(): string {
  const RADIUS = 410;
  const COUNT = 24;
  const stars: string[] = [];
  for (let i = 0; i < COUNT; i++) {
    const a = (i / COUNT) * Math.PI * 2 - Math.PI / 2;
    const x = (512 + Math.cos(a) * RADIUS).toFixed(2);
    const y = (512 + Math.sin(a) * RADIUS).toFixed(2);
    stars.push(`    <use href="#lakshmi-star" transform="translate(${x} ${y})"/>`);
  }
  return stars.join("\n");
}

export interface NumerologyMandalaData {
  /** Life Path number 1..9. */
  number: number;
}

export function buildNumerologyMandalaSvg(
  data: NumerologyMandalaData,
): string {
  const numberMeta = NUMEROLOGY_NUMBERS[data.number];
  if (!numberMeta) {
    throw new Error(`Unknown numerology number (must be 1..9): ${data.number}`);
  }
  const planet = NUMEROLOGY_PLANETS[numberMeta.planet];
  const accent = planet.accent;
  const N = data.number;
  const petalRing = buildPetalRing(N);
  const lakshmiRing = buildLakshmiRing();
  const planetKey = numberMeta.planet as PlanetSymbolKey;
  // Mandala-crest planet glyph: ~40px equivalent on a 32-radius
  // dark teal disc inside the central yantra.
  const planetGlyph = renderPlanetSymbol(planetKey, {
    color: accent,
    strokeWidth: 2.6,
    transform: "scale(0.62)",
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" role="img" aria-label="Vedic numerology Life Path ${N} mandala">
  <defs>
    <radialGradient id="bgCream" cx="0.5" cy="0.5" r="0.72">
      <stop offset="0%" stop-color="#FBF6E8"/>
      <stop offset="100%" stop-color="#ECE0C5"/>
    </radialGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8B6420"/>
      <stop offset="50%" stop-color="#D9B76A"/>
      <stop offset="100%" stop-color="#8B6420"/>
    </linearGradient>
    <linearGradient id="goldLineH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8B6420"/>
      <stop offset="50%" stop-color="#D9B76A"/>
      <stop offset="100%" stop-color="#8B6420"/>
    </linearGradient>
    <path id="lakshmi-star" d="M 0 -3 L 1 -1 L 3 0 L 1 1 L 0 3 L -1 1 L -3 0 L -1 -1 Z" fill="#D9B76A"/>
    <style>
      svg { --accent-color: ${accent}; }
    </style>
  </defs>

  <rect x="0" y="0" width="1024" height="1024" fill="url(#bgCream)"/>

  <g fill="#7D5519" opacity="0.45">
    <circle cx="64"  cy="156"  r="1.4"/>
    <circle cx="958" cy="208"  r="1.9"/>
    <circle cx="78"  cy="492"  r="1.2"/>
    <circle cx="978" cy="556"  r="2.1"/>
    <circle cx="56"  cy="804"  r="1.6"/>
    <circle cx="952" cy="848"  r="1.5"/>
    <circle cx="180" cy="62"   r="1.3"/>
    <circle cx="850" cy="982"  r="2.3"/>
  </g>

  <g stroke="#B8893E" stroke-width="1" opacity="0.55" fill="none" stroke-linecap="square">
    <path d="M 70 36 L 36 36 L 36 70"/>
    <path d="M 954 36 L 988 36 L 988 70"/>
    <path d="M 70 988 L 36 988 L 36 954"/>
    <path d="M 954 988 L 988 988 L 988 954"/>
  </g>

  <text x="512" y="80" text-anchor="middle"
        font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="11" letter-spacing="4" font-weight="500"
        fill="#7D5519">VEDIC NUMEROLOGY · LIFE PATH MANDALA</text>

  <g transform="translate(512 512)">

    <circle r="440" fill="none" stroke="#B8893E" stroke-width="0.8" opacity="0.5"/>

    <g font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="24" fill="#7D5519" text-anchor="middle">
      <text id="rim-text-1" x="0"    y="-368">${escapeXml(planet.devanagari)}</text>
      <text id="rim-text-2" x="380"  y="9"   >${escapeXml(planet.devanagari)}</text>
      <text id="rim-text-3" x="0"    y="396" >${escapeXml(planet.devanagari)}</text>
      <text id="rim-text-4" x="-380" y="9"   >${escapeXml(planet.devanagari)}</text>
    </g>

    <g id="petal-ring-slot">
${petalRing}
    </g>

    <g transform="translate(0 -132)">
      <circle r="32" fill="#012E34" stroke="url(#goldLine)" stroke-width="1.4"/>
      <g id="planet-glyph-slot">${planetGlyph}</g>
    </g>

    <circle r="100" fill="#FBF6E8" stroke="url(#goldLine)" stroke-width="3"/>
    <circle r="88"  fill="none"
            stroke="var(--accent-color)" stroke-opacity="0.5" stroke-width="1.6"/>
    <circle r="70"  fill="#FBF6E8" stroke="#B8893E" stroke-width="0.8" stroke-opacity="0.4"/>

    <text id="numeral-slot" x="0" y="60"
          text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-style="italic" font-weight="700" font-size="180"
          fill="var(--accent-color)">${N}</text>
  </g>

  <g>
${lakshmiRing}
  </g>

  <g transform="translate(512 880)">
    <rect x="-160" y="-30" width="320" height="60" rx="3" ry="3"
          fill="#FBF6E8" stroke="url(#goldLine)" stroke-width="1.6"/>
    <rect x="-154" y="-24" width="308" height="48" rx="2" ry="2"
          fill="none" stroke="#B8893E" stroke-width="0.5" opacity="0.55"/>
    <line x1="-176" y1="0" x2="-162" y2="0" stroke="#B8893E" stroke-width="0.8" opacity="0.7"/>
    <line x1="162"  y1="0" x2="176"  y2="0" stroke="#B8893E" stroke-width="0.8" opacity="0.7"/>
    <circle cx="-180" cy="0" r="1.5" fill="#B8893E" opacity="0.7"/>
    <circle cx="180"  cy="0" r="1.5" fill="#B8893E" opacity="0.7"/>
  </g>
  <text id="cartouche-line-1" x="512" y="872"
        text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="22"
        fill="#7D5519">Aṅka ${N}</text>
  <text id="cartouche-line-2" x="512" y="900"
        text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="16"
        fill="#7D5519">${escapeXml(planet.sanskrit)} · ${escapeXml(planet.english)}</text>
</svg>
`;
}
