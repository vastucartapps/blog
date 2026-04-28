// ─────────────────────────────────────────────────────────────────
// numerology-infographic.ts — composed Vedic-numerology infographics.
//
// Same visual grammar as lib/svg/infographic-card.ts, but the header
// reads "Life Path Number N · Ruling Planet" instead of
// "Planet in Nth house". Two card types:
//
//   1. buildNumerologyCareerCardSvg — career-fits with 6 items.
//   2. buildNumerologyRemediesCardSvg — mantra, gemstone, day,
//      colour, yantra direction, donation.
//
// Both rasterise to 1200×800 WebP via sharp.
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

const PLANET_GLYPHS: Record<string, string> = {
  surya: "☉", chandra: "☽", mangal: "♂", budha: "☿", guru: "♃",
  shukra: "♀", shani: "♄", rahu: "☊", ketu: "☋",
};
const PLANET_ENGLISH: Record<string, string> = {
  surya: "Sun", chandra: "Moon", mangal: "Mars", budha: "Mercury",
  guru: "Jupiter", shukra: "Venus", shani: "Saturn", rahu: "Rahu", ketu: "Ketu",
};
const PLANET_PRIMARY: Record<string, string> = {
  surya: "#7a4d00", chandra: "#013F47", mangal: "#5a1414", budha: "#013F47",
  guru: "#7a4d00", shukra: "#5a1d3e", shani: "#012a30", rahu: "#013F47",
  ketu: "#013F47",
};
const PLANET_ACCENT: Record<string, string> = {
  surya: "#e8840a", chandra: "#338a95", mangal: "#c94444", budha: "#338a95",
  guru: "#f4b942", shukra: "#e8840a", shani: "#7a8a8f", rahu: "#7B6FB7",
  ketu: "#9DA8AC",
};

