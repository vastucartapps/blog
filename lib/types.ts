// VastuCart Blog — master type contract.
// Source of truth for every content file, component prop, and schema builder.

// ──────────────────────────────────────────
// TAXONOMY
// ──────────────────────────────────────────

export interface PlanetStates {
  uchha: string; neech: string; digbali: string; marak: string;
  karak: string; ast: string; vakri: string; baal: string;
  kumar: string; yuva: string; vridh: string; mrit: string;
}

export interface Planet {
  id: string; sanskrit: string; english: string; symbol: string; icon_slot: string;
  owns: string[]; exalted_in: string; exalted_degree: number; debilitated_in: string;
  friends: string[]; enemies: string[]; neutral: string[]; karakatva: string[];
  body_parts: string[]; element: string; gender: string; color: string;
  gemstone: string; rudraksha_mukhi: number[]; yantra: string; mantra: string;
  stotra: string; day: string; direction: string; states: PlanetStates;
}

export interface Sign {
  id: string; sanskrit: string; english: string; symbol: string; icon_slot: string;
  number: number; lord: string; element: string; quality: string; gender: string;
  nature: string; body_part: string; direction: string; color: string;
  lucky_numbers: number[]; lucky_days: string[]; compatible_signs: string[];
  description_short: string;
}

export interface House {
  number: number; sanskrit: string; common_name: string; english: string;
  rules: string[]; natural_sign: string; natural_lord: string; type: string[];
  body_parts: string[]; direction: string; relatives: string[];
  significators: string[]; description: string;
}

export interface Nakshatra {
  id: string; sanskrit: string; number: number; lord: string; sign: string;
  degrees: string; symbol: string; deity: string; nature: string;
  body_part: string; pada_lords: string[]; qualities: string[];
}

export interface Gemstone {
  id?: string; english: string; sanskrit: string; planet: string;
  metal: string; finger: string; day: string; hora: string;
  weight_min_ratti: number; weight_ideal_ratti: number;
  alternative: string[]; purification: string; mantra_while_wearing: string;
  contraindicated_with: string[]; shop_url: string; disclaimer: string;
  image?: string;
}

export interface Rudraksha {
  mukhi: number; planet: string; deity: string; benefit: string;
  wearing_day: string; mantra: string; contraindications: string[];
}

export interface Yantra {
  id: string; name: string; sanskrit?: string; planet_or_deity: string;
  direction: string; material: string[]; installation: string;
  mantra: string; benefits: string[];
}

export interface Stotra {
  id: string; name: string; planet_or_deity: string;
  first_verse_sanskrit: string; first_verse_transliteration: string;
  meaning: string; source: string; url: string;
}

export interface Author {
  id: string; name: string; title: string; initials: string;
  avatar_url?: string; avatar_gradient: string; bio: string;
  specialization: string[]; categories: string[]; experience_years: number;
  location: string; lineage?: string; article_count: number;
  schema_same_as: string[];
}

// ──────────────────────────────────────────
// ARTICLE SYSTEM
// ──────────────────────────────────────────

export type TemplateType =
  | "planet-in-house"
  | "lagna-profile"
  | "nakshatra"
  | "tarot-card"
  | "numerology-number"
  | "vastu"
  | "gemstone"
  | "puja-vidhi"
  | "festival"
  | "rudraksha";

export type PostStatus =
  | "draft" | "ready" | "scheduled" | "published"
  | "DRAFT" | "READY" | "SCHEDULED" | "PUBLISHED" | "GENERATED";

export interface HreflangEntry { lang: string; url: string; }
export interface BreadcrumbEntry { name: string; url: string; }

export interface PostMeta {
  title: string;
  description: string;
  keywords?: string[];
  focus_keyword: string;
  secondary_keywords: string[];
  lsi_keywords: string[];
  og_title?: string;
  og_description?: string;
  og_image: string;
  canonical: string;
  robots?: string;
  hreflang?: HreflangEntry[];
  breadcrumb?: BreadcrumbEntry[];
}

// ──────────────────────────────────────────
// CONTENT BLOCKS — the ContentBlock[] union is the article body.
// The order of blocks in the array IS the order on the page.
// ──────────────────────────────────────────

export type GemTone = "saffron" | "teal" | "rose";

export interface StatCell {
  label: string;
  value: string;
  sub?: string;
  icon?: string; // icon name from Icon registry
  tone?: "default" | "good";
}

export interface InfoKV {
  k: string;
  v: string;
  tone?: "default" | "good" | "bad";
}

