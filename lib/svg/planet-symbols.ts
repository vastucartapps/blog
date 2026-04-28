// ─────────────────────────────────────────────────────────────────
// planet-symbols.ts — pure-SVG-path renderings of the nine classical
// Vedic graha symbols.
//
// We can't rely on Unicode astrological glyphs (☉ ☽ ♂ ☿ ♃ ♀ ♄ ☊ ☋)
// because sharp/librsvg falls back to whatever font happens to carry
// those code points and frequently substitutes Devanagari letters
// when a planetary symbol is missing — producing the broken-icon
// effect users see in the rasterised hero/mandala cards.
//
// Each renderPlanetSymbol() returns a self-contained <g> centred at
// (0,0), drawn with stroke=`color`, sized to fit a ~64×64 box. Use
// the `transform` parameter to position and scale into a parent.
// ─────────────────────────────────────────────────────────────────

export type PlanetSymbolKey =
  | "surya"
  | "chandra"
  | "mangal"
  | "budha"
  | "guru"
  | "shukra"
  | "shani"
  | "rahu"
  | "ketu";

interface SymbolOpts {
  /** Stroke / fill colour for the planet glyph. */
  color: string;
  /** Stroke width in the symbol's local 64-unit coordinate space. Default 3. */
  strokeWidth?: number;
  /** Optional outer transform applied to the whole <g>. */
  transform?: string;
}

function commonStrokeAttrs(opts: SymbolOpts): string {
  const sw = opts.strokeWidth ?? 3;
  return `stroke="${opts.color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
}

// Surya (Sun) ☉ — outer circle with a central dot, no rays so the
// figure stays clean inside the dark teal medallion. The dot reads
// as the bindu (point) of pure consciousness in classical Jyotish.
function surya(opts: SymbolOpts): string {
  const sw = opts.strokeWidth ?? 3;
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <circle cx="0" cy="0" r="22" ${commonStrokeAttrs(opts)}/>
    <circle cx="0" cy="0" r="4.5" fill="${opts.color}" stroke="${opts.color}" stroke-width="${sw}"/>
  </g>`;
}

// Chandra (Moon) ☽ — open crescent, opens to the right, drawn with a
// single closed path (large outer arc minus a smaller inset arc).
function chandra(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <path d="M 6 -22 A 22 22 0 1 0 6 22 A 16 16 0 1 1 6 -22 Z"
          fill="${opts.color}" stroke="${opts.color}" stroke-width="${opts.strokeWidth ?? 1.6}" stroke-linejoin="round"/>
  </g>`;
}

// Mangal (Mars) ♂ — circle with arrow pointing to the upper right.
function mangal(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <circle cx="-4" cy="6" r="13" ${commonStrokeAttrs(opts)}/>
    <path d="M 5 -3 L 22 -20" ${commonStrokeAttrs(opts)}/>
    <path d="M 22 -20 L 22 -10 M 22 -20 L 12 -20" ${commonStrokeAttrs(opts)}/>
  </g>`;
}

// Budha (Mercury) ☿ — crescent on top, circle in middle, cross below.
function budha(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <path d="M -10 -18 A 10 10 0 0 0 10 -18" ${commonStrokeAttrs(opts)}/>
    <circle cx="0" cy="-2" r="11" ${commonStrokeAttrs(opts)}/>
    <line x1="0" y1="9" x2="0" y2="24" ${commonStrokeAttrs(opts)}/>
    <line x1="-8" y1="16" x2="8" y2="16" ${commonStrokeAttrs(opts)}/>
  </g>`;
}

// Guru (Jupiter) ♃ — stylised 4 / curl-and-cross-bar.
function guru(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <path d="M -16 -14 Q -22 -14 -22 -8 Q -22 -2 -14 -2 L 14 -2"
          ${commonStrokeAttrs(opts)}/>
    <path d="M 8 -22 L 8 22" ${commonStrokeAttrs(opts)}/>
  </g>`;
}

// Shukra (Venus) ♀ — circle with cross below.
function shukra(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <circle cx="0" cy="-6" r="12" ${commonStrokeAttrs(opts)}/>
    <line x1="0" y1="6" x2="0" y2="24" ${commonStrokeAttrs(opts)}/>
    <line x1="-8" y1="14" x2="8" y2="14" ${commonStrokeAttrs(opts)}/>
  </g>`;
}

// Shani (Saturn) ♄ — vertical with bottom hook + horizontal cross.
function shani(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <path d="M 4 -22 L 4 14 Q 4 22 -4 22 Q -12 22 -12 14"
          ${commonStrokeAttrs(opts)}/>
    <line x1="-8" y1="-14" x2="14" y2="-14" ${commonStrokeAttrs(opts)}/>
  </g>`;
}

// Rahu (north node) ☊ — dragon's head: horseshoe opening downward,
// with two foot-dots.
function rahu(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <path d="M -14 16 L -14 -4 Q -14 -22 0 -22 Q 14 -22 14 -4 L 14 16"
          ${commonStrokeAttrs(opts)}/>
    <circle cx="-14" cy="20" r="3.5" fill="${opts.color}"/>
    <circle cx="14" cy="20" r="3.5" fill="${opts.color}"/>
  </g>`;
}

// Ketu (south node) ☋ — dragon's tail: horseshoe opening upward,
// with two head-dots.
function ketu(opts: SymbolOpts): string {
  return `<g ${opts.transform ? `transform="${opts.transform}"` : ""}>
    <path d="M -14 -16 L -14 4 Q -14 22 0 22 Q 14 22 14 4 L 14 -16"
          ${commonStrokeAttrs(opts)}/>
    <circle cx="-14" cy="-20" r="3.5" fill="${opts.color}"/>
    <circle cx="14" cy="-20" r="3.5" fill="${opts.color}"/>
  </g>`;
}

const RENDERERS: Record<PlanetSymbolKey, (o: SymbolOpts) => string> = {
  surya,
  chandra,
  mangal,
  budha,
  guru,
  shukra,
  shani,
  rahu,
  ketu,
};

/**
 * Render a Vedic planet symbol as inline SVG (no font dependency).
 * Drop the returned string into the SVG where you would have placed
 * a Unicode glyph <text>.
 */
export function renderPlanetSymbol(
  planet: PlanetSymbolKey,
  opts: SymbolOpts,
): string {
  const fn = RENDERERS[planet];
  if (!fn) throw new Error(`Unknown planet symbol: ${planet}`);
  return fn(opts);
}
