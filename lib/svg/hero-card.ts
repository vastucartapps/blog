// ─────────────────────────────────────────────────────────────────
// hero-card.ts — locked Vedic-astrology hero/featured card.
//
// Produces the canonical 1060×1048 SVG for every Jyotish post:
// two-panel teal+cream layout, North Indian D-1 chart on the right
// with the highlighted house and planet marker, left panel with the
// planet name, house label, lagna label, two icon circles (lagna
// zodiac webp + planet gemstone webp), and KEY TRAITS list.
//
// One WebP rendered from this SVG serves as the post's hero,
// section image, OG image, and archives thumbnail.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { renderPlanetSymbol, type PlanetSymbolKey } from "./planet-symbols";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Planet → Sanskrit + English + glyph + accent colour.
// The PLANET circle in the hero is rendered as an inline-SVG sigil
// (large astrological glyph in the planet's accent colour, dark
// teal background, gold ring), NOT as a gemstone photograph. The
// LAGNA circle uses public/zodiac-icons/{sign}.webp, which IS the
// correct asset (zodiac sign illustration).
const PLANETS = {
  surya:   { english: "Sun",     sanskrit: "Surya",   glyph: "☉", accent: "#F2A04C" },
  chandra: { english: "Moon",    sanskrit: "Chandra", glyph: "☽", accent: "#E8E5D4" },
  mangal:  { english: "Mars",    sanskrit: "Mangala", glyph: "♂", accent: "#E97A2B" },
  budha:   { english: "Mercury", sanskrit: "Budha",   glyph: "☿", accent: "#7CC8A5" },
  guru:    { english: "Jupiter", sanskrit: "Guru",    glyph: "♃", accent: "#F4B942" },
  shukra:  { english: "Venus",   sanskrit: "Shukra",  glyph: "♀", accent: "#F2C8D8" },
  shani:   { english: "Saturn",  sanskrit: "Shani",   glyph: "♄", accent: "#9DA8AC" },
  rahu:    { english: "Rahu",    sanskrit: "Rahu",    glyph: "☊", accent: "#9B7CB7" },
  ketu:    { english: "Ketu",    sanskrit: "Ketu",    glyph: "☋", accent: "#C5A88A" },
} as const;

type PlanetId = keyof typeof PLANETS;

// Lagna sanskrit → English + sign-number (1=Aries…12=Pisces) + zodiac slug.
// `mesha` is normalised → `mesh` to match LAGNA_LABELS in lib/internal-links.
const LAGNAS = {
  mesh:       { english: "Aries",       sanskrit: "Mesh",       num: 1,  zodiac: "aries"       },
  mesha:      { english: "Aries",       sanskrit: "Mesh",       num: 1,  zodiac: "aries"       },
  vrishabha:  { english: "Taurus",      sanskrit: "Vrishabha",  num: 2,  zodiac: "taurus"      },
  mithuna:    { english: "Gemini",      sanskrit: "Mithuna",    num: 3,  zodiac: "gemini"      },
  karka:      { english: "Cancer",      sanskrit: "Karka",      num: 4,  zodiac: "cancer"      },
  simha:      { english: "Leo",         sanskrit: "Simha",      num: 5,  zodiac: "leo"         },
  kanya:      { english: "Virgo",       sanskrit: "Kanya",      num: 6,  zodiac: "virgo"       },
  tula:       { english: "Libra",       sanskrit: "Tula",       num: 7,  zodiac: "libra"       },
  vrishchika: { english: "Scorpio",     sanskrit: "Vrishchika", num: 8,  zodiac: "scorpio"     },
  dhanu:      { english: "Sagittarius", sanskrit: "Dhanu",      num: 9,  zodiac: "sagittarius" },
  makara:     { english: "Capricorn",   sanskrit: "Makara",     num: 10, zodiac: "capricorn"   },
  kumbha:     { english: "Aquarius",    sanskrit: "Kumbha",     num: 11, zodiac: "aquarius"    },
  meena:      { english: "Pisces",      sanskrit: "Meena",      num: 12, zodiac: "pisces"      },
} as const;

type LagnaId = keyof typeof LAGNAS;

