// ─────────────────────────────────────────────────────────────────
// kundali-card.ts — deterministic 1024×1024 North-Indian kundali card.
//
// Renders the SAME North-Indian chart geometry the site already shows
// on-page via components/post/KundaliVisual.tsx (320×320 viewBox), but
// scaled up to fill a dark-brand 1024×1024 card so the post's existing
// `{slug}-north-indian-kundali.webp` image-figure stops 404-ing.
//
// Geometry is copied verbatim from KundaliVisual (HOUSE_POLYGONS +
// HOUSES cell coordinates in the 320 frame) and scaled by SCALE into a
// chart area centred on the card. Do NOT diverge these numbers from
// KundaliVisual or the static image will stop matching the on-page chart.
// ─────────────────────────────────────────────────────────────────

import { renderPlanetSymbol, type PlanetSymbolKey } from "./planet-symbols";

// ── Brand palette (matches hero-card.ts conventions) ───────────────
const BG_DARK = "#013F47";
const BG_DARK_2 = "#012F36";
const BG_DARK_TOP = "#02545E";
const SAFFRON = "#e8840a";
const SAFFRON_LIGHT = "#f5a623";
const GOLD = "#E0BF7C";
const CREAM = "#F2EAD3";

// ── KundaliVisual geometry (320×320 viewBox), copied verbatim ──────
const HOUSE_POLYGONS: Record<number, string> = {
  1: "160,10 235,85 160,160 85,85",
  4: "10,160 85,85 160,160 85,235",
  7: "160,310 85,235 160,160 235,235",
  10: "310,160 235,235 160,160 235,85",
  11: "310,10 310,160 235,85",
  12: "310,10 160,10 235,85",
  2: "10,10 160,10 85,85",
  3: "10,10 10,160 85,85",
  5: "10,160 10,310 85,235",
  6: "10,310 160,310 85,235",
  8: "160,310 310,310 235,235",
  9: "310,310 310,160 235,235",
};

interface Cell {
  num: number;
  label: { x: number; y: number };
  content: { x: number; y: number };
}

const HOUSES: Cell[] = [
  { num: 1, label: { x: 160, y: 56 }, content: { x: 160, y: 78 } },
  { num: 2, label: { x: 76, y: 30 }, content: { x: 64, y: 50 } },
  { num: 3, label: { x: 40, y: 70 }, content: { x: 56, y: 92 } },
  { num: 4, label: { x: 76, y: 160 }, content: { x: 90, y: 160 } },
  { num: 5, label: { x: 40, y: 246 }, content: { x: 56, y: 226 } },
  { num: 6, label: { x: 76, y: 286 }, content: { x: 64, y: 268 } },
  { num: 7, label: { x: 160, y: 256 }, content: { x: 160, y: 234 } },
  { num: 8, label: { x: 244, y: 286 }, content: { x: 256, y: 268 } },
  { num: 9, label: { x: 280, y: 246 }, content: { x: 264, y: 226 } },
  { num: 10, label: { x: 244, y: 160 }, content: { x: 230, y: 160 } },
  { num: 11, label: { x: 280, y: 70 }, content: { x: 264, y: 92 } },
  { num: 12, label: { x: 244, y: 30 }, content: { x: 256, y: 50 } },
];

// ── Card + chart layout ────────────────────────────────────────────
const CARD = 1024;
// Chart area: scale the 320 viewBox up so it fills a ~860px box,
// centred horizontally, pushed below the title band.
const CHART_PX = 832; // 320 * 2.6
const SCALE = CHART_PX / 320; // 2.6
const CHART_OX = (CARD - CHART_PX) / 2; // left offset of the 320-frame origin
const CHART_OY = 156; // top offset (leaves room for the title band)

// Scale a 320-frame coordinate into card pixels.
const sx = (x: number) => CHART_OX + x * SCALE;
const sy = (y: number) => CHART_OY + y * SCALE;

// Scale a 320-frame polygon `points` string into card pixels.
function scalePoints(points: string): string {
  return points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [px, py] = pair.split(",").map(Number);
      return `${sx(px).toFixed(1)},${sy(py).toFixed(1)}`;
    })
    .join(" ");
}

// ── Lagna name → 0-based sign index (Mesha=0 … Meena=11) ───────────
// Accept both english and sanskrit spellings that appear in post
// `lagna_id` fields and in slugs.
const LAGNA_SIGN_INDEX: Record<string, number> = {
  mesh: 0, mesha: 0, aries: 0,
  vrishabha: 1, vrishabh: 1, taurus: 1,
  mithuna: 2, mithun: 2, gemini: 2,
  karka: 3, kark: 3, cancer: 3,
  simha: 4, sinha: 4, leo: 4,
  kanya: 5, virgo: 5,
  tula: 6, libra: 6,
  vrishchika: 7, vrishchik: 7, scorpio: 7,
  dhanu: 8, dhanus: 8, sagittarius: 8,
  makara: 9, makar: 9, capricorn: 9,
  kumbha: 10, kumbh: 10, aquarius: 10,
  meena: 11, meen: 11, pisces: 11,
};

