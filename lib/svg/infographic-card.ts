// ─────────────────────────────────────────────────────────────────
// infographic-card.ts — composed Vedic-astrology infographic SVGs.
//
// Produces purpose-built SVG cards (1200×800) for two card types:
//
//   1. buildCareerCardSvg(data)  — career-fits info graphic with
//      6 items, each with a relevant icon + label + 1-line sub.
//
//   2. buildRemediesCardSvg(data) — remedies info graphic with the
//      mantra, gemstone, day, colour, deity, and yantra direction.
//
// Both are rasterised to WebP via scripts/svg-to-webp.ts and used
// as image-figure blocks inside posts. They serve as real images
// (proper alt, schema, image-sitemap entry) AND deliver the
// astrology-specific information unDraw stock illustrations cannot.
// ─────────────────────────────────────────────────────────────────

const PALETTE = {
  primary: "#013F47",
  primaryDark: "#01262b",
  saffron: "#e8840a",
  saffronPale: "#FBE2BD",
  gold: "#c9a84c",
  goldPale: "#F0E0B0",
  cream: "#faf6ef",
  creamWarm: "#F4ECDA",
  ink: "#0d1f24",
  inkSoft: "#3a4f54",
  inkFaint: "#7a8a8f",
  border: "rgba(1,63,71,0.10)",
} as const;

import { renderPlanetSymbol, type PlanetSymbolKey } from "./planet-symbols";

const PLANET_GLYPHS: Record<string, string> = {
  surya: "☉",
  chandra: "☽",
  mangal: "♂",
  budha: "☿",
  guru: "♃",
  shukra: "♀",
  shani: "♄",
  rahu: "☊",
  ketu: "☋",
};

const PLANET_ENGLISH: Record<string, string> = {
  surya: "Sun",
  chandra: "Moon",
  mangal: "Mars",
  budha: "Mercury",
  guru: "Jupiter",
  shukra: "Venus",
  shani: "Saturn",
  rahu: "Rahu",
  ketu: "Ketu",
};

