#!/usr/bin/env node
// VastuCart illustration recolour pipeline.
// Reads every {theme}-{n}.svg in this directory, substitutes the source
// palette (mostly unDraw purple + pink skin + navy + greys) with the
// VastuCart brand palette, writes {theme}-{n}-vc.svg next to the original.
//
// Brand palette:
//   #013F47 deep teal   — primary fill / structural dark
//   #e8840a saffron     — secondary fill (warm accents, "skin", highlights)
//   #c9a84c gold        — tertiary accent (mid-tone separators, jewellery)
//   #faf6ef cream       — light background / paper
//
// Strategy: explicit per-source-colour mapping. We do NOT do hue-shift
// math because hue rotation on an unDraw illustration produces ugly
// results — the brand wants three brand colours, not 16 derivative tints.
// Every source colour is mapped to one of the four brand tokens (or a
// near-cream tint for very light greys).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Brand palette
const TEAL    = "#013F47";
const SAFFRON = "#e8840a";
const GOLD    = "#c9a84c";
const CREAM   = "#faf6ef";

// Lighter cream tints for soft backgrounds and shadows.
const CREAM_DARK = "#efe6d3"; // shadow/secondary cream
const TEAL_DARK  = "#012a30"; // deeper structural teal
const SAFFRON_LT = "#f6b463"; // saffron tint

// Source-to-brand colour map. Keys are normalised to lowercase 6-char hex.
const COLOR_MAP = {
  // unDraw primary purple → deep teal (main brand)
  "#6c63ff": TEAL,
  "#5d56e0": TEAL_DARK,
  "#4845b8": TEAL_DARK,
  "#3f3d56": TEAL_DARK,
  "#3f3d58": TEAL_DARK,
  "#2f2e41": TEAL_DARK,
  "#2f2e43": TEAL_DARK,
  "#090814": TEAL_DARK,

  // unDraw pinks / skin tones → saffron family (warm accent)
  "#ed9da0": SAFFRON,
  "#ffb9b9": SAFFRON_LT,
  "#ffb6b6": SAFFRON_LT,
  "#ffb8b8": SAFFRON_LT,
  "#ff6584": SAFFRON,
  "#f3a3a6": SAFFRON_LT,
  "#e8989b": SAFFRON,
  "#9f616a": SAFFRON,
  "#a0616a": SAFFRON,
  "#ffc1a0": SAFFRON_LT,
  "#fda6a6": SAFFRON_LT,

  // Greys / off-white → cream family (paper)
  "#e6e6e6": CREAM_DARK,
  "#f2f2f2": CREAM,
  "#d6d6e3": CREAM_DARK,
  "#ccc":    CREAM_DARK,
  "#cccccc": CREAM_DARK,
  "#fff":    CREAM,
  "#ffffff": CREAM,
  "#fffeff": CREAM,

  // OpenDoodles primary stroke (always pure black)
  "#000":    TEAL_DARK,
  "#000000": TEAL_DARK,

  // Less common unDraw tints — assign to gold accent
  "#a8a8a8": GOLD,
  "#bdbdbd": GOLD,
  "#dcdcdc": CREAM_DARK,
  "#f0f0f0": CREAM,
};

// Normalise: convert #abc → #aabbcc, lowercase.
function normaliseHex(raw) {
  let h = raw.toLowerCase();
  if (h.length === 4) {
    // #abc → #aabbcc
    h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return h;
}

// Replace every hex colour token in the SVG body. The unDraw and
// OpenDoodles SVGs use both fill="#xxx" attributes and inline
// style="fill:#xxx" declarations, plus stop-color attributes.
function recolourSVG(text) {
  // Match #RRGGBB or #RGB anywhere
  const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  let unmatched = new Map();

  const out = text.replace(hexPattern, (m) => {
    const norm = normaliseHex(m);
    if (COLOR_MAP[norm]) return COLOR_MAP[norm];
    // Track colours we did not explicitly map — assigned by luminance fallback.
    unmatched.set(norm, (unmatched.get(norm) || 0) + 1);
    return luminanceFallback(norm);
  });

  return { out, unmatched };
}

// Fallback: if a colour wasn't in the map, decide bucket by luminance.
function luminanceFallback(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Perceptual luminance (Rec. 709)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum > 230) return CREAM;
  if (lum > 180) return CREAM_DARK;
  if (lum > 110) return GOLD;
  if (lum > 50)  return TEAL;
  return TEAL_DARK;
}

function main() {
  const dir = __dirname;
  const files = readdirSync(dir)
    .filter(f => f.endsWith(".svg") && !f.endsWith("-vc.svg"));

  console.log(`Recolouring ${files.length} SVGs in ${dir}`);
  console.log(`Brand palette: TEAL=${TEAL}  SAFFRON=${SAFFRON}  GOLD=${GOLD}  CREAM=${CREAM}\n`);

  const aggregateUnmatched = new Map();
  for (const f of files) {
    const src = readFileSync(join(dir, f), "utf8");
    const { out, unmatched } = recolourSVG(src);
    const dest = f.replace(/\.svg$/, "-vc.svg");
    writeFileSync(join(dir, dest), out, "utf8");
    console.log(`  ${f}  →  ${dest}`);
    for (const [k, v] of unmatched) {
      aggregateUnmatched.set(k, (aggregateUnmatched.get(k) || 0) + v);
    }
  }

  if (aggregateUnmatched.size) {
    console.log("\nUnmapped colours (fallback by luminance):");
    const sorted = [...aggregateUnmatched.entries()].sort((a, b) => b[1] - a[1]);
    for (const [k, v] of sorted.slice(0, 15)) {
      console.log(`  ${k}  ×${v}`);
    }
  } else {
    console.log("\nEvery source colour matched the explicit map.");
  }
}

main();