const SIGN_NAME: string[] = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
];

const SIGN_ENGLISH: string[] = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

// ── Planet → display name + glyph key + accent ─────────────────────
interface PlanetMeta {
  english: string;
  key: PlanetSymbolKey;
  accent: string;
}

const PLANETS: Record<string, PlanetMeta> = {
  surya: { english: "Sun", key: "surya", accent: "#F2A04C" },
  sun: { english: "Sun", key: "surya", accent: "#F2A04C" },
  chandra: { english: "Moon", key: "chandra", accent: "#E8E5D4" },
  moon: { english: "Moon", key: "chandra", accent: "#E8E5D4" },
  mangal: { english: "Mars", key: "mangal", accent: "#E97A2B" },
  mars: { english: "Mars", key: "mangal", accent: "#E97A2B" },
  budha: { english: "Mercury", key: "budha", accent: "#7CC8A5" },
  mercury: { english: "Mercury", key: "budha", accent: "#7CC8A5" },
  guru: { english: "Jupiter", key: "guru", accent: "#F4B942" },
  jupiter: { english: "Jupiter", key: "guru", accent: "#F4B942" },
  shukra: { english: "Venus", key: "shukra", accent: "#F2C8D8" },
  venus: { english: "Venus", key: "shukra", accent: "#F2C8D8" },
  shani: { english: "Saturn", key: "shani", accent: "#9DA8AC" },
  saturn: { english: "Saturn", key: "shani", accent: "#9DA8AC" },
  rahu: { english: "Rahu", key: "rahu", accent: "#9B7CB7" },
  ketu: { english: "Ketu", key: "ketu", accent: "#C5A88A" },
};