// Hand-drawn simple icons. Each is a 40×40 SVG group.
// Strokes use currentColor so we can theme per-card.
const ICONS: Record<string, string> = {
  // medicine / health — stethoscope-ish
  medicine: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6 V14 a4 4 0 0 0 4 4 H22 a4 4 0 0 0 4 -4 V6"/><circle cx="29" cy="24" r="3"/><path d="M19 18 V22 a4 4 0 0 0 4 4 H26"/><path d="M9 6 L15 6"/><path d="M23 6 L29 6"/></g>`,
  // law — scales
  law: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 L20 30"/><path d="M12 30 L28 30"/><path d="M10 12 L20 8 L30 12"/><path d="M6 20 a4 4 0 0 0 8 0 L10 12 Z"/><path d="M26 20 a4 4 0 0 0 8 0 L30 12 Z"/></g>`,
  // military / shield
  military: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 L8 11 V20 a14 14 0 0 0 12 14 a14 14 0 0 0 12 -14 V11 Z"/><path d="M16 20 L19 23 L26 16"/></g>`,
  // writing / pen
  writing: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 32 L12 28 L26 14 L30 18 L16 32 Z"/><path d="M24 12 L28 8 L32 12 L28 16"/><path d="M8 32 L14 30"/></g>`,
  // scholarship / book-open
  scholarship: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10 L20 12 L20 32 L6 30 Z"/><path d="M34 10 L20 12 L20 32 L34 30 Z"/></g>`,
  // gemstone / diamond
  gemstone: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M10 14 L20 6 L30 14 L20 34 Z"/><path d="M10 14 L30 14"/><path d="M20 6 L20 14"/><path d="M14 14 L20 34"/><path d="M26 14 L20 34"/></g>`,
  // mantra / sparkle
  mantra: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 L23 16 L34 20 L23 24 L20 36 L17 24 L6 20 L17 16 Z"/></g>`,
  // heart / compassion
  heart: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 32 C8 24 4 17 8 11 C12 5 18 7 20 12 C22 7 28 5 32 11 C36 17 32 24 20 32 Z"/></g>`,
  // home / family
  home: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20 L20 6 L34 20 V32 H26 V22 H14 V32 H6 Z"/></g>`,
  // wealth / coins
  wealth: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="14" r="6"/><circle cx="26" cy="22" r="6"/><circle cx="20" cy="30" r="6"/></g>`,
  // flame / fire / spirit
  flame: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 C12 14 14 22 20 22 C26 22 28 14 20 6 Z"/><path d="M14 22 C12 26 14 32 20 34 C26 32 28 26 26 22 C24 26 22 28 20 28 C18 28 16 26 14 22 Z"/></g>`,
  // research / eye
  research: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 C8 12 14 8 20 8 C26 8 32 12 36 20 C32 28 26 32 20 32 C14 32 8 28 4 20 Z"/><circle cx="20" cy="20" r="5"/></g>`,
  // sun
  sun: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="6"/><path d="M20 4 V8"/><path d="M20 32 V36"/><path d="M4 20 H8"/><path d="M32 20 H36"/><path d="M9 9 L12 12"/><path d="M28 28 L31 31"/><path d="M9 31 L12 28"/><path d="M28 12 L31 9"/></g>`,
  // moon
  moon: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M28 6 a14 14 0 1 0 6 22 A11 11 0 0 1 28 6 Z"/></g>`,
  // education / graduation
  education: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16 L20 8 L36 16 L20 24 Z"/><path d="M10 19 V26 c2 4 16 4 20 0 V19"/></g>`,
  // institution / pillar
  institution: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 L20 4 L36 12"/><path d="M6 12 V32"/><path d="M14 12 V32"/><path d="M26 12 V32"/><path d="M34 12 V32"/><path d="M2 34 L38 34"/></g>`,
  // direction / compass
  direction: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="14"/><path d="M20 20 L24 14 L26 16 L22 22 Z" fill="currentColor"/></g>`,
  // music / sound
  music: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 28 V12 L30 8 V24"/><circle cx="11" cy="28" r="3"/><circle cx="27" cy="24" r="3"/></g>`,
  // calendar / day
  calendar: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="28" height="24" rx="2"/><path d="M6 16 L34 16"/><path d="M14 6 V14"/><path d="M26 6 V14"/></g>`,
  // palette / colour
  palette: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C24 36 24 32 22 30 C20 28 22 26 26 26 C32 26 36 22 36 16 C36 8 28 4 20 4 Z"/><circle cx="12" cy="14" r="2" fill="currentColor"/><circle cx="20" cy="10" r="2" fill="currentColor"/><circle cx="28" cy="14" r="2" fill="currentColor"/></g>`,
  // briefcase / work
  work: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="14" width="32" height="20" rx="2"/><path d="M14 14 V8 H26 V14"/><path d="M4 22 L36 22"/></g>`,
  // star / general
  star: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 L24 14 L34 14 L26 22 L29 32 L20 26 L11 32 L14 22 L6 14 L16 14 Z"/></g>`,
};

function pickIcon(label: string): keyof typeof ICONS {
  const l = label.toLowerCase();
  if (/medic|health|surger|hospital|nurs|emergency|doctor|reproduc/.test(l))
    return "medicine";
  if (/law|legal|litigat|judic|court|advocate|arbitrat|estate plan/.test(l))
    return "law";
  if (/milit|uniform|defen[cs]e|secur|police/.test(l)) return "military";
  if (/writ|editor|publish|journal|column|author|content|memoir/.test(l))
    return "writing";
  if (/teach|professor|education|tutor|academic|scholar|university/.test(l))
    return "education";
  if (/research|investig|analys|forensic|archive|histor|biograph/.test(l))
    return "research";
  if (/music|perform|sing|instrument|broadcast|podcast/.test(l)) return "music";
  if (/business|commerc|sales|trade|marketing|consult|venture/.test(l))
    return "work";
  if (/real estate|propert|home|hospital|hotel|hospital/.test(l)) return "home";
  if (/spirit|religi|monast|priest|temple|deity|charit|hospice|palliat/.test(l))
    return "flame";
  if (/wealth|finance|money|insur|invest|inherit|joint/.test(l))
    return "wealth";
  if (/gem|jewel|stone|ratna|ruby|pearl|coral|emerald|diamond|sapphire/.test(l))
    return "gemstone";
  if (/mantra|chant|recit|stotra|kavach|atharva|namasm/.test(l))
    return "mantra";
  if (/love|partner|marriage|family|mother|father|sibling|relation/.test(l))
    return "heart";
  if (/institut|govern|administ|leadership|director|chief/.test(l))
    return "institution";
  if (/direction|yantra|north|east|west|south|compass/.test(l))
    return "direction";
  if (/colour|color|saffron|gold|silver|red|white|blue/.test(l))
    return "palette";
  if (/day|monday|tuesday|wednesday|thursday|friday|saturday|sunday/.test(l))
    return "calendar";
  return "star";
}

