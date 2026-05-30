// ─────────────────────────────────────────────────────────────────
// gemstone-card.ts — deterministic 1024×768 gemstone card.
//
// Renders a dark-brand 1024×768 card with a title band (gem name plus
// "for {planet}" when supplied) and the source gemstone photograph
// (public/gemstones/{gemSlug}.webp) embedded as a base64 <image>,
// centred inside a tasteful saffron ring/frame. This gives each
// graha-in-bhava post the `{slug}-{gem}.webp` image-figure it already
// references (declared 1024×768) without 404-ing.
//
// Mirrors the brand palette + structure of kundali-card.ts.
// Does NOT modify post JSON.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// ── Brand palette (matches kundali-card.ts / hero-card.ts) ─────────
const BG_DARK = "#013F47";
const BG_DARK_2 = "#012F36";
const BG_DARK_TOP = "#02545E";
const SAFFRON = "#e8840a";
const SAFFRON_LIGHT = "#f5a623";
const GOLD = "#E0BF7C";
const CREAM = "#F2EAD3";

// ── Card layout ────────────────────────────────────────────────────
const CARD_W = 1024;
const CARD_H = 768;
// Gemstone photo medallion: centred, pushed below the title band.
const GEM_CX = CARD_W / 2;
const GEM_CY = 460;
const GEM_R = 234; // photo radius (clip circle)
const RING_R = 250; // saffron outer ring radius

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface GemstoneCardOpts {
  /** Valid public/gemstones/ slug, e.g. "yellow-sapphire". */
  gemSlug: string;
  /** Human display name, e.g. "Yellow Sapphire". */
  gemName: string;
  /** Optional planet, e.g. "Jupiter" — renders "for Jupiter". */
  planet?: string;
  /** Override the public dir (defaults to <cwd>/public). */
  publicDir?: string;
}

export async function buildGemstoneCardSvg(
  opts: GemstoneCardOpts,
): Promise<string> {
  const { gemSlug, gemName, planet } = opts;
  const publicDir = opts.publicDir ?? path.join(process.cwd(), "public");
  const gemPath = path.join(publicDir, "gemstones", `${gemSlug}.webp`);

  if (!fs.existsSync(gemPath)) {
    throw new Error(
      `Gemstone source image missing: ${gemPath} (slug "${gemSlug}")`,
    );
  }

  // librsvg (sharp's SVG rasteriser) reliably decodes PNG data URIs but
  // not WebP, so transcode the source to PNG before embedding. Cap at
  // 2x the medallion diameter to keep the base64 payload small.
  const pngBuf = await sharp(gemPath)
    .resize(GEM_R * 2, GEM_R * 2, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const b64 = pngBuf.toString("base64");
  const dataUri = `data:image/png;base64,${b64}`;

  // The embedded photo fills the clip circle's bounding box.
  const imgX = GEM_CX - GEM_R;
  const imgY = GEM_CY - GEM_R;
  const imgSize = GEM_R * 2;

  const eyebrow = "RATNA (GEMSTONE)";
  const title = gemName;
  const subtitle = planet ? `for ${planet}` : "";
  const caption = planet
    ? `${gemName} — primary gemstone for ${planet}`
    : `${gemName} — recommended gemstone`;

  const subtitleEl = subtitle
    ? `    <text x="${CARD_W / 2}" y="150" font-family="Georgia, serif" font-size="24" fill="${CREAM}" font-style="italic" letter-spacing="0.5">${escapeXml(subtitle)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}">
  <defs>
    <linearGradient id="gbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BG_DARK_TOP}"/>
      <stop offset="55%" stop-color="${BG_DARK}"/>
      <stop offset="100%" stop-color="${BG_DARK_2}"/>
    </linearGradient>
    <radialGradient id="gglow" cx="78%" cy="14%" r="52%">
      <stop offset="0%" stop-color="rgba(232,132,10,0.16)"/>
      <stop offset="100%" stop-color="rgba(232,132,10,0)"/>
    </radialGradient>
    <radialGradient id="gemglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(245,166,35,0.28)"/>
      <stop offset="70%" stop-color="rgba(245,166,35,0.08)"/>
      <stop offset="100%" stop-color="rgba(245,166,35,0)"/>
    </radialGradient>
    <clipPath id="gemclip">
      <circle cx="${GEM_CX}" cy="${GEM_CY}" r="${GEM_R}"/>
    </clipPath>
  </defs>

  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#gbg)"/>
  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#gglow)"/>

  <!-- faint diamond-pattern dots (brand dark-section motif) -->
  <g fill="${GOLD}" opacity="0.14">
    <circle cx="96" cy="120" r="2"/>
    <circle cx="928" cy="120" r="2"/>
    <circle cx="120" cy="712" r="2"/>
    <circle cx="904" cy="712" r="2"/>
    <circle cx="512" cy="40" r="1.6"/>
  </g>

  <!-- title band -->
  <g text-anchor="middle">
    <text x="${CARD_W / 2}" y="62" font-family="'Helvetica Neue', Arial, sans-serif" font-size="15" fill="${GOLD}" letter-spacing="4" font-weight="500">${escapeXml(eyebrow)}</text>
    <text x="${CARD_W / 2}" y="116" font-family="Georgia, 'Times New Roman', serif" font-size="46" fill="${SAFFRON_LIGHT}" font-weight="600" font-style="italic">${escapeXml(title)}</text>
${subtitleEl}
  </g>

  <!-- soft glow behind the gem medallion -->
  <circle cx="${GEM_CX}" cy="${GEM_CY}" r="${RING_R + 40}" fill="url(#gemglow)"/>

  <!-- saffron ring frame -->
  <circle cx="${GEM_CX}" cy="${GEM_CY}" r="${RING_R}" fill="${BG_DARK_2}" stroke="${SAFFRON}" stroke-width="6"/>
  <circle cx="${GEM_CX}" cy="${GEM_CY}" r="${RING_R - 10}" fill="none" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="1.6"/>

  <!-- gemstone photograph, clipped to the inner circle -->
  <image href="${dataUri}" xlink:href="${dataUri}" x="${imgX}" y="${imgY}" width="${imgSize}" height="${imgSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#gemclip)"/>

  <!-- thin inner stroke to seat the photo in the frame -->
  <circle cx="${GEM_CX}" cy="${GEM_CY}" r="${GEM_R}" fill="none" stroke="${SAFFRON}" stroke-opacity="0.45" stroke-width="2"/>

  <!-- caption -->
  <text x="${CARD_W / 2}" y="${CARD_H - 30}" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="rgba(224,191,124,0.85)" font-style="italic" letter-spacing="1">${escapeXml(caption)}</text>
</svg>
`;
}
