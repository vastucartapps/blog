// ─────────────────────────────────────────────────────────────────
// Schema builder — emits all 22 JSON-LD entities for any post.
//
// Single function `buildPostSchema(post)` returns an array of
// schema objects ready to be serialised into a sequence of
// `<script type="application/ld+json">` tags by the post page route.
//
// Cross-subdomain entity unity: Organization always uses the
// canonical @id `https://vastucart.in/#org` so all 10 subdomains
// merge into one Knowledge Graph entity.
// ─────────────────────────────────────────────────────────────────

import type { ArticlePost } from "./types";
import { ORGANIZATION_SAME_AS, KNOWLEDGE_GRAPH_REFS, getCategory, getSubcategory } from "./categories";
import { AUTHORS } from "./authors";
import { absoluteUrl, SITE_URL } from "./utils";
import { authorUrl } from "./internal-links";

const ORG_ID = "https://vastucart.in/#org";
const WEBSITE_ID = `${SITE_URL}/#website`;
const GLOSSARY_ID = `${SITE_URL}/#glossary`;

interface SchemaEntity {
  [key: string]: unknown;
}

export function buildPostSchema(post: ArticlePost): SchemaEntity[] {
  const cat = getCategory(post.category);
  const sub = getSubcategory(post.category, post.subcategory);
  const author = AUTHORS[post.author_id];
  const url = absoluteUrl(`/${post.category}/${post.subcategory}/${post.slug}`);
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;
  const personId = absoluteUrl(`${authorUrl(post.author_id)}#person`);

  const entities: SchemaEntity[] = [];

  // 1. Organization (canonical, shared across all 10 subdomains)
  entities.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "VastuCart",
    url: "https://vastucart.in",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/VastuCartLogo.png`,
      width: 1024,
      height: 1024,
    },
    sameAs: [...ORGANIZATION_SAME_AS, ...KNOWLEDGE_GRAPH_REFS],
    foundingDate: "2018-01-01",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://vastucart.in/contact",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  });

  // 2. WebSite (with SearchAction)
  entities.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "VastuCart Blog",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });

  // 3. WebPage
  entities.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageId,
    url,
    name: post.meta.title,
    description: post.meta.description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-IN",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: post.meta.og_image.startsWith("http")
        ? post.meta.og_image
        : `${SITE_URL}${post.meta.og_image}`,
    },
    breadcrumb: { "@id": `${pageId}#breadcrumb` },
    datePublished: post.published_at,
    dateModified: post.updated_at,
  });

  // 4. Article
  const wordCount = countWords(post);
  entities.push({
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleId,
    isPartOf: { "@id": pageId },
    mainEntityOfPage: { "@id": pageId },
    headline: post.title,
    name: post.title,
    description: post.meta.description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@id": personId },
    publisher: { "@id": ORG_ID },
    image: post.meta.og_image.startsWith("http")
      ? post.meta.og_image
      : `${SITE_URL}${post.meta.og_image}`,
    articleSection: cat?.label ?? post.category,
    keywords: post.tags.join(", "),
    wordCount,
    timeRequired: `PT${post.reading_time_minutes}M`,
    inLanguage: "en-IN",
  });

  // 5. BreadcrumbList
  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: cat?.label ?? post.category, url: `${SITE_URL}/${post.category}` },
    {
      name: sub?.label ?? post.subcategory,
      url: `${SITE_URL}/${post.category}/${post.subcategory}`,
    },
    { name: post.title, url },
  ];
  entities.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageId}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  });

  // 6. FAQPage (from the faq block, if present)
  const faqBlock = post.content.find((b) => b.type === "faq");
  if (faqBlock && faqBlock.type === "faq") {
    entities.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageId}#faq`,
      mainEntity: faqBlock.items.map((q) => ({
        "@type": "Question",
        name: q.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.a,
        },
      })),
    });
  }

  // 7. Person (author)
  if (author) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name: author.name,
      jobTitle: author.title,
      description: author.bio,
      url: absoluteUrl(authorUrl(post.author_id)),
      image: `${SITE_URL}/authors/${post.author_id}.webp`,
      knowsAbout: author.specialization,
      alumniOf: author.lineage ?? "Parashari Jyotish lineage",
      birthPlace: author.location,
      sameAs: author.schema_same_as,
      worksFor: { "@id": ORG_ID },
    });

    // 8. ProfilePage
    entities.push({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${absoluteUrl(authorUrl(post.author_id))}#profile`,
      mainEntity: { "@id": personId },
      dateCreated: post.published_at,
      dateModified: post.updated_at,
    });
  }

  // 9-12. DefinedTermSet + DefinedTerm entries
  const definedTerms = extractDefinedTerms(post);
  if (definedTerms.length > 0) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": GLOSSARY_ID,
      name: "VastuCart Jyotish Glossary",
      description:
        "Canonical glossary of Sanskrit terms used across the VastuCart Jyotish, Tarot, Numerology, Vastu, Puja, Festivals, Gemstones, and Rudraksha knowledge cluster.",
      url: `${SITE_URL}/glossary`,
    });
    for (const term of definedTerms) {
      entities.push({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "@id": `${GLOSSARY_ID}#${term.id}`,
        name: term.name,
        description: term.description,
        inDefinedTermSet: { "@id": GLOSSARY_ID },
        termCode: term.id,
      });
    }
  }

  // 13. HowTo (remedies / puja vidhi / wearing ritual)
  const howToBlocks = collectHowToBlocks(post);
  for (const ht of howToBlocks) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${pageId}#howto-${ht.id}`,
      name: ht.name,
      description: ht.description,
      totalTime: ht.totalTime,
      step: ht.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }

  // 15-16. Product entries (gemstone, rudraksha, yantra)
  const products = collectProducts(post);
  for (const p of products) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${pageId}#product-${p.id}`,
      name: p.name,
      description: p.description,
      category: p.category,
      brand: { "@id": ORG_ID },
      image: p.image ? `${SITE_URL}${p.image}` : undefined,
      offers: p.shop_url
        ? {
            "@type": "Offer",
            url: p.shop_url,
            availability: "https://schema.org/InStock",
            priceCurrency: "INR",
            seller: { "@id": ORG_ID },
          }
        : undefined,
    });
  }

  // 17. Service (consultation)
  entities.push({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/consultation#service`,
    serviceType: "Personal Jyotish Consultation",
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
    url: "https://store.vastucart.in/consultations",
    offers: {
      "@type": "Offer",
      url: "https://store.vastucart.in/consultations",
      priceCurrency: "INR",
    },
  });

  // 18. SpeakableSpecification
  entities.push({
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    "@id": `${pageId}#speakable`,
    cssSelector: ["#introduction", ".pull-quote", ".prose-block p:first-child"],
  });

  // 19. ImageObject ×N from image_manifest
  const manifest = (post as ArticlePost & {
    image_manifest?: ImageManifestEntry[];
  }).image_manifest;
  if (manifest && manifest.length > 0) {
    for (const img of manifest) {
      entities.push({
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "@id": `${SITE_URL}/posts/${post.slug}/${img.filename}#image`,
        contentUrl: `${SITE_URL}/posts/${post.slug}/${img.filename}`,
        url: `${SITE_URL}/posts/${post.slug}/${img.filename}`,
        width: img.width,
        height: img.height,
        caption: img.caption,
        creditText: "VastuCart",
        license: "https://vastucart.in/license",
        acquireLicensePage: "https://vastucart.in/license#acquire",
        copyrightNotice: "© VastuCart",
        copyrightHolder: { "@id": ORG_ID },
      });
    }
  }

  // 20. VideoObject placeholder
  entities.push({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${pageId}#video-placeholder`,
    name: `${post.title} — video summary`,
    description: post.meta.description,
    thumbnailUrl: post.meta.og_image.startsWith("http")
      ? post.meta.og_image
      : `${SITE_URL}${post.meta.og_image}`,
    uploadDate: post.published_at,
    contentUrl: `${SITE_URL}/posts/${post.slug}/video.mp4`,
    isPartOf: { "@id": pageId },
    inLanguage: "en-IN",
  });

  // 21. ItemList (related posts)
  const relatedBlock = post.content.find((b) => b.type === "related-posts");
  if (relatedBlock && relatedBlock.type === "related-posts") {
    entities.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${pageId}#related`,
      itemListElement: relatedBlock.posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: p.href.startsWith("http") ? p.href : `${SITE_URL}${p.href}`,
      })),
    });
  }

  // 22. Table + Dataset (dasha-table)
  const dashaBlock = post.content.find((b) => b.type === "dasha-table");
  if (dashaBlock && dashaBlock.type === "dasha-table") {
    entities.push({
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${pageId}#dasha-dataset`,
      name: dashaBlock.heading ?? "Vimshottari Dasha activation",
      description:
        "Vimshottari mahadasha periods, durations, key themes, and intensity for this placement.",
      creator: { "@id": ORG_ID },
      license: "https://vastucart.in/license",
      keywords: ["vimshottari", "mahadasha", "dasha", "jyotish"],
      variableMeasured: ["mahadasha", "duration", "themes", "intensity"],
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/html",
        contentUrl: pageId,
      },
    });
  }

  // 23. Recipe — puja-vidhi posts get Recipe schema so they
  // qualify for Google Recipe rich results (samagri = ingredients,
  // steps = recipeInstructions, totalTime = ritual duration).
  if (post.template === "puja-vidhi") {
    const samagri = post.content.find((b) => b.type === "samagri-list");
    const vidhi = post.content.find((b) => b.type === "puja-vidhi");
    if (samagri && samagri.type === "samagri-list" && vidhi && vidhi.type === "puja-vidhi") {
      entities.push({
        "@context": "https://schema.org",
        "@type": "Recipe",
        "@id": `${pageId}#recipe`,
        name: post.title,
        description: post.meta.description,
        author: { "@id": personId },
        datePublished: post.published_at,
        image: `${SITE_URL}${post.meta.og_image}`,
        recipeCategory: "Puja Vidhi",
        recipeCuisine: "Vedic Sanatan",
        keywords: post.tags.join(", "),
        totalTime: "PT45M",
        recipeYield: "1 puja",
        recipeIngredient: samagri.items.map((it) =>
          `${it.quantity} ${it.name}`.trim()
        ),
        recipeInstructions: vidhi.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.description,
        })),
      });
    }
  }

  // 24. Event — festival posts emit Event so the date appears
  // in Google Search event carousels and date pickers.
  if (post.category === "festivals") {
    const dynamicPost = post as ArticlePost & {
      festival_year?: number;
      festival_date?: string;
      festival_end_date?: string;
    };
    if (dynamicPost.festival_date) {
      entities.push({
        "@context": "https://schema.org",
        "@type": "Event",
        "@id": `${pageId}#event`,
        name: post.title,
        description: post.meta.description,
        startDate: dynamicPost.festival_date,
        endDate: dynamicPost.festival_end_date ?? dynamicPost.festival_date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        location: {
          "@type": "Country",
          name: "India",
        },
        organizer: { "@id": ORG_ID },
        image: `${SITE_URL}${post.meta.og_image}`,
        isAccessibleForFree: true,
        url,
      });
    }
  }

  // 25. Course — gemstone-wearing posts emit Course schema so
  // the multi-step ritual qualifies for the Course rich result.
  if (post.template === "gemstone") {
    const wearing = post.content.find((b) => b.type === "wearing-ritual");
    if (wearing) {
      entities.push({
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${pageId}#course`,
        name: `${post.title} — wearing ritual`,
        description:
          "Step-by-step gemstone wearing ritual including muhurta, energising mantra, and care.",
        provider: { "@id": ORG_ID },
        url,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT30M",
        },
        offers: {
          "@type": "Offer",
          category: "Free",
          price: "0",
          priceCurrency: "INR",
        },
      });
    }
  }

  return entities.filter(Boolean);
}