interface Item {
  label: string;
  sub: string;
  iconKey?: keyof typeof ICONS;
}

interface CareerCardData {
  planet_id: string;
  planet_glyph?: string;
  house_number: number;
  house_sanskrit: string;
  lagna_label: string;
  signature_phrase: string; // e.g., "Authority through adversity"
  items: string[]; // raw career strings from effects-grid.career
  primary_color?: string;
  accent_color?: string;
}

interface RemediesCardData {
  planet_id: string;
  planet_glyph?: string;
  house_number: number;
  house_sanskrit: string;
  lagna_label: string;
  mantra_name: string; // e.g., "Aditya Hridayam"
  gemstone_name: string; // e.g., "Ruby (Manikya)"
  day_label: string; // e.g., "Sunday at sunrise"
  colour_label: string; // e.g., "Saffron, red, gold"
  yantra_name: string; // e.g., "Surya Yantra"
  donation_label: string; // e.g., "Books, scholarships, dharmic causes"
  primary_color?: string;
  accent_color?: string;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitItem(raw: string): { label: string; sub: string } {
  // "Medicine and emergency response leadership" → label "Medicine", sub "Emergency response leadership"
  // "Writing, journalism, and authored content" → label "Writing", sub "Journalism, authored content"
  const trimmed = raw.trim();
  const splitOn = /,\s+|\s+(?:and|with|featuring)\s+/i;
  const parts = trimmed.split(splitOn);
  if (parts.length === 1) return { label: trimmed, sub: "" };
  const label = parts[0].trim();
  const sub = parts
    .slice(1)
    .join(", ")
    .replace(/^(?:and\s+)?/i, "")
    .trim();
  return { label: label.charAt(0).toUpperCase() + label.slice(1), sub };
}

function shorten(s: string, max: number): string {
  if (s.length <= max) return s;
  // Prefer breaking at a comma / space
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.6) return cut.slice(0, lastSpace) + "…";
  return cut + "…";
}

// ─────────────────────────────────────────────────────────────────
// Career card SVG — 1200×800
// ─────────────────────────────────────────────────────────────────

