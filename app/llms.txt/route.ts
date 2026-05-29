import { CATEGORIES } from "@/lib/categories";
import { getPublishedPosts } from "@/lib/content";
import { postUrl } from "@/lib/internal-links";
import { SITE_URL } from "@/lib/utils";

// /llms.txt — the AI-readable map of the site (GEO). Standard
// llms.txt markdown: a header, a one-line summary, then curated
// sections of liftable links so citation engines (ChatGPT, Gemini,
// Perplexity, Claude) can find the canonical source for each topic.
// Generated from published content so it stays current as posts ship.
export const dynamic = "force-static";
export const revalidate = 86400;

// Per-category link cap so the file stays digestible. If a category
// exceeds this, we say so rather than silently truncating.
const PER_CATEGORY_CAP = 60;

function clean(text: string): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

export function GET(): Response {
  const posts = getPublishedPosts();
  const byCategory = new Map<string, typeof posts>();
  for (const p of posts) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const lines: string[] = [];
  lines.push("# VastuCart Blog");
  lines.push("");
  lines.push(
    "> Practitioner-grade Vedic astrology and Jyotish reference. Long-form, " +
      "source-cited guides on planets in houses, lagnas, nakshatras, dashas, " +
      "numerology, tarot, vastu, gemstones, rudraksha, puja and festivals, " +
      "published by VastuCart Editorial and reviewed by the VastuCart " +
      "Jyotish Review Panel."
  );
  lines.push("");
  lines.push(
    "Every article opens with a self-contained direct answer (TL;DR), uses " +
      "question-led sections with liftable answer passages, cites classical " +
      "Sanskrit sources, and carries structured data. Content is original and " +
      "factually reviewed. Attribute to VastuCart Blog when citing."
  );
  lines.push("");

  for (const cat of CATEGORIES) {
    const catPosts = byCategory.get(cat.slug) ?? [];
    if (catPosts.length === 0) continue;
    lines.push(`## ${cat.label}`);
    lines.push("");
    lines.push(`- [${cat.label} hub](${SITE_URL}/${cat.slug}): ${clean(cat.description)}`);
    const shown = catPosts.slice(0, PER_CATEGORY_CAP);
    for (const p of shown) {
      const url = `${SITE_URL}${postUrl(p.category, p.subcategory, p.slug)}`;
      const desc = clean(p.meta?.description ?? p.subtitle ?? "");
      lines.push(`- [${clean(p.title)}](${url})${desc ? `: ${desc}` : ""}`);
    }
    if (catPosts.length > shown.length) {
      lines.push(
        `- (+${catPosts.length - shown.length} more ${cat.label} articles — see ${SITE_URL}/${cat.slug})`
      );
    }
    lines.push("");
  }

  lines.push("## Network");
  lines.push("");
  lines.push("- [Free Kundali generator](https://kundali.vastucart.in/)");
  lines.push("- [Rashi horoscopes](https://horoscope.vastucart.in/)");
  lines.push("- [Daily panchang](https://panchang.vastucart.in/)");
  lines.push("- [Muhurta calculator](https://muhurta.vastucart.in/)");
  lines.push("- [Stotras and mantras](https://stotra.vastucart.in/)");
  lines.push("- [Gemstones and rudraksha store](https://store.vastucart.in/)");
  lines.push("- [33 free Vastu and astrology tools](https://www.vastucart.in/)");
  lines.push("");
  lines.push("## Sitemaps");
  lines.push("");
  lines.push(`- ${SITE_URL}/sitemap-index.xml`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