// Hand-drawn 40×40 icon set, mirrors infographic-card.ts.
const ICONS: Record<string, string> = {
  medicine: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6 V14 a4 4 0 0 0 4 4 H22 a4 4 0 0 0 4 -4 V6"/><circle cx="29" cy="24" r="3"/><path d="M19 18 V22 a4 4 0 0 0 4 4 H26"/><path d="M9 6 L15 6"/><path d="M23 6 L29 6"/></g>`,
  law: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 L20 30"/><path d="M12 30 L28 30"/><path d="M10 12 L20 8 L30 12"/><path d="M6 20 a4 4 0 0 0 8 0 L10 12 Z"/><path d="M26 20 a4 4 0 0 0 8 0 L30 12 Z"/></g>`,
  military: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 L8 11 V20 a14 14 0 0 0 12 14 a14 14 0 0 0 12 -14 V11 Z"/><path d="M16 20 L19 23 L26 16"/></g>`,
  writing: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 32 L12 28 L26 14 L30 18 L16 32 Z"/><path d="M24 12 L28 8 L32 12 L28 16"/><path d="M8 32 L14 30"/></g>`,
  scholarship: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10 L20 12 L20 32 L6 30 Z"/><path d="M34 10 L20 12 L20 32 L34 30 Z"/></g>`,
  gemstone: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M10 14 L20 6 L30 14 L20 34 Z"/><path d="M10 14 L30 14"/><path d="M20 6 L20 14"/><path d="M14 14 L20 34"/><path d="M26 14 L20 34"/></g>`,
  mantra: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 L23 16 L34 20 L23 24 L20 36 L17 24 L6 20 L17 16 Z"/></g>`,
  heart: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 32 C8 24 4 17 8 11 C12 5 18 7 20 12 C22 7 28 5 32 11 C36 17 32 24 20 32 Z"/></g>`,
  home: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20 L20 6 L34 20 V32 H26 V22 H14 V32 H6 Z"/></g>`,
  wealth: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="14" r="6"/><circle cx="26" cy="22" r="6"/><circle cx="20" cy="30" r="6"/></g>`,
  flame: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 C12 14 14 22 20 22 C26 22 28 14 20 6 Z"/><path d="M14 22 C12 26 14 32 20 34 C26 32 28 26 26 22 C24 26 22 28 20 28 C18 28 16 26 14 22 Z"/></g>`,
  research: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 C8 12 14 8 20 8 C26 8 32 12 36 20 C32 28 26 32 20 32 C14 32 8 28 4 20 Z"/><circle cx="20" cy="20" r="5"/></g>`,
  sun: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="6"/><path d="M20 4 V8"/><path d="M20 32 V36"/><path d="M4 20 H8"/><path d="M32 20 H36"/><path d="M9 9 L12 12"/><path d="M28 28 L31 31"/><path d="M9 31 L12 28"/><path d="M28 12 L31 9"/></g>`,
  moon: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M28 6 a14 14 0 1 0 6 22 A11 11 0 0 1 28 6 Z"/></g>`,
  education: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16 L20 8 L36 16 L20 24 Z"/><path d="M10 19 V26 c2 4 16 4 20 0 V19"/></g>`,
  institution: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 L20 4 L36 12"/><path d="M6 12 V32"/><path d="M14 12 V32"/><path d="M26 12 V32"/><path d="M34 12 V32"/><path d="M2 34 L38 34"/></g>`,
  direction: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="14"/><path d="M20 20 L24 14 L26 16 L22 22 Z" fill="currentColor"/></g>`,
  music: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 28 V12 L30 8 V24"/><circle cx="11" cy="28" r="3"/><circle cx="27" cy="24" r="3"/></g>`,
  calendar: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="28" height="24" rx="2"/><path d="M6 16 L34 16"/><path d="M14 6 V14"/><path d="M26 6 V14"/></g>`,
  palette: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C24 36 24 32 22 30 C20 28 22 26 26 26 C32 26 36 22 36 16 C36 8 28 4 20 4 Z"/><circle cx="12" cy="14" r="2" fill="currentColor"/><circle cx="20" cy="10" r="2" fill="currentColor"/><circle cx="28" cy="14" r="2" fill="currentColor"/></g>`,
  work: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="14" width="32" height="20" rx="2"/><path d="M14 14 V8 H26 V14"/><path d="M4 22 L36 22"/></g>`,
  star: `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 L24 14 L34 14 L26 22 L29 32 L20 26 L11 32 L14 22 L6 14 L16 14 Z"/></g>`,
};

function pickIcon(label: string): keyof typeof ICONS {
  const l = label.toLowerCase();
  if (/medic|health|surger|hospital|nurs|emergency|doctor|reproduc|paediat|obstet|midwif|palliat/.test(l)) return "medicine";
  if (/law|legal|litigat|judic|court|advocate|arbitrat|estate plan|immigration/.test(l)) return "law";
  if (/milit|defen[cs]e|secur|police|special operations|frontline/.test(l)) return "military";
  if (/writ|editor|publish|journal|column|author|content|memoir|lyric|poetry|screenwrit/.test(l)) return "writing";
  if (/teach|professor|education|tutor|academic|scholar|university|priest|theolog/.test(l)) return "education";
  if (/research|investig|analys|forensic|archive|histor|biograph|philosoph|mathemat|physics|theoret/.test(l)) return "research";
  if (/music|perform|sing|instrument|broadcast|podcast|comed|comedy/.test(l)) return "music";
  if (/business|commerc|sales|trade|marketing|consult|venture|broker|founder|operations/.test(l)) return "work";
  if (/real estate|propert|home|hospital|hotel|restaur|hospitality|atelier/.test(l)) return "home";
  if (/spirit|religi|monast|temple|deity|charit|hospice|ngo|humanitarian|foreign service/.test(l)) return "flame";
  if (/wealth|finance|money|insur|invest|inherit|joint|banking|infrastructure/.test(l)) return "wealth";
  if (/gem|jewel|stone|ratna|ruby|pearl|coral|emerald|diamond|sapphire|hessonite|cats eye/.test(l)) return "gemstone";
  if (/mantra|chant|recit|stotra|kavach|atharva|namasm/.test(l)) return "mantra";
  if (/love|partner|marriage|family|mother|father|sibling|relation|design|fashion|interior|atelier|curator|gallery/.test(l)) return "heart";
  if (/institut|govern|administ|leadership|director|chief|architect|civil|engineer|judicial|named|practice/.test(l)) return "institution";
  if (/direction|yantra|north|east|west|south|compass/.test(l)) return "direction";
  if (/colour|color|saffron|gold|silver|red|white|blue/.test(l)) return "palette";
  if (/day|monday|tuesday|wednesday|thursday|friday|saturday|sunday/.test(l)) return "calendar";
  return "star";
}

