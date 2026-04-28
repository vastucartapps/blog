// ─────────────────────────────────────────────────────────────────
// numerology-hero-card.ts — locked Vedic-numerology hero card.
//
// Produces the canonical 1060×1048 SVG for every numerology Life Path
// post. Two-panel teal+cream layout. Left panel: numeral, archetype,
// ruling-planet line, twin medallions (numeral + planet glyph) and a
// KEY TRAITS list. Right panel: aṅka mandala with an N-petal lotus
// (N = the life path number) around the central numeral, with the
// ruling-planet glyph crest above.
//
// SVG template authored by the brand owner. This module substitutes
// the per-post fields (numeral, archetype, planet line, glyph, accent
// colour, traits, mandala N, mandala caption) into the locked SVG.
// ─────────────────────────────────────────────────────────────────

interface NumerologyPlanetMeta {
  /** Sanskrit name with diacritics, used in body text and mandala caption. */
  sanskrit: string;
  /** Devanagari name printed inside the mandala banner ring. */
  devanagari: string;
  /** English name used in the planet-line and the mandala caption. */
  english: string;
  /** Single-glyph Unicode astrological symbol for the medallion. */
  glyph: string;
  /** Brand accent colour driving --accent-color across the SVG. */
  accent: string;
}

interface NumerologyNumberMeta {
  /** Ruling planet key, indexes into PLANETS. */
  planet: keyof typeof PLANETS;
  /** Romanised Sanskrit number name (e.g. "Eka", "Ṣaṭ"). */
  sanskritName: string;
  /** Archetype phrase printed under the giant numeral on the left. */
  archetype: string;
}

const PLANETS = {
  surya:   { sanskrit: "Sūrya",   devanagari: "सूर्य",  english: "Sun",     glyph: "☉", accent: "#F2A04C" },
  chandra: { sanskrit: "Chandra", devanagari: "चन्द्र", english: "Moon",    glyph: "☽", accent: "#E8E5D4" },
  guru:    { sanskrit: "Guru",    devanagari: "गुरु",   english: "Jupiter", glyph: "♃", accent: "#F4B942" },
  rahu:    { sanskrit: "Rāhu",    devanagari: "राहु",   english: "Rahu",    glyph: "☊", accent: "#9B7CB7" },
  budha:   { sanskrit: "Budha",   devanagari: "बुध",   english: "Mercury", glyph: "☿", accent: "#7CC8A5" },
  shukra:  { sanskrit: "Śukra",   devanagari: "शुक्र", english: "Venus",   glyph: "♀", accent: "#F2C8D8" },
  ketu:    { sanskrit: "Ketu",    devanagari: "केतु",   english: "Ketu",    glyph: "☋", accent: "#C5A88A" },
  shani:   { sanskrit: "Śani",    devanagari: "शनि",   english: "Saturn",  glyph: "♄", accent: "#9DA8AC" },
  mangal:  { sanskrit: "Maṅgala", devanagari: "मङ्गल", english: "Mars",    glyph: "♂", accent: "#E97A2B" },
} as const satisfies Record<string, NumerologyPlanetMeta>;

const NUMBERS: Record<number, NumerologyNumberMeta> = {
  1: { planet: "surya",   sanskritName: "Eka",   archetype: "the Originator"   },
  2: { planet: "chandra", sanskritName: "Dvi",   archetype: "the Diplomat"     },
  3: { planet: "guru",    sanskritName: "Tri",   archetype: "the Teacher"      },
  4: { planet: "rahu",    sanskritName: "Catur", archetype: "the Disruptor"    },
  5: { planet: "budha",   sanskritName: "Pañca", archetype: "the Communicator" },
  6: { planet: "shukra",  sanskritName: "Ṣaṭ",   archetype: "the Harmonizer"   },
  7: { planet: "ketu",    sanskritName: "Sapta", archetype: "the Mystic"       },
  8: { planet: "shani",   sanskritName: "Aṣṭa",  archetype: "the Architect"    },
  9: { planet: "mangal",  sanskritName: "Nava",  archetype: "the Warrior"      },
};

type PlanetId = keyof typeof PLANETS;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Build N evenly-spaced petals around the centre, first petal pointing
// straight up. Inner tip at radius 86, outer tip at radius 166. Geometry
// matches the master template's 6-petal default exactly.
function buildPetalRing(n: number): string {
  const step = 360 / n;
  const petals: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = i * step;
    petals.push(
      `      <g transform="rotate(${angle.toFixed(4)})">\n` +
      `        <path d="M 0 -86 Q 16 -126 0 -166 Q -16 -126 0 -86 Z"\n` +
      `              fill="var(--accent-color)" fill-opacity="0.18"\n` +
      `              stroke="var(--accent-color)" stroke-opacity="0.55" stroke-width="1.4"/>\n` +
      `      </g>`,
    );
  }
  return petals.join("\n");
}