function ordinal(n: number): string {
  const map: Record<number, string> = {
    1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th",
    7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
  };
  return map[n] ?? `${n}th`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface KundaliCardOpts {
  planet: string;
  house: number;
  lagna: string;
  /** Optional explicit planet abbreviation override; defaults from PLANETS. */
  planetLabel?: string;
}

export function buildKundaliCardSvg(opts: KundaliCardOpts): string {
  const planetKey = (opts.planet ?? "").toLowerCase();
  const planet = PLANETS[planetKey];
  if (!planet) throw new Error(`Unknown planet: ${opts.planet}`);

  const house = opts.house;
  if (!Number.isInteger(house) || house < 1 || house > 12) {
    throw new Error(`Unknown house: ${opts.house}`);
  }

  const lagnaKey = (opts.lagna ?? "").toLowerCase();
  const lagnaSignIndex = LAGNA_SIGN_INDEX[lagnaKey];
  if (lagnaSignIndex === undefined) {
    throw new Error(`Unknown lagna: ${opts.lagna}`);
  }

  const lagnaSanskrit = SIGN_NAME[lagnaSignIndex];
  const lagnaEnglish = SIGN_ENGLISH[lagnaSignIndex];
  const planetLabel = opts.planetLabel ?? planet.english;

  // Sign held by house N = ((lagnaSignIndex + N - 1) % 12) + 1.
  const signAtHouse = (n: number) => ((lagnaSignIndex + n - 1) % 12) + 1;

  // Active house highlight (scaled polygon).
  const activePoly = HOUSE_POLYGONS[house];
  const highlight = activePoly
    ? `  <polygon points="${scalePoints(activePoly)}" fill="${SAFFRON}" fill-opacity="0.20" stroke="${SAFFRON}" stroke-opacity="0.6" stroke-width="2.6"/>`
    : "";

  // Outer square + diagonals + inner diamond, scaled. Mirrors the
  // KundaliVisual draw order (square, diagonals, inner diamond).
  const square = `  <rect x="${sx(10).toFixed(1)}" y="${sy(10).toFixed(1)}" width="${(300 * SCALE).toFixed(1)}" height="${(300 * SCALE).toFixed(1)}" fill="rgba(255,255,255,0.02)" stroke="${SAFFRON}" stroke-opacity="0.62" stroke-width="3" rx="6"/>`;

  const diag = (x1: number, y1: number, x2: number, y2: number) =>
    `  <line x1="${sx(x1).toFixed(1)}" y1="${sy(y1).toFixed(1)}" x2="${sx(x2).toFixed(1)}" y2="${sy(y2).toFixed(1)}" stroke="rgba(255,255,255,0.32)" stroke-width="2"/>`;
  const diamond = (x1: number, y1: number, x2: number, y2: number) =>
    `  <line x1="${sx(x1).toFixed(1)}" y1="${sy(y1).toFixed(1)}" x2="${sx(x2).toFixed(1)}" y2="${sy(y2).toFixed(1)}" stroke="${SAFFRON}" stroke-opacity="0.62" stroke-width="2.4"/>`;

  const lines = [
    diag(10, 10, 310, 310),
    diag(310, 10, 10, 310),
    diamond(160, 10, 310, 160),
    diamond(310, 160, 160, 310),
    diamond(160, 310, 10, 160),
    diamond(10, 160, 160, 10),
  ].join("\n");

  // Per-house rashi (sign) numbers + active marker.
  const houseGroups = HOUSES.map((c) => {
    const isActive = c.num === house;
    const signN = signAtHouse(c.num);
    const lx = sx(c.label.x);
    const ly = sy(c.label.y);
    const cx = sx(c.content.x);
    const cy = sy(c.content.y);

    // House number (small, faint) + rashi sign number beneath it.
    const houseNum = `    <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="${isActive ? 700 : 500}" fill="${isActive ? SAFFRON_LIGHT : "rgba(255,255,255,0.42)"}" letter-spacing="0.04em">${c.num}</text>`;
    const rashi = `    <text x="${lx.toFixed(1)}" y="${(ly + 26).toFixed(1)}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" fill="${isActive ? GOLD : "rgba(224,191,124,0.55)"}" font-style="italic">${signN}</text>`;

    if (!isActive) {
      return `  <g>\n${houseNum}\n${rashi}\n  </g>`;
    }

    // Active house: planet glyph medallion + abbreviation label.
    const glyph = renderPlanetSymbol(planet.key, {
      color: planet.accent,
      strokeWidth: 2.6,
      transform: "scale(0.62)",
    });
    const marker =
      `    <g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)})">\n` +
      `      <circle r="40" fill="${SAFFRON}" fill-opacity="0.22"/>\n` +
      `      <circle r="30" fill="${BG_DARK_2}" stroke="${GOLD}" stroke-width="2"/>\n` +
      `      ${glyph}\n` +
      `    </g>`;
    const label = `    <text x="${cx.toFixed(1)}" y="${(cy + 58).toFixed(1)}" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="600" fill="${CREAM}" letter-spacing="0.03em">${escapeXml(planetLabel)}</text>`;

    return `  <g>\n${houseNum}\n${rashi}\n${marker}\n${label}\n  </g>`;
  }).join("\n");

  const title = `${planet.english} in the ${ordinal(house)} house`;
  const subtitle = `${lagnaSanskrit} (${lagnaEnglish}) Lagna`;
  const caption = `North Indian D-1 (Rashi) Chart`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD}" height="${CARD}" viewBox="0 0 ${CARD} ${CARD}">
  <defs>
    <linearGradient id="kbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BG_DARK_TOP}"/>
      <stop offset="55%" stop-color="${BG_DARK}"/>
      <stop offset="100%" stop-color="${BG_DARK_2}"/>
    </linearGradient>
    <radialGradient id="kglow" cx="78%" cy="14%" r="48%">
      <stop offset="0%" stop-color="rgba(232,132,10,0.16)"/>
      <stop offset="100%" stop-color="rgba(232,132,10,0)"/>
    </radialGradient>
  </defs>

  <rect width="${CARD}" height="${CARD}" fill="url(#kbg)"/>
  <rect width="${CARD}" height="${CARD}" fill="url(#kglow)"/>

  <!-- faint diamond-pattern dots (brand dark-section motif) -->
  <g fill="${GOLD}" opacity="0.14">
    <circle cx="96" cy="120" r="2"/>
    <circle cx="928" cy="120" r="2"/>
    <circle cx="120" cy="960" r="2"/>
    <circle cx="904" cy="960" r="2"/>
    <circle cx="512" cy="48" r="1.6"/>
  </g>

  <!-- title band -->
  <g text-anchor="middle">
    <text x="${CARD / 2}" y="64" font-family="'Helvetica Neue', Arial, sans-serif" font-size="15" fill="${GOLD}" letter-spacing="4" font-weight="500">PLANETARY PLACEMENT</text>
    <text x="${CARD / 2}" y="116" font-family="Georgia, 'Times New Roman', serif" font-size="44" fill="${SAFFRON_LIGHT}" font-weight="600" font-style="italic">${escapeXml(title)}</text>
    <text x="${CARD / 2}" y="150" font-family="Georgia, serif" font-size="22" fill="${CREAM}" font-style="italic" letter-spacing="0.5">${escapeXml(subtitle)}</text>
  </g>

${highlight}
${square}
${lines}
${houseGroups}

  <!-- chart caption -->
  <text x="${CARD / 2}" y="${(CHART_OY + CHART_PX + 36).toFixed(0)}" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="rgba(224,191,124,0.85)" font-style="italic" letter-spacing="1.5">${escapeXml(caption)}</text>
</svg>
`;
}
