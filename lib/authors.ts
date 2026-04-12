import type { Author } from "./types";

// Minimal placeholder registry. Full taxonomy JSON populated in Part B.
// Real bios and schema_same_as links are added before launch.
export const AUTHORS: Record<string, Author> = {
  "pt-raghav-sharma": {
    id: "pt-raghav-sharma",
    name: "Pt. Raghav Sharma",
    title: "Jyotish Acharya, 22 years",
    initials: "RS",
    avatar_gradient: "from-saffron to-gold",
    bio: "Varanasi-based practicing Jyotishi with over two decades of consultation experience across Graha, Dasha and remedial astrology.",
    specialization: ["Jyotish", "Graha", "Dasha", "Muhurta", "Remedies"],
    categories: ["jyotish", "gemstones", "rudraksha"],
    experience_years: 22,
    location: "Varanasi, India",
    lineage: "Parasari Jyotish",
    article_count: 0,
    schema_same_as: [],
  },
  "kavya-menon": {
    id: "kavya-menon",
    name: "Kavya Menon",
    title: "Tarot Reader and Numerologist",
    initials: "KM",
    avatar_gradient: "from-rose to-teal-light",
    bio: "Professional tarot reader and numerologist blending Rider Waite tradition with Vedic numerology for everyday guidance.",
    specialization: ["Tarot", "Numerology", "Angel Numbers"],
    categories: ["tarot", "numerology"],
    experience_years: 12,
    location: "Bengaluru, India",
    article_count: 0,
    schema_same_as: [],
  },
  "pt-suresh-mishra": {
    id: "pt-suresh-mishra",
    name: "Pt. Suresh Mishra",
    title: "Vastu and Puja Acharya",
    initials: "SM",
    avatar_gradient: "from-teal to-dark",
    bio: "Traditional Vastu consultant and karmakandi priest with expertise in havan, puja vidhi and festival rituals.",
    specialization: ["Vastu", "Puja", "Festivals", "Stotra"],
    categories: ["vastu", "puja", "festivals", "stotra"],
    experience_years: 28,
    location: "Ujjain, India",
    lineage: "Maitrayaniya Shakha",
    article_count: 0,
    schema_same_as: [],
  },
};

export function getAuthor(id: string): Author | undefined {
  return AUTHORS[id];
}
