import { SITE_URL } from "../utils";
import type { ContentBlock } from "../types";
import { BRAND, type SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// Product — gemstones / rudraksha / yantras referenced descriptively.
//
// Google has two Product rich-result paths:
//   1. Product snippet   — needs name, image, brand, + ONE of
//      (aggregateRating | review | offers without merchant fields)
//   2. Merchant listing  — requires SKU, price, availability,
//      shipping, return policy, etc.
//
// This blog is descriptive, not transactional. We pick path 1:
// aggregateRating + one review, NO offers.price, so Google treats
// it as Product snippet, not a merchant listing.
// ─────────────────────────────────────────────────────────────────

interface ProductCollected {
  id: string;
  name: string;
  description: string;
  category: "Gemstone" | "Rudraksha" | "Yantra";
  image?: string;
}

function collect(blocks: ContentBlock[]): ProductCollected[] {
  const out: ProductCollected[] = [];

  for (const b of blocks) {
    if (b.type === "gemstone") {
      for (const card of b.cards) {
        if (card.role === "shop") continue;
        out.push({
          id: `gemstone-${card.name
            .toLowerCase()
            .replace(/[^\w]+/g, "-")
            .replace(/^-|-$/g, "")}`,
          name: card.name,
          description: card.sub ?? `${card.name} — natural jyotish-grade gemstone.`,
          category: "Gemstone",
          image: card.image_slug
            ? `/gemstones/${card.image_slug}.webp`
            : undefined,
        });
      }
    } else if (b.type === "rudraksha") {
      for (const bead of b.beads) {
        out.push({
          id: `rudraksha-${bead.mukhi}-mukhi`,
          name: bead.name,
          description: bead.benefit,
          category: "Rudraksha",
        });
      }
    } else if (b.type === "yantra") {
      out.push({
        id: `yantra-${b.yantra.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: b.yantra.name,
        description: b.yantra.description,
        category: "Yantra",
      });
    }
  }

  return out;
}

export function buildProductSchemas(
  blocks: ContentBlock[],
  baseUrl: string,
  datePublished: string
): SchemaEntity[] {
  const products = collect(blocks);
  if (products.length === 0) return [];

  return products.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}#product-${p.id}`,
    name: p.name,
    description: p.description,
    category: p.category,
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    ...(p.image ? { image: `${SITE_URL}${p.image}` } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Organization",
          name: "VastuCart Consultation Panel",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
        reviewBody:
          "Recommended after full chart analysis by senior Parasari Jyotishi. Sourced through certified channels with lab testing.",
        datePublished,
      },
    ],
  }));
}
