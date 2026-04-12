// ─────────────────────────────────────────────────────────────────
// Category visual themes.
//
// Same layout, same components, same spacing across every category.
// Only the colour palette and accent ornaments change. Each theme is
// pure data — no behaviour, no JSX. Components import getTheme(slug)
// and apply the values via inline style. Layout is FROZEN; this file
// only swaps colour and tint values.
//
// Source of truth: public/category_variation_system.html
// ─────────────────────────────────────────────────────────────────

export interface CategoryTheme {
  /** Hero outer background colour beneath the diamond pattern */
  heroBg: string;
  /** Primary accent colour (badges, eyebrows, divider gem, link hover) */
  accentColor: string;
  /** Pale tint of the accent (badge bg, soft fills) */
  accentPale: string;
  /** Mid tint of the accent (badge border, hover fills) */
  accentMid: string;
  /** Saturated dark version of accent (used on light backgrounds) */
  accentDeep: string;
  /** Existing Badge tone variant name to fall back on */
  badgeVariant: "saffron" | "teal" | "rose" | "gold" | "green";
  /** Radial glow colour used on hero ::before */
  glowColor: string;
  /** Secondary radial glow colour used on hero ::after */
  glowColorAlt: string;
  /** Text colour for highlighted (teal-style) hero tag chip */
  tagColor: string;
  /** Background colour for highlighted hero tag chip */
  tagBg: string;
  /** Border colour for highlighted hero tag chip */
  tagBorder: string;
  /** Stat strip label colour (uppercase eyebrow above each cell) */
  statLabelColor: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  jyotish: {
    heroBg: "#013F47",
    accentColor: "#f5a623",
    accentPale: "#fff3e0",
    accentMid: "#fde8c0",
    accentDeep: "#e8840a",
    badgeVariant: "saffron",
    glowColor: "rgba(51,138,149,0.22)",
    glowColorAlt: "rgba(232,132,10,0.10)",
    tagColor: "#93d4db",
    tagBg: "rgba(51,138,149,0.20)",
    tagBorder: "rgba(74,165,178,0.40)",
    statLabelColor: "#338a95",
  },
  numerology: {
    heroBg: "#1a1a0e",
    accentColor: "#e2c97e",
    accentPale: "#fdf6e3",
    accentMid: "#f0e0a0",
    accentDeep: "#c9a84c",
    badgeVariant: "gold",
    glowColor: "rgba(201,168,76,0.30)",
    glowColorAlt: "rgba(232,132,10,0.10)",
    tagColor: "#e2c97e",
    tagBg: "rgba(201,168,76,0.20)",
    tagBorder: "rgba(226,201,126,0.40)",
    statLabelColor: "#c9a84c",
  },
  tarot: {
    heroBg: "#1a0e2e",
    accentColor: "#d4a0a8",
    accentPale: "#fdf0f1",
    accentMid: "#f5d5d9",
    accentDeep: "#b76e79",
    badgeVariant: "rose",
    glowColor: "rgba(183,110,121,0.30)",
    glowColorAlt: "rgba(155,89,182,0.18)",
    tagColor: "#d4a0a8",
    tagBg: "rgba(183,110,121,0.20)",
    tagBorder: "rgba(212,160,168,0.40)",
    statLabelColor: "#b76e79",
  },
  vastu: {
    heroBg: "#0e1a0e",
    accentColor: "#6fcf97",
    accentPale: "#f0faf2",
    accentMid: "#b8dfc0",
    accentDeep: "#278950",
    badgeVariant: "green",
    glowColor: "rgba(39,137,80,0.28)",
    glowColorAlt: "rgba(111,207,151,0.14)",
    tagColor: "#6fcf97",
    tagBg: "rgba(39,137,80,0.20)",
    tagBorder: "rgba(111,207,151,0.40)",
    statLabelColor: "#278950",
  },
  puja: {
    heroBg: "#1a0e0a",
    accentColor: "#f5a623",
    accentPale: "#fff3e0",
    accentMid: "#fde8c0",
    accentDeep: "#e8840a",
    badgeVariant: "saffron",
    glowColor: "rgba(232,132,10,0.26)",
    glowColorAlt: "rgba(183,110,121,0.10)",
    tagColor: "#f5a623",
    tagBg: "rgba(232,132,10,0.20)",
    tagBorder: "rgba(245,166,35,0.40)",
    statLabelColor: "#e8840a",
  },
  festivals: {
    heroBg: "#1a100a",
    accentColor: "#f5a623",
    accentPale: "#fff3e0",
    accentMid: "#fde8c0",
    accentDeep: "#e8840a",
    badgeVariant: "saffron",
    glowColor: "rgba(232,132,10,0.34)",
    glowColorAlt: "rgba(245,166,35,0.16)",
    tagColor: "#f5a623",
    tagBg: "rgba(232,132,10,0.22)",
    tagBorder: "rgba(245,166,35,0.42)",
    statLabelColor: "#e8840a",
  },
  gemstones: {
    heroBg: "#1a150a",
    accentColor: "#e2c97e",
    accentPale: "#fdf6e3",
    accentMid: "#f0e0a0",
    accentDeep: "#c9a84c",
    badgeVariant: "gold",
    glowColor: "rgba(201,168,76,0.32)",
    glowColorAlt: "rgba(232,132,10,0.12)",
    tagColor: "#e2c97e",
    tagBg: "rgba(201,168,76,0.22)",
    tagBorder: "rgba(226,201,126,0.42)",
    statLabelColor: "#c9a84c",
  },
  rudraksha: {
    heroBg: "#1a0e0e",
    accentColor: "#d4a0a8",
    accentPale: "#fdf0f1",
    accentMid: "#f5d5d9",
    accentDeep: "#b76e79",
    badgeVariant: "rose",
    glowColor: "rgba(183,110,121,0.28)",
    glowColorAlt: "rgba(212,160,168,0.14)",
    tagColor: "#d4a0a8",
    tagBg: "rgba(183,110,121,0.20)",
    tagBorder: "rgba(212,160,168,0.40)",
    statLabelColor: "#b76e79",
  },
};

export type CategoryId = keyof typeof CATEGORY_THEMES;

export function getTheme(category: string | undefined): CategoryTheme {
  if (!category) return CATEGORY_THEMES.jyotish;
  return CATEGORY_THEMES[category] ?? CATEGORY_THEMES.jyotish;
}