export interface InfoCard {
  icon: string;
  title: string;
  subtitle: string;
  items: InfoKV[];
}

export interface DashaRow {
  mahadasha: string;
  duration: string;
  themes: string;
  intensity: "Very high" | "High" | "Good" | "Moderate" | "Low";
  highlight?: boolean;
  intensity_bar_color?: string; // hex or var
  intensity_bar_width?: number; // px
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface GemCard {
  name: string;
  sanskrit?: string;
  role: "primary" | "secondary" | "shop";
  sub?: string;
  items?: InfoKV[];
  icon_variant?: "ruby" | "emerald" | "pearl" | "coral" | "saphire" | "generic";
  /**
   * Slug under /public/gemstones/ — e.g. "ruby", "red-coral", "pearl",
   * "emerald", "yellow-sapphire", "diamond", "blue-sapphire", "hessonite",
   * "cats-eye", "opal". Renders the actual gemstone photograph.
   */
  image_slug?: string;
  shop_label?: string;
  shop_url?: string;
}

export interface RudrakshaBead {
  mukhi: number;
  name: string;
  sub: string;
  benefit: string;
}

export interface YantraBlockData {
  name: string;
  sanskrit?: string;
  description: string;
  direction: string;
  install_day: string;
  material: string;
  cta_label?: string;
  cta_url?: string;
}

export interface StotraBlockData {
  eyebrow: string;
  title: string;
  sub: string;
  verse: string;
  translation: string;
  url: string;
}

export interface ToolLink {
  label: string;
  url: string;
  sub: string;
  icon: string; // icon name
  icon_variant: "dark" | "saff" | "teal" | "rose";
}

export interface AuthorCardData {
  author_id: string;
  title_line: string;
  bio: string;
  badges: { label: string; tone: "teal" | "saff" | "rose" }[];
  meta: { icon: string; text: string }[];
}

export interface RelatedPostRef {
  title: string;
  sub: string;
  href: string;
  icon_variant?: "sun" | "moon" | "rose" | "teal" | "generic";
}

export interface CTAInlineData {
  title: string;
  subtitle: string;
  button_label: string;
  button_url: string;
  button_variant: "saffron" | "teal";
}

export interface CTABandData {
  title: string;
  subtitle: string;
  buttons: {
    label: string;
    url: string;
    variant: "primary" | "teal" | "outline";
  }[];
}

export interface InternalLinksData {
  title: string;
  intro?: string;
  tools: ToolLink[];
}

// ── Per-category unique section data shapes

export interface TarotKeywordSet {
  label: string;
  items: string[];
}

export interface TarotCardVisualData {
  card_name: string;
  card_number: string;
  arcana: "Major" | "Minor";
  image_slot?: string;
  upright_keywords: string[];
  reversed_keywords: string[];
}

export interface SpreadPosition {
  name: string;
  meaning: string;
  context?: string;
}

export interface NumerologyDisplayData {
  number: string;
  planet: string;
  element: string;
  color: string;
  vibration?: string;
}

export interface CompatibilityScore {
  with: number;
  score: "high" | "neutral" | "low";
  label: string;
  note?: string;
}

export interface VastuDirectionZone {
  direction: string;
  deity: string;
  element: string;
  planet: string;
}

export interface PujaStep {
  number: number;
  title: string;
  description: string;
  mantra?: string;
  duration?: string;
}

export interface SamagriItem {
  name: string;
  quantity: string;
  purpose: string;
  optional?: boolean;
}

export interface WearingRitualStep {
  action: string;
  timing: string;
  mantra?: string;
}

export interface ContraIndication {
  condition: string;
  reason: string;
}

// ── ContentBlock union

export type ContentBlock =
  | {
      type: "prose";
      eyebrow?: string;
      heading?: string;
      html: string;
    }
  | {
      type: "pull-quote";
      variant?: GemTone;
      text: string;
    }
  | {
      type: "stat-strip";
      cells: StatCell[];
    }
  | {
      type: "info-grid";
      eyebrow?: string;
      heading?: string;
      cards: InfoCard[];
    }
  | {
      type: "effects-grid";
      eyebrow?: string;
      heading?: string;
      positive: string[];
      negative: string[];
      career: string[];
      positive_label?: string;
      negative_label?: string;
      career_label?: string;
    }
  | {
      type: "kundali-visual";
      eyebrow?: string;
      heading?: string;
      planet: string;
      house: number;
      lagna: string;
      legend: { color: "saffron" | "white" | "teal"; text: string }[];
      cta_label?: string;
      cta_url?: string;
    }
  | {
      type: "dasha-table";
      eyebrow?: string;
      heading?: string;
      intro_html?: string;
      rows: DashaRow[];
    }
  | {
      type: "gemstone";
      eyebrow?: string;
      heading?: string;
      intro_html?: string;
      cards: GemCard[];
      disclaimer: string;
    }
  | {
      type: "rudraksha";
      eyebrow?: string;
      heading?: string;
      intro_html?: string;
      beads: RudrakshaBead[];
    }
  | {
      type: "yantra";
      eyebrow?: string;
      heading?: string;
      yantra: YantraBlockData;
    }
  | {
      type: "stotra";
      eyebrow?: string;
      heading?: string;
      stotra: StotraBlockData;
    }
  | {
      type: "faq";
      eyebrow?: string;
      heading?: string;
      items: FAQItem[];
    }
  | {
      type: "author";
      author: AuthorCardData;
    }
  | {
      type: "internal-links";
      eyebrow?: string;
      heading?: string;
      data: InternalLinksData;
    }
  | {
      type: "related-posts";
      eyebrow?: string;
      heading?: string;
      posts: RelatedPostRef[];
    }
  | {
      type: "cta-band";
      data: CTABandData;
    }
  | {
      type: "cta-inline";
      data: CTAInlineData;
    }
  | {
      type: "divider";
      gem: GemTone | "accent";
    }
  // ── Per-category unique sections
  | {
      type: "tarot-card-visual";
      eyebrow?: string;
      heading?: string;
      data: TarotCardVisualData;
    }
  | {
      type: "spread-positions";
      eyebrow?: string;
      heading?: string;
      positions: SpreadPosition[];
    }
  | {
      type: "numerology-display";
      eyebrow?: string;
      heading?: string;
      data: NumerologyDisplayData;
    }
  | {
      type: "compatibility-grid";
      eyebrow?: string;
      heading?: string;
      number: number;
      compatibilities: CompatibilityScore[];
    }
  | {
      type: "vastu-compass";
      eyebrow?: string;
      heading?: string;
      highlight_direction:
        | "N"
        | "NE"
        | "E"
        | "SE"
        | "S"
        | "SW"
        | "W"
        | "NW";
      zones: VastuDirectionZone[];
    }
  | {
      type: "muhurta-timeline";
      eyebrow?: string;
      heading?: string;
      festival_key: string;
    }
  | {
      type: "puja-vidhi";
      eyebrow?: string;
      heading?: string;
      steps: PujaStep[];
    }
  | {
      type: "samagri-list";
      eyebrow?: string;
      heading?: string;
      items: SamagriItem[];
      shop_label?: string;
      shop_url?: string;
    }
  | {
      type: "wearing-ritual";
      eyebrow?: string;
      heading?: string;
      steps: WearingRitualStep[];
    }
  | {
      type: "contra-indications";
      eyebrow?: string;
      heading?: string;
      do_not_wear: ContraIndication[];
    };

// ──────────────────────────────────────────
// ARTICLE POST shape (a content/*.json file)
// ──────────────────────────────────────────

export interface HeroTag {
  label: string;
  tone?: "default" | "teal";
}

export interface HeroMetaItem {
  icon: "clock" | "check" | "user" | "calendar" | string;
  value: string;
}

export interface PostHeroData {
  badge_label: string;
  title_html: string; // may contain <em>...</em>
  description: string;
  meta: HeroMetaItem[];
  tags: HeroTag[];
}

export interface ArticlePost {
  id: string;
  slug: string;
  title: string;
  title_hindi?: string;
  subtitle: string;
  category: string;
  subcategory: string;
  template: TemplateType;
  tags: string[];
  author_id: string;
  reading_time_minutes: number;
  status: PostStatus;
  published_at: string;
  updated_at: string;
  meta: PostMeta;
  hero: PostHeroData;
  content: ContentBlock[];
  schema: Record<string, unknown>;
  // taxonomy foreign keys
  planet_id?: string;
  sign_id?: string;
  house_number?: number;
  lagna_id?: string;
  nakshatra_id?: string;
}

// ──────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────

export interface SubCategory {
  id: string; slug: string; label: string; label_hindi: string;
  description: string; target_post_count: number;
}

export interface CategoryDef {
  id: string; slug: string; label: string; label_hindi: string;
  description: string; icon_name: string; color_var: string;
  author_id: string; sort_order: number; post_count_target: number;
  subcategories: SubCategory[];
}

export interface NetworkNode {
  label: string; description: string; domain: string; url: string;
  icon: string; cta_text: string; relevant_for: string[];
}