const SIGN_BY_NUMBER: Record<number, string> = {
  1: "Aries",       2: "Taurus",     3: "Gemini",      4: "Cancer",
  5: "Leo",         6: "Virgo",      7: "Libra",       8: "Scorpio",
  9: "Sagittarius", 10: "Capricorn", 11: "Aquarius",  12: "Pisces",
};

const HOUSE_NUMBER_TEXT: Record<number, string> = {
  1: "First", 2: "Second", 3: "Third",   4: "Fourth",  5: "Fifth",   6: "Sixth",
  7: "Seventh", 8: "Eighth", 9: "Ninth", 10: "Tenth",  11: "Eleventh", 12: "Twelfth",
};

const HOUSE_ORDINAL: Record<number, string> = {
  1: "1ST", 2: "2ND", 3: "3RD", 4: "4TH", 5: "5TH", 6: "6TH",
  7: "7TH", 8: "8TH", 9: "9TH", 10: "10TH", 11: "11TH", 12: "12TH",
};

// 12 polygon definitions for the highlighted house in N. Indian D-1 chart.
// Coordinates are in the chart's local 340×340 frame (before scale 1.35).
// Geometry: outer square (10,10)-(330,330), inner diamond corners
// T(170,10) R(330,170) B(170,330) L(10,170), centre C(170,170), and
// 4 midpoints where the corner-to-centre diagonals cross the diamond
// sides: M_TL(90,90), M_TR(250,90), M_BR(250,250), M_BL(90,250).
//
// Houses: H1 top kite, H4 left kite, H7 bottom kite, H10 right kite
// (each a 4-vertex inner-diamond region). The other 8 are corner
// triangles. Markers placed at centroids; sign-label text placed
// where the bold sign number appears in the locked template.
interface HousePolygon {
  points: string;       // SVG polygon `points` attribute
  marker: [number, number];   // x,y for the planet marker glyph
  signLabel: [number, number]; // x,y for the bold sign-number text
}

const HOUSE: Record<number, HousePolygon> = {
  1:  { points: "170,10 250,90 170,170 90,90",     marker: [170, 90],  signLabel: [170, 44]  },
  2:  { points: "10,10 170,10 90,90",               marker: [90, 37],   signLabel: [90, 78]   },
  3:  { points: "10,10 90,90 10,170",               marker: [37, 90],   signLabel: [72, 100]  },
  4:  { points: "10,170 90,90 170,170 90,250",     marker: [90, 170],  signLabel: [42, 174]  },
  5:  { points: "10,330 10,170 90,250",             marker: [37, 250],  signLabel: [72, 260]  },
  6:  { points: "10,330 90,250 170,330",            marker: [90, 303],  signLabel: [90, 270]  },
  7:  { points: "170,330 90,250 170,170 250,250",  marker: [170, 250], signLabel: [170, 312] },
  8:  { points: "330,330 170,330 250,250",          marker: [250, 303], signLabel: [250, 270] },
  9:  { points: "330,330 250,250 330,170",          marker: [303, 250], signLabel: [270, 260] },
  10: { points: "330,170 250,250 170,170 250,90",  marker: [250, 170], signLabel: [298, 174] },
  11: { points: "330,10 330,170 250,90",            marker: [303, 90],  signLabel: [268, 100] },
  12: { points: "330,10 250,90 170,10",             marker: [250, 37],  signLabel: [250, 78]  },
};

// Pixel positions where each house-N sign number is rendered. House 1
// is always at (170,44), house 2 always at (90,78), etc. — the SAME
// 12 positions regardless of which lagna we're showing. What changes
// per lagna is WHICH sign number gets printed at each position.
const SIGN_POSITIONS: Record<number, [number, number, number]> = {
  1:  [170, 44,  13],
  2:  [90,  78,  12],
  3:  [72,  100, 12],
  4:  [42,  174, 13],
  5:  [72,  260, 12],
  6:  [90,  270, 12],
  7:  [170, 312, 13],
  8:  [250, 270, 12],
  9:  [270, 260, 13],   // technically rendered separately when bolded
  10: [298, 174, 13],
  11: [268, 100, 12],
  12: [250, 78,  12],
};