interface Item { label: string; sub: string; iconKey?: keyof typeof ICONS; }

interface NumerologyCareerCardData {
  number: number;
  ruling_planet: string;
  ruling_day: string;
  archetype: string;
  items: string[];
}
interface NumerologyRemediesCardData {
  number: number;
  ruling_planet: string;
  ruling_day: string;
  archetype: string;
  mantra_name: string;
  gemstone_name: string;
  day_label: string;
  colour_label: string;
  yantra_name: string;
  donation_label: string;
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function splitItem(raw: string): { label: string; sub: string } {
  const trimmed = raw.trim();
  const splitOn = /,\s+|\s+(?:and|with|featuring)\s+/i;
  const parts = trimmed.split(splitOn);
  if (parts.length === 1) return { label: trimmed, sub: "" };
  const label = parts[0].trim();
  const sub = parts.slice(1).join(", ").replace(/^(?:and\s+)?/i, "").trim();
  return { label: label.charAt(0).toUpperCase() + label.slice(1), sub };
}
function shorten(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.6) return cut.slice(0, lastSpace) + "…";
  return cut + "…";
}

function renderInfographicShell(opts: {
  eyebrow: string;
  title: string;
  subtitle: string;
  glyph: string;
  primary: string;
  accent: string;
  itemsSvg: string;
  footerRight: string;
  ariaLabel: string;
}): string {
  const { eyebrow, title, subtitle, glyph, primary, accent, itemsSvg, footerRight, ariaLabel } = opts;
  const cardW = 1200;
  const cardH = 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardW} ${cardH}" role="img" aria-label="${escape(ariaLabel)}">
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
  <rect width="${cardW}" height="${cardH}" fill="url(#bg)"/>
  <rect width="${cardW}" height="${cardH}" fill="url(#diamondPattern)"/>
  <rect x="20" y="20" width="${cardW - 40}" height="${cardH - 40}" rx="20" fill="url(#cardBg)"/>
  <g>
    <text x="40" y="74" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${accent}">${escape(eyebrow)}</text>
    <text x="40" y="86" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="${accent}">________________________</text>
    <circle cx="86" cy="146" r="42" fill="${accent}"/>
    <text x="86" y="166" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="700" fill="${PALETTE.cream}">${escape(glyph)}</text>
    <text x="160" y="146" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="700" fill="${PALETTE.ink}">${escape(title)}</text>
    <text x="160" y="186" font-family="Georgia, serif" font-style="italic" font-size="22" fill="${PALETTE.inkSoft}">${escape(subtitle)}</text>
  </g>
  ${itemsSvg}
  <text x="40" y="${cardH - 40}" font-family="system-ui, sans-serif" font-size="13" font-weight="600" letter-spacing="2" fill="${PALETTE.inkFaint}">VASTUCART EDITORIAL</text>
  <text x="${cardW - 40}" y="${cardH - 40}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" fill="${PALETTE.inkFaint}">${escape(footerRight)}</text>