// Wrap a long trait into at most two lines of ~50 chars for the
// KEY TRAITS panel. Returns the inner <text> elements for one block.
function buildTraitText(text: string): string {
  const MAX = 50;
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const candidate = cur ? cur + " " + w : w;
    if (candidate.length <= MAX) {
      cur = candidate;
    } else if (cur === "") {
      lines.push(w);
      cur = "";
    } else {
      lines.push(cur);
      cur = w;
    }
    if (lines.length >= 2) break;
  }
  if (cur && lines.length < 2) lines.push(cur);
  if (lines.length === 0) lines.push("");
  return lines
    .map(
      (line, i) =>
        `    <text x="26" y="${i * 21}" font-family="Georgia, 'Times New Roman', serif" font-size="16" fill="#F2EAD3">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

export interface NumerologyHeroCardData {
  /** Life Path number 1..9. */
  number: number;
  /** Up to 5 short trait strings. Each wraps to 2 lines max. */
  key_traits: string[];
}

export function buildNumerologyHeroCardSvg(
  data: NumerologyHeroCardData,
): string {
  const numberMeta = NUMBERS[data.number];
  if (!numberMeta) {
    throw new Error(`Unknown numerology number (must be 1..9): ${data.number}`);
  }
  const planet = PLANETS[numberMeta.planet];

  const traits = (data.key_traits ?? []).slice(0, 5);
  while (traits.length < 5) traits.push("");

  // Trait y-coordinates match the master template exactly.
  const traitYs = [740, 794, 848, 902, 956];
  const traitGroups = traits
    .map(
      (t, i) =>
        `  <g id="trait-${i + 1}-slot" transform="translate(60 ${traitYs[i]})">\n` +
        `    <text x="0" y="-2" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="#F2A04C">✦</text>\n` +
        buildTraitText(t) +
        `\n  </g>`,
    )
    .join("\n");

  const petalRing = buildPetalRing(data.number);
  const accent = planet.accent;
  const N = data.number;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 1048" width="1060" height="1048" role="img" aria-label="Vedic numerology Life Path ${N} hero card">
  <defs>
    <linearGradient id="bgTeal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#02545E"/>
      <stop offset="55%" stop-color="#013F47"/>
      <stop offset="100%" stop-color="#012F36"/>
    </linearGradient>
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
    <style>
      svg { --accent-color: ${accent}; }
    </style>
  </defs>

  <!-- ===================== LEFT PANEL: deep teal ===================== -->
  <rect x="0" y="0" width="530" height="1048" fill="url(#bgTeal)"/>

  <g fill="#D9B76A" opacity="0.15">
    <circle cx="78"  cy="170"  r="1.2"/>
    <circle cx="448" cy="108"  r="1.5"/>
    <circle cx="382" cy="252"  r="0.9"/>
    <circle cx="492" cy="436"  r="1.3"/>
    <circle cx="42"  cy="540"  r="1.1"/>
    <circle cx="468" cy="780"  r="1.4"/>
    <circle cx="48"  cy="884"  r="0.8"/>
    <circle cx="420" cy="968"  r="1.2"/>
  </g>

  <g transform="translate(60 88)">
    <line x1="0" y1="0" x2="124" y2="0" stroke="url(#goldLineH)" stroke-width="1.4"/>
    <circle cx="62" cy="0" r="2.6" fill="#D9B76A"/>
  </g>

  <text id="eyebrow-slot" x="60" y="124"
        font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="12" letter-spacing="3.6" font-weight="500"
        fill="#E0BF7C">LIFE PATH NUMBER</text>

  <text id="numeral-slot" x="60" y="232"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="92" font-weight="500"
        fill="var(--accent-color)">${N}</text>

  <text id="archetype-slot" x="60" y="306"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="44" font-weight="400"
        fill="#F2EAD3">${escapeXml(numberMeta.archetype)}</text>

  <text id="planet-line-slot" x="60" y="354"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="22" letter-spacing="0.5"
        fill="#E0BF7C">ruled by ${escapeXml(planet.sanskrit)} (${escapeXml(planet.english)})</text>

  <line x1="60" y1="396" x2="146" y2="396" stroke="#B8893E" stroke-width="2"/>

  <g transform="translate(130 588)">
    <circle r="66" fill="#FBF6E8" stroke="url(#goldLine)" stroke-width="2.2"/>
    <text id="numeral-medallion-slot" x="0" y="24"
          text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-weight="700" font-size="78"
          fill="var(--accent-color)">${N}</text>
  </g>
  <text id="number-name-slot" x="130" y="688"
        text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="20"
        fill="#F2EAD3">${escapeXml(numberMeta.sanskritName)}</text>

  <g transform="translate(265 588)">
    <line x1="-77" y1="0" x2="-15" y2="0" stroke="#B8893E" stroke-width="1.2"/>
    <line x1="15"  y1="0" x2="77"  y2="0" stroke="#B8893E" stroke-width="1.2"/>
    <text x="0" y="7" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-style="italic" font-size="22"
          fill="#F2EAD3">in</text>
  </g>

  <g transform="translate(400 588)">
    <circle r="66" fill="#012E34" stroke="url(#goldLine)" stroke-width="2.2"/>
    <circle r="58" fill="none"
            stroke="var(--accent-color)" stroke-opacity="0.45"
            stroke-width="1"/>
    <text id="planet-glyph-slot" x="0" y="22"
          text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="78"
          fill="var(--accent-color)">${planet.glyph}</text>
  </g>
  <text id="planet-name-slot" x="400" y="688"
        text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="20"
        fill="#F2EAD3">${escapeXml(planet.sanskrit)}</text>

  <g transform="translate(60 700)">
    <text font-family="'Helvetica Neue', Arial, sans-serif"
          font-size="12" letter-spacing="3.4"
          fill="#E0BF7C">KEY TRAITS</text>
    <line x1="0" y1="14" x2="56" y2="14" stroke="#B8893E" stroke-width="1.5"/>
  </g>

${traitGroups}

  <g transform="translate(60 1014)">
    <line x1="0" y1="0" x2="40" y2="0" stroke="#B8893E" stroke-width="1.2"/>
    <text x="50" y="5"
          font-family="Georgia, 'Times New Roman', serif"
          font-style="italic" font-size="13"
          fill="#F2EAD3">Vedic Numerology · Aṅka Series</text>
  </g>

  <!-- ===================== RIGHT PANEL: cream parchment ===================== -->
  <rect x="530" y="0" width="530" height="1048" fill="url(#bgCream)"/>

  <g fill="#7D5519" opacity="0.45">
    <circle cx="612" cy="128"  r="1.5"/>
    <circle cx="982" cy="184"  r="1.8"/>
    <circle cx="582" cy="384"  r="1.3"/>
    <circle cx="1012" cy="442" r="2.1"/>
    <circle cx="600" cy="704"  r="1.6"/>
    <circle cx="990" cy="762"  r="1.4"/>
    <circle cx="640" cy="932"  r="2.3"/>
    <circle cx="970" cy="990"  r="1.2"/>
  </g>

  <g stroke="#B8893E" stroke-width="1" opacity="0.55" fill="none" stroke-linecap="square">
    <path d="M 590 50 L 560 50 L 560 80"/>
    <path d="M 1000 50 L 1030 50 L 1030 80"/>
    <path d="M 590 998 L 560 998 L 560 968"/>
    <path d="M 1000 998 L 1030 998 L 1030 968"/>
  </g>

  <g transform="translate(795 524)">
    <circle r="268" fill="none" stroke="url(#goldLine)" stroke-width="1.6" opacity="0.55"/>

    <g fill="#B8893E" opacity="0.7">
      <circle cx="0"        cy="-240"    r="1.6"/>
      <circle cx="120"      cy="-207.85" r="1.6"/>
      <circle cx="207.85"   cy="-120"    r="1.6"/>
      <circle cx="240"      cy="0"       r="1.6"/>
      <circle cx="207.85"   cy="120"     r="1.6"/>
      <circle cx="120"      cy="207.85"  r="1.6"/>
      <circle cx="0"        cy="240"     r="1.6"/>
      <circle cx="-120"     cy="207.85"  r="1.6"/>
      <circle cx="-207.85"  cy="120"     r="1.6"/>
      <circle cx="-240"     cy="0"       r="1.6"/>
      <circle cx="-207.85"  cy="-120"    r="1.6"/>
      <circle cx="-120"     cy="-207.85" r="1.6"/>
    </g>
    <text id="planet-sanskrit-slot" x="0" y="-244"
          text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-style="italic" font-size="12"
          fill="#7D5519">${escapeXml(planet.devanagari)}</text>

    <g id="petal-ring-slot">
${petalRing}
    </g>

    <g transform="translate(0 -144)">
      <circle r="28" fill="#012E34" stroke="url(#goldLine)" stroke-width="1.2"/>
      <text id="mandala-planet-glyph-slot" x="0" y="12"
            text-anchor="middle"
            font-family="Georgia, 'Times New Roman', serif"
            font-size="36"
            fill="var(--accent-color)">${planet.glyph}</text>
    </g>

    <circle r="80" fill="#FBF6E8" stroke="url(#goldLine)" stroke-width="2.4"/>
    <text id="mandala-numeral-slot" x="0" y="50"
          text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-style="italic" font-weight="700" font-size="140"
          fill="var(--accent-color)">${N}</text>
  </g>

  <text x="795" y="820"
        text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="14" letter-spacing="1.5"
        fill="#7D5519" opacity="0.7">Aṅka Mandala</text>
  <text id="mandala-caption-slot" x="795" y="843"
        text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="12" letter-spacing="2"
        fill="#7D5519">LIFE PATH ${N} · ${escapeXml(planet.sanskrit.toUpperCase())} · ${escapeXml(planet.english.toUpperCase())}</text>

  <line x1="529" y1="0" x2="529" y2="1048"
        stroke="url(#goldLine)" stroke-width="1" opacity="0.55"/>
</svg>
`;
}

export type { PlanetId };
export { PLANETS as NUMEROLOGY_PLANETS, NUMBERS as NUMEROLOGY_NUMBERS };