// ─── Helpers ────────────────────────────────────────────────────

interface DefinedTermEntry {
  id: string;
  name: string;
  description: string;
}

interface HowToCollected {
  id: string;
  name: string;
  description: string;
  totalTime: string;
  steps: { name: string; text: string }[];
}

interface ProductCollected {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  shop_url?: string;
}

interface ImageManifestEntry {
  filename: string;
  caption: string;
  width: number;
  height: number;
}

function countWords(post: ArticlePost): number {
  let total = 0;
  for (const block of post.content) {
    if (block.type === "prose") {
      total += plainText(block.html).split(/\s+/).filter(Boolean).length;
    } else if (block.type === "pull-quote") {
      total += block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "faq") {
      for (const item of block.items) {
        total += item.a.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return total;
}

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractDefinedTerms(post: ArticlePost): DefinedTermEntry[] {
  // Heuristic: pull from a `defined_terms` field on the post if present.
  // Falls back to a small default per template.
  const fromPost = (
    post as ArticlePost & {
      defined_terms?: DefinedTermEntry[];
    }
  ).defined_terms;
  if (fromPost && fromPost.length > 0) return fromPost;

  // Sensible defaults so the schema is never empty
  return [
    {
      id: "jyotish",
      name: "Jyotish",
      description:
        "Classical Vedic astrology, the science of light and time, codified in Parashari and Jaimini systems.",
    },
    {
      id: "lagna",
      name: "Lagna",
      description:
        "The ascending sign on the eastern horizon at the moment of birth, the first house of a horoscope.",
    },
    {
      id: "graha",
      name: "Graha",
      description:
        "A planet or celestial body that exerts measurable influence in classical Jyotish.",
    },
  ];
}

function collectHowToBlocks(post: ArticlePost): HowToCollected[] {
  const out: HowToCollected[] = [];
  for (const b of post.content) {
    if (b.type === "puja-vidhi") {
      out.push({
        id: "puja-vidhi",
        name: b.heading ?? "Puja vidhi",
        description: b.eyebrow ?? "Step by step puja procedure",
        totalTime: "PT45M",
        steps: b.steps.map((s) => ({ name: s.title, text: s.description })),
      });
    } else if (b.type === "wearing-ritual") {
      out.push({
        id: "wearing-ritual",
        name: b.heading ?? "Gemstone wearing ritual",
        description: b.eyebrow ?? "Step by step wearing procedure",
        totalTime: "PT30M",
        steps: b.steps.map((s) => ({
          name: s.action,
          text: `${s.action}. ${s.timing}.${s.mantra ? " Mantra: " + s.mantra : ""}`,
        })),
      });
    }
  }
  return out;
}

function collectProducts(post: ArticlePost): ProductCollected[] {
  const out: ProductCollected[] = [];
  for (const b of post.content) {
    if (b.type === "gemstone") {
      for (const card of b.cards) {
        if (card.role !== "shop") {
          out.push({
            id: `gemstone-${card.image_slug ?? card.name.toLowerCase().replace(/\s+/g, "-")}`,
            name: card.name,
            description: card.sub ?? "",
            category: "Gemstone",
            image: card.image_slug ? `/gemstones/${card.image_slug}.png` : undefined,
            shop_url: card.shop_url,
          });
        }
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
        shop_url: b.yantra.cta_url,
      });
    }
  }
  return out;
}