</svg>`;
}

function renderItemsGrid(items: Item[], iconBg: string, iconColour: string): string {
  const cardW = 1200;
  const cardH = 800;
  const headerH = 200;
  const gridTop = headerH + 30;
  const gridGapX = 30;
  const gridGapY = 24;
  const colW = (cardW - 80 - gridGapX) / 2;
  const rowH = (cardH - gridTop - 80 - 2 * gridGapY) / 3;
  return items.map((item, ix) => {
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
        <circle cx="${iconBoxX + iconCircleR}" cy="${iconBoxY + iconCircleR}" r="${iconCircleR}" fill="${iconBg}"/>
        <g transform="translate(${iconBoxX + iconCircleR - 20} ${iconBoxY + iconCircleR - 20})" color="${iconColour}">${iconG}</g>
        <text x="${labelX}" y="${labelY + 18}" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="700" fill="${PALETTE.ink}">${escape(item.label)}</text>
        ${item.sub ? `<text x="${labelX}" y="${labelY + 50}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="17" fill="${PALETTE.inkSoft}">${escape(item.sub)}</text>` : ""}
      </g>
    `;
  }).join("\n");
}

export function buildNumerologyCareerCardSvg(data: NumerologyCareerCardData): string {
  const planetKey = data.ruling_planet.toLowerCase();
  const planetName = PLANET_ENGLISH[planetKey] ?? data.ruling_planet;
  const glyph = PLANET_GLYPHS[planetKey] ?? "★";
  const primary = PLANET_PRIMARY[planetKey] ?? PALETTE.primary;
  const accent = PLANET_ACCENT[planetKey] ?? PALETTE.saffron;

  const items: Item[] = data.items.slice(0, 6).map((raw) => {
    const { label, sub } = splitItem(raw);
    return { label: shorten(label, 28), sub: shorten(sub, 56), iconKey: pickIcon(raw) };
  });
  const itemsSvg = renderItemsGrid(items, PALETTE.saffronPale, accent);

  return renderInfographicShell({
    eyebrow: "CAREER FITS",
    title: `Life Path ${data.number}, the ${data.archetype}`,
    subtitle: `${planetName} ruled · ${data.ruling_day} signature`,
    glyph,
    primary,
    accent,
    itemsSvg,
    footerRight: `${planetName} karakatva · classical ank jyotish`,
    ariaLabel: `Life Path Number ${data.number} career fits infographic for the ${planetName}-ruled archetype`,
  });
}

export function buildNumerologyRemediesCardSvg(data: NumerologyRemediesCardData): string {
  const planetKey = data.ruling_planet.toLowerCase();
  const planetName = PLANET_ENGLISH[planetKey] ?? data.ruling_planet;
  const glyph = PLANET_GLYPHS[planetKey] ?? "★";
  const primary = PLANET_PRIMARY[planetKey] ?? PALETTE.primary;
  const accent = PLANET_ACCENT[planetKey] ?? PALETTE.saffron;

  const items: Item[] = [
    { label: "Mantra", sub: shorten(data.mantra_name, 56), iconKey: "mantra" },
    { label: "Gemstone", sub: shorten(data.gemstone_name, 56), iconKey: "gemstone" },
    { label: "Day", sub: shorten(data.day_label, 56), iconKey: "calendar" },
    { label: "Colour", sub: shorten(data.colour_label, 56), iconKey: "palette" },
    { label: "Yantra", sub: shorten(data.yantra_name, 56), iconKey: "direction" },
    { label: "Donation", sub: shorten(data.donation_label, 56), iconKey: "heart" },
  ];
  const itemsSvg = renderItemsGrid(items, PALETTE.goldPale, PALETTE.gold);

  return renderInfographicShell({
    eyebrow: "REMEDIES AT A GLANCE",
    title: `Life Path ${data.number} remedies`,
    subtitle: `${planetName} ruled · daily practice protocol`,
    glyph,
    primary,
    accent,
    itemsSvg,
    footerRight: `${planetName} ratna · ratified by review panel`,
    ariaLabel: `Life Path Number ${data.number} remedies infographic with mantra, gemstone, day, colour, yantra, donation`,
  });
}

export const _PLANET_ENGLISH = PLANET_ENGLISH;
export const _PLANET_GLYPHS = PLANET_GLYPHS;