async function fileToPngDataUri(absPath: string): Promise<string> {
  // librsvg (sharp's SVG engine) cannot decode embedded WebP via
  // xlink:href, only PNG/JPEG. Always re-encode to PNG so the
  // icon circles render correctly inside the rasterised hero.
  const sharp = (await import("sharp")).default;
  const png = await sharp(fs.readFileSync(absPath)).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface HeroCardData {
  planet_id: PlanetId | string;
  lagna_id:  LagnaId  | string;
  house_number: number;
  /** Up to 5 short trait strings shown in the KEY TRAITS list. */
  key_traits: string[];
  /** Optional eyebrow override; defaults to "PLANETARY PLACEMENT". */
  eyebrow?: string;
}

export async function buildHeroCardSvg(data: HeroCardData): Promise<string> {
  const planetKey = (data.planet_id ?? "").toLowerCase() as PlanetId;
  const planet = PLANETS[planetKey];
  if (!planet) throw new Error(`Unknown planet_id: ${data.planet_id}`);

  const lagnaKey = (data.lagna_id ?? "").toLowerCase() as LagnaId;
  const lagna = LAGNAS[lagnaKey];
  if (!lagna) throw new Error(`Unknown lagna_id: ${data.lagna_id}`);

  const h = data.house_number;
  if (!HOUSE[h]) throw new Error(`Unknown house_number: ${h}`);

  const lagnaIconPath = path.join(PUBLIC_DIR, "zodiac-icons", `${lagna.zodiac}.webp`);
  const lagnaDataUri = await fileToPngDataUri(lagnaIconPath);

  // Sign number at each house = ((lagna.num - 1 + h - 1) % 12) + 1.
  // House 1 carries the lagna's sign; subsequent houses carry the next
  // signs going through the zodiac.
  const signAtHouse = (i: number) =>
    ((lagna.num - 1 + i - 1) % 12) + 1;

  const signInHouseNum = signAtHouse(h);
  const signInHouseLabel = SIGN_BY_NUMBER[signInHouseNum];

  // Sign-number text labels at the 11 non-highlighted positions.
  // The highlighted house gets its sign printed in the bold gold style
  // separately (with HOUSE[h].signLabel coords) so we skip it here.
  const signLabels = Object.entries(SIGN_POSITIONS)
    .filter(([k]) => Number(k) !== h)
    .map(([k, [x, y, fs]]) => {
      const houseI = Number(k);
      const signN = signAtHouse(houseI);
      return `      <text x="${x}" y="${y}" font-size="${fs}">${signN}</text>`;
    })
    .join("\n");

  // Bold sign label for the highlighted house.
  const [bsx, bsy] = HOUSE[h].signLabel;
  const boldSignLabel =
    `    <text x="${bsx}" y="${bsy}" font-family="Georgia, serif" font-size="14"\n` +
    `          fill="#7D5519" font-weight="700" text-anchor="middle">${signInHouseNum}</text>`;

  // Planet marker inside the highlighted house. Inline-SVG path
  // glyph (replaces Unicode astrological char that librsvg falls
  // back to a Devanagari letter for).
  const [mx, my] = HOUSE[h].marker;
  const houseMarkerGlyph = renderPlanetSymbol(planetKey as PlanetSymbolKey, {
    color: "#F2A04C",
    strokeWidth: 2.4,
    transform: "scale(0.32)",
  });
  const planetMarker =
    `    <g transform="translate(${mx}, ${my})">\n` +
    `      <circle r="16" fill="#013F47" stroke="#E0BF7C" stroke-width="1.6"/>\n` +
    `      ${houseMarkerGlyph}\n` +
    `    </g>`;

  // Highlighted house fill + outline polygons.
  const highlightFill =
    `    <polygon points="${HOUSE[h].points}" fill="#E97A2B" opacity="0.28"/>`;
  const highlightOutline =
    `    <polygon points="${HOUSE[h].points}"\n` +
    `             fill="none" stroke="#B8893E" stroke-width="2.4" opacity="0.95"/>`;

  // Asc indicator placed just above the H1 sign-number position.
  const [a1x] = SIGN_POSITIONS[1];
  const ascText =
    `    <text x="${a1x}" y="25" font-family="Georgia, serif" font-size="9"\n` +
    `          fill="#7D5519" opacity="0.95" text-anchor="middle"\n` +
    `          font-style="italic" font-weight="700" letter-spacing="1">Asc</text>`;

  // Caption beneath the chart.
  const caption =
    `${planet.english.toUpperCase()} · ${HOUSE_ORDINAL[h]} HOUSE · ${signInHouseLabel.toUpperCase()}`;

  // KEY TRAITS: word-wrap onto a second line when needed instead of
  // ellipsis-truncating. Teal panel content area runs x=60..510
  // (~450px usable). Georgia 16pt averages ~8.4px/char in the
  // text area starting at x=86, so each line fits ~50 chars.
  const TRAIT_MAX_LINE_CHARS = 50;
  const TRAIT_FONT_SIZE = 16;
  const TRAIT_LINE_HEIGHT = 21;
  const TRAIT_BLOCK_GAP = 12;
  const TRAIT_START_Y = 740;

  function wrapText(s: string, maxChars: number): string[] {
    const words = String(s ?? "").trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const candidate = cur ? cur + " " + w : w;
      if (candidate.length <= maxChars) {
        cur = candidate;
      } else if (cur === "") {
        // Single word longer than the line — push as-is.
        lines.push(w);
      } else {
        lines.push(cur);
        cur = w;
      }
      if (lines.length >= 2) break; // hard cap at 2 lines
    }
    if (cur && lines.length < 2) lines.push(cur);
    return lines.length === 0 ? [""] : lines;
  }

  const rawTraits = (data.key_traits ?? []).slice(0, 5);
  while (rawTraits.length < 5) rawTraits.push("");
  let cursor = TRAIT_START_Y;
  const traitsBlock = rawTraits
    .map((t) => {
      const lines = wrapText(t, TRAIT_MAX_LINE_CHARS);
      const startY = cursor;
      const linesXml = lines
        .map(
          (line, i) =>
            `        <text x="26" y="${i * TRAIT_LINE_HEIGHT}" font-size="${TRAIT_FONT_SIZE}">${escapeXml(line)}</text>`,
        )
        .join("\n");
      const block =
        `      <g transform="translate(0, ${startY})">\n` +
        `        <text font-size="14" fill="#F2A04C" y="-2">✦</text>\n` +
        linesXml +
        `\n      </g>`;
      cursor =
        startY + (lines.length * TRAIT_LINE_HEIGHT) + TRAIT_BLOCK_GAP;
      return block;
    })
    .join("\n");

  const eyebrow = escapeXml((data.eyebrow ?? "PLANETARY PLACEMENT").toUpperCase());
  const planetNameDisplay = escapeXml(planet.english);
  const houseLabel = `in the ${HOUSE_NUMBER_TEXT[h]} House`;
  const lagnaLabel = `for ${lagna.sanskrit} (${lagna.english}) Lagna`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="1060" height="1048" viewBox="0 0 1060 1048">
  <defs>
    <linearGradient id="bgTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#02545E"/>
      <stop offset="55%"  stop-color="#013F47"/>
      <stop offset="100%" stop-color="#012F36"/>
    </linearGradient>
    <radialGradient id="bgCream" cx="50%" cy="45%" r="65%">
      <stop offset="0%"   stop-color="#FBF6E8"/>
      <stop offset="100%" stop-color="#ECE0C5"/>
    </radialGradient>
    <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#8B6420" stop-opacity="0"/>
      <stop offset="50%"  stop-color="#D9B76A" stop-opacity="1"/>
      <stop offset="100%" stop-color="#8B6420" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="iconClipL"><circle cx="0" cy="0" r="64"/></clipPath>
    <clipPath id="iconClipR"><circle cx="0" cy="0" r="64"/></clipPath>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" in="SourceAlpha"/>
      <feOffset dy="3"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="1060" height="1048" fill="#F2EAD3"/>
  <rect x="530" y="0" width="530" height="1048" fill="url(#bgCream)"/>

  <g fill="#B8893E" opacity="0.45">
    <circle cx="610" cy="180" r="2"/>
    <circle cx="990" cy="220" r="1.6"/>
    <circle cx="640" cy="850" r="1.9"/>
    <circle cx="980" cy="900" r="2.3"/>
    <circle cx="580" cy="500" r="1.5"/>
    <circle cx="1010" cy="540" r="1.5"/>
    <circle cx="700" cy="120" r="1.2"/>
    <circle cx="900" cy="980" r="1.4"/>
  </g>

  <g stroke="#B8893E" stroke-width="1" fill="none" opacity="0.55">
    <path d="M 560 50 L 560 80 L 590 80"/>
    <path d="M 1030 50 L 1030 80 L 1000 80"/>
    <path d="M 560 998 L 560 968 L 590 968"/>
    <path d="M 1030 998 L 1030 968 L 1000 968"/>
  </g>

  <g transform="translate(566, 295) scale(1.35)" stroke-linejoin="miter">
${highlightFill}

    <rect x="10" y="10" width="320" height="320"
          fill="none" stroke="#013F47" stroke-width="1.6" opacity="0.5"/>
    <polygon points="170,10 330,170 170,330 10,170"
             fill="none" stroke="#013F47" stroke-width="1.6" opacity="0.5"/>
    <line x1="10"  y1="10"  x2="170" y2="170" stroke="#013F47" stroke-width="1.6" opacity="0.5"/>
    <line x1="330" y1="10"  x2="170" y2="170" stroke="#013F47" stroke-width="1.6" opacity="0.5"/>
    <line x1="330" y1="330" x2="170" y2="170" stroke="#013F47" stroke-width="1.6" opacity="0.5"/>
    <line x1="10"  y1="330" x2="170" y2="170" stroke="#013F47" stroke-width="1.6" opacity="0.5"/>

${highlightOutline}

    <g font-family="Georgia, 'Times New Roman', serif" fill="#013F47"
       opacity="0.6" text-anchor="middle">
${signLabels}
    </g>

${boldSignLabel}

${ascText}

${planetMarker}
  </g>

  <text x="795" y="820" font-family="Georgia, serif" font-size="14"
        fill="#013F47" text-anchor="middle" opacity="0.7"
        font-style="italic" letter-spacing="1.5">North Indian D-1 (Rāśi) Chart</text>
  <text x="795" y="843" font-family="Georgia, serif" font-size="12"
        fill="#7D5519" text-anchor="middle" opacity="0.85"
        letter-spacing="2">${escapeXml(caption)}</text>

  <rect x="0" y="0" width="530" height="1048" fill="url(#bgTeal)"/>

  <g fill="#E0BF7C" opacity="0.15">
    <circle cx="80"  cy="70"  r="1.4"/>
    <circle cx="450" cy="130" r="1.6"/>
    <circle cx="490" cy="900" r="1.4"/>
    <circle cx="60"  cy="980" r="1.5"/>
    <circle cx="200" cy="50"  r="0.9"/>
    <circle cx="380" cy="595" r="1.0"/>
    <circle cx="40"  cy="430" r="0.9"/>
    <circle cx="500" cy="430" r="1.1"/>
    <circle cx="120" cy="630" r="0.8"/>
  </g>

  <line x1="529" y1="40" x2="529" y2="1008"
        stroke="#B8893E" stroke-width="0.6" opacity="0.55"/>

  <g transform="translate(60, 0)">
    <g transform="translate(0, 88)">
      <line x1="0" y1="0" x2="56" y2="0" stroke="url(#goldLine)" stroke-width="1"/>
      <circle cx="69" cy="0" r="2.6" fill="#E0BF7C"/>
      <line x1="82" y1="0" x2="124" y2="0" stroke="url(#goldLine)" stroke-width="1"/>
    </g>

    <text x="0" y="124" font-family="'Helvetica Neue', Arial, sans-serif"
          font-size="12" fill="#E0BF7C" letter-spacing="3.6" font-weight="500">${eyebrow}</text>

    <text x="0" y="232" font-family="Georgia, 'Times New Roman', serif"
          font-size="92" fill="#F2A04C" font-style="italic" font-weight="500">${planetNameDisplay}</text>

    <text x="0" y="306" font-family="Georgia, serif" font-size="44"
          fill="#F2EAD3" font-weight="400">${escapeXml(houseLabel)}</text>

    <text x="0" y="354" font-family="Georgia, serif" font-size="22"
          fill="#E0BF7C" font-style="italic" letter-spacing="0.5">${escapeXml(lagnaLabel)}</text>

    <line x1="0" y1="396" x2="86" y2="396" stroke="#B8893E" stroke-width="2"/>

    <g transform="translate(0, 454)">
      <g transform="translate(70, 70)" filter="url(#softShadow)">
        <text x="0" y="-86" font-family="'Helvetica Neue', Arial, sans-serif"
              font-size="11" fill="#E0BF7C" letter-spacing="2.6"
              text-anchor="middle">LAGNA</text>
        <circle r="66" fill="#FBF6E8" stroke="#E0BF7C" stroke-width="1.8"/>
        <image xlink:href="${lagnaDataUri}"
               x="-60" y="-60" width="120" height="120"
               clip-path="url(#iconClipL)"
               preserveAspectRatio="xMidYMid slice"/>
        <circle r="64" fill="none" stroke="#B8893E" stroke-width="1" opacity="0.5"/>
      </g>
      <text x="70" y="170" font-family="Georgia, serif" font-size="20"
            fill="#F2EAD3" font-style="italic" text-anchor="middle">${escapeXml(lagna.english)}</text>

      <g transform="translate(135, 70)">
        <line x1="0" y1="0" x2="62" y2="0" stroke="#E0BF7C" stroke-width="1" opacity="0.7"/>
        <circle cx="71" cy="0" r="1.6" fill="#E0BF7C"/>
        <text x="100" y="6" font-family="Georgia, serif" font-size="22"
              font-style="italic" fill="#E0BF7C" text-anchor="middle">in</text>
        <circle cx="129" cy="0" r="1.6" fill="#E0BF7C"/>
        <line x1="138" y1="0" x2="200" y2="0" stroke="#E0BF7C" stroke-width="1" opacity="0.7"/>
      </g>

      <g transform="translate(340, 70)" filter="url(#softShadow)">
        <text x="0" y="-86" font-family="'Helvetica Neue', Arial, sans-serif"
              font-size="11" fill="#E0BF7C" letter-spacing="2.6"
              text-anchor="middle">PLANET</text>
        <circle r="66" fill="#012E34" stroke="#E0BF7C" stroke-width="1.8"/>
        <circle r="58" fill="none" stroke="${planet.accent}" stroke-width="0.8" opacity="0.45"/>
        ${renderPlanetSymbol(planetKey as PlanetSymbolKey, {
          color: planet.accent,
          strokeWidth: 3.4,
          transform: "scale(1.12)",
        })}
        <circle r="64" fill="none" stroke="#B8893E" stroke-width="1" opacity="0.5"/>
      </g>
      <text x="340" y="170" font-family="Georgia, serif" font-size="20"
            fill="#F2EAD3" font-style="italic" text-anchor="middle">${escapeXml(planet.sanskrit)}</text>
    </g>

    <g transform="translate(0, 700)">
      <text x="0" y="0" font-family="'Helvetica Neue', Arial, sans-serif"
            font-size="12" fill="#E0BF7C" letter-spacing="3.4" font-weight="500">KEY TRAITS</text>
      <line x1="0" y1="14" x2="56" y2="14" stroke="#B8893E" stroke-width="1.6"/>
    </g>

    <g font-family="Georgia, serif" fill="#F2EAD3">
${traitsBlock}
    </g>

    <g transform="translate(0, 1014)">
      <line x1="0" y1="0" x2="40" y2="0" stroke="#E0BF7C" stroke-width="1"/>
      <text x="52" y="5" font-family="Georgia, serif" font-size="13"
            fill="#E0BF7C" font-style="italic" letter-spacing="1.6">Vedic Astrology · Bhāva Series</text>
    </g>
  </g>
</svg>
`;
}

export type { PlanetId, LagnaId };