export function buildCareerCardSvg(data: CareerCardData): string {
  const items: Item[] = data.items.slice(0, 6).map((raw) => {
    const { label, sub } = splitItem(raw);
    return {
      label: shorten(label, 28),
      sub: shorten(sub, 56),
      iconKey: pickIcon(raw),
    };
  });

  const planet = PLANET_ENGLISH[data.planet_id] ?? data.planet_id;
  const glyph = data.planet_glyph ?? PLANET_GLYPHS[data.planet_id] ?? "★";
  const primary = data.primary_color ?? PALETTE.primary;
  const accent = data.accent_color ?? PALETTE.saffron;

  const cardX = 0;
  const cardY = 0;
  const cardW = 1200;
  const cardH = 800;

  // Header band
  const headerH = 200;

  // Item grid: 2 columns × 3 rows below header
  const gridTop = headerH + 30;
  const gridGapX = 30;
  const gridGapY = 24;
  const colW = (cardW - 80 - gridGapX) / 2; // padding 40 each side
  const rowH = (cardH - gridTop - 80 - 2 * gridGapY) / 3;

  function renderItem(item: Item, ix: number): string {
    const col = ix % 2;
    const row = Math.floor(ix / 2);
    const x = 40 + col * (colW + gridGapX);
    const y = gridTop + row * (rowH + gridGapY);
    const iconBoxX = x + 24;
    const iconBoxY = y + 24;
    const iconCircleR = 30;
    const iconG = ICONS[item.iconKey ?? "star"] ?? ICONS.star;
    const labelX = x + 24 + iconCircleR * 2 + 22;
    const labelY = y + 32;
    return `
      <g>
        <rect x="${x}" y="${y}" width="${colW}" height="${rowH}" rx="14" fill="${PALETTE.cream}" stroke="${PALETTE.border}" stroke-width="1"/>
        <circle cx="${iconBoxX + iconCircleR}" cy="${iconBoxY + iconCircleR}" r="${iconCircleR}" fill="${PALETTE.saffronPale}"/>
        <g transform="translate(${iconBoxX + iconCircleR - 20} ${iconBoxY + iconCircleR - 20})" color="${accent}">${iconG}</g>
        <text x="${labelX}" y="${labelY + 18}" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="700" fill="${PALETTE.ink}">${escape(item.label)}</text>
        ${item.sub ? `<text x="${labelX}" y="${labelY + 50}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="17" fill="${PALETTE.inkSoft}">${escape(item.sub)}</text>` : ""}
      </g>
    `;
  }

  const itemsSvg = items.map((it, ix) => renderItem(it, ix)).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cardX} ${cardY} ${cardW} ${cardH}" role="img" aria-label="${escape(`${planet} in ${data.house_number}th house career fits for ${data.lagna_label}`)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="${PALETTE.primaryDark}"/>
    </linearGradient>
    <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${PALETTE.creamWarm}"/>
      <stop offset="100%" stop-color="${PALETTE.cream}"/>
    </linearGradient>
    <pattern id="diamondPattern" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M17 2 L32 17 L17 32 L2 17 Z" fill="none" stroke="${accent}" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Outer card with brand gradient -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" fill="url(#bg)"/>
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" fill="url(#diamondPattern)"/>

  <!-- Inner cream panel -->
  <rect x="20" y="20" width="${cardW - 40}" height="${cardH - 40}" rx="20" fill="url(#cardBg)"/>

  <!-- Header band -->
  <g>
    <text x="40" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${accent}">CAREER FITS</text>
    <text x="40" y="86" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${accent}">_______________</text>

    <!-- Planet glyph chip -->
    <circle cx="86" cy="146" r="42" fill="${accent}"/>
    <g transform="translate(86 146)">${renderPlanetSymbol((data.planet_id ?? "surya") as PlanetSymbolKey, { color: PALETTE.cream, strokeWidth: 3.4, transform: "scale(0.9)" })}</g>

    <!-- Title -->
    <text x="160" y="146" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="700" fill="${PALETTE.ink}">${escape(planet)} in the ${data.house_number}${ordinalSuffix(data.house_number)} house</text>
    <text x="160" y="186" font-family="Georgia, serif" font-style="italic" font-size="22" fill="${PALETTE.inkSoft}">${escape(`${data.lagna_label} · ${data.signature_phrase}`)}</text>
  </g>

  <!-- Items grid -->
  ${itemsSvg}

  <!-- Footer -->
  <text x="40" y="${cardH - 40}" font-family="system-ui, sans-serif" font-size="13" font-weight="600" letter-spacing="2" fill="${PALETTE.inkFaint}">VASTUCART EDITORIAL</text>
  <text x="${cardW - 40}" y="${cardH - 40}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" fill="${PALETTE.inkFaint}">${escape(`${data.house_sanskrit} · classical Parashari tradition`)}</text>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────
// Remedies card SVG — 1200×800
// ─────────────────────────────────────────────────────────────────

export function buildRemediesCardSvg(data: RemediesCardData): string {
  const planet = PLANET_ENGLISH[data.planet_id] ?? data.planet_id;
  const glyph = data.planet_glyph ?? PLANET_GLYPHS[data.planet_id] ?? "★";
  const primary = data.primary_color ?? PALETTE.primary;
  const accent = data.accent_color ?? PALETTE.saffron;

  const items: { label: string; sub: string; iconKey: keyof typeof ICONS }[] = [
    { label: "Mantra", sub: shorten(data.mantra_name, 56), iconKey: "mantra" },
    { label: "Gemstone", sub: shorten(data.gemstone_name, 56), iconKey: "gemstone" },
    { label: "Day", sub: shorten(data.day_label, 56), iconKey: "calendar" },
    { label: "Colour", sub: shorten(data.colour_label, 56), iconKey: "palette" },
    { label: "Yantra", sub: shorten(data.yantra_name, 56), iconKey: "direction" },
    { label: "Donation", sub: shorten(data.donation_label, 56), iconKey: "heart" },
  ];

  const cardW = 1200;
  const cardH = 800;
  const headerH = 200;
  const gridTop = headerH + 30;
  const gridGapX = 30;
  const gridGapY = 24;
  const colW = (cardW - 80 - gridGapX) / 2;
  const rowH = (cardH - gridTop - 80 - 2 * gridGapY) / 3;

  function renderItem(
    item: { label: string; sub: string; iconKey: keyof typeof ICONS },
    ix: number
  ): string {
    const col = ix % 2;
    const row = Math.floor(ix / 2);
    const x = 40 + col * (colW + gridGapX);
    const y = gridTop + row * (rowH + gridGapY);
    const iconBoxX = x + 24;
    const iconBoxY = y + 24;
    const iconCircleR = 30;
    const iconG = ICONS[item.iconKey] ?? ICONS.star;
    const labelX = x + 24 + iconCircleR * 2 + 22;
    const labelY = y + 32;
    return `
      <g>
        <rect x="${x}" y="${y}" width="${colW}" height="${rowH}" rx="14" fill="${PALETTE.cream}" stroke="${PALETTE.border}" stroke-width="1"/>
        <circle cx="${iconBoxX + iconCircleR}" cy="${iconBoxY + iconCircleR}" r="${iconCircleR}" fill="${PALETTE.goldPale}"/>
        <g transform="translate(${iconBoxX + iconCircleR - 20} ${iconBoxY + iconCircleR - 20})" color="${PALETTE.gold}">${iconG}</g>
        <text x="${labelX}" y="${labelY + 18}" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="700" fill="${PALETTE.ink}">${escape(item.label)}</text>
        <text x="${labelX}" y="${labelY + 50}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="17" fill="${PALETTE.inkSoft}">${escape(item.sub)}</text>
      </g>
    `;
  }

  const itemsSvg = items.map((it, ix) => renderItem(it, ix)).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardW} ${cardH}" role="img" aria-label="${escape(`${planet} remedies for ${data.house_number}th house ${data.lagna_label}`)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="${PALETTE.primaryDark}"/>
    </linearGradient>
    <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${PALETTE.creamWarm}"/>
      <stop offset="100%" stop-color="${PALETTE.cream}"/>
    </linearGradient>
    <pattern id="diamondPattern" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M17 2 L32 17 L17 32 L2 17 Z" fill="none" stroke="${accent}" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <rect x="0" y="0" width="${cardW}" height="${cardH}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${cardW}" height="${cardH}" fill="url(#diamondPattern)"/>

  <rect x="20" y="20" width="${cardW - 40}" height="${cardH - 40}" rx="20" fill="url(#cardBg)"/>

  <g>
    <text x="40" y="74" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${PALETTE.gold}">REMEDIES AT A GLANCE</text>
    <text x="40" y="86" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${PALETTE.gold}">________________________</text>

    <circle cx="86" cy="146" r="42" fill="${PALETTE.gold}"/>
    <g transform="translate(86 146)">${renderPlanetSymbol((data.planet_id ?? "surya") as PlanetSymbolKey, { color: PALETTE.cream, strokeWidth: 3.4, transform: "scale(0.9)" })}</g>

    <text x="160" y="146" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="700" fill="${PALETTE.ink}">${escape(planet)} remedies, ${data.house_number}${ordinalSuffix(data.house_number)} house</text>
    <text x="160" y="186" font-family="Georgia, serif" font-style="italic" font-size="22" fill="${PALETTE.inkSoft}">${escape(`${data.lagna_label} · daily practice protocol`)}</text>
  </g>

  ${itemsSvg}

  <text x="40" y="${cardH - 40}" font-family="system-ui, sans-serif" font-size="13" font-weight="600" letter-spacing="2" fill="${PALETTE.inkFaint}">VASTUCART EDITORIAL</text>
  <text x="${cardW - 40}" y="${cardH - 40}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" fill="${PALETTE.inkFaint}">${escape(`${data.house_sanskrit} · ratified by review panel`)}</text>
</svg>`;
}

function ordinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export const _PALETTE = PALETTE;
export const _PLANET_GLYPHS = PLANET_GLYPHS;
export const _PLANET_ENGLISH = PLANET_ENGLISH;
