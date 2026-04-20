import type { ArticlePost } from "../types";
import { getCategory, getSubcategory } from "../categories";
import {
  BLOG_ENTITY_REF,
  BLOG_WEBSITE_REF,
  personId,
  type SchemaEntity,
} from "./constants";
import { buildBlogPostingSchemas } from "./blogPosting";
import { buildBreadcrumbListSchema } from "./breadcrumbList";
import { buildFAQPageSchema } from "./faqPage";
import { buildHowToSchemas } from "./howTo";
import { buildProductSchemas } from "./product";
import { buildDefinedTermSchemas, type DefinedTermEntry } from "./definedTerm";
import { buildImageObjectSchemas, type ImageManifestEntry } from "./imageObject";
import { buildSpeakableSchema } from "./speakableSpec";
import { buildRecipeSchema } from "./recipe";
import { buildEventSchema } from "./event";
import { buildGemstoneCourseSchema } from "./course";
import {
  buildConsultationServiceSchemas,
  CONSULTATION_SERVICE_REF,
} from "./service";
import { buildPersonSchema } from "./person";
import { buildProfilePageSchema } from "./profilePage";
import { SITE_URL } from "../utils";

// ─────────────────────────────────────────────────────────────────
// buildPostSchema(post) — the single entry point used by the post
// route. Returns a flat, deduped array of JSON-LD entities, each
// with its own @id. The route emits one <script> tag per entity.
//
// Key design:
//   • Organization is referenced by @id only (contract §5.2).
//     The canonical Organization is emitted by vastucart.in.
//   • WebSite + Blog are referenced by @id. Their canonical
//     declaration lives on the blog home page (app/page.tsx).
//   • Person is referenced by @id. The canonical Person declaration
//     lives on /authors/{slug}. We still emit a Person on post pages
//     so the article can be independently indexed with author context.
//   • WebPage wraps the Article and carries cross-ref properties
//     (isPartOf, about, breadcrumb) — Article itself only carries
//     article-legal fields.
//   • Service is referenced by @id, declared on its own route.
//     On post pages we only emit the @id pointer, never the full
//     Service (prevents duplicate emission).
//   • FAQ/HowTo/Recipe/Event/Course all gate on real data and
//     return null when their source block is absent or thin.
// ─────────────────────────────────────────────────────────────────

interface SchemaPostExtras {
  defined_terms?: DefinedTermEntry[];
  image_manifest?: ImageManifestEntry[];
}

export function buildPostSchema(post: ArticlePost): SchemaEntity[] {
  const entities: SchemaEntity[] = [];
  const extras = post as ArticlePost & SchemaPostExtras;

  const { webPage, blogPosting, url, pageId, articleId } =
    buildBlogPostingSchemas(post);

  entities.push(webPage);
  entities.push(blogPosting);

  // Breadcrumb — always relative to the base URL, not the #webpage fragment
  const cat = getCategory(post.category);
  const sub = getSubcategory(post.category, post.subcategory);
  const breadcrumb = buildBreadcrumbListSchema(
    [
      { name: cat?.label ?? post.category, url: `/${post.category}` },
      {
        name: sub?.label ?? post.subcategory,
        url: `/${post.category}/${post.subcategory}`,
      },
      { name: post.title, url: `/${post.category}/${post.subcategory}/${post.slug}` },
    ],
    url
  );
  if (breadcrumb) entities.push(breadcrumb);

  // FAQ
  const faqBlock = post.content.find((b) => b.type === "faq");
  if (faqBlock && faqBlock.type === "faq") {
    const faq = buildFAQPageSchema(faqBlock.items, url);
    if (faq) entities.push(faq);
  }

  // Person + ProfilePage — emit only the author of this post, not both
  const person = buildPersonSchema(post.author_id);
  if (person) entities.push(person);
  const profile = buildProfilePageSchema(post.author_id);
  if (profile) entities.push(profile);

  // Defined terms (Sanskrit glossary)
  entities.push(...buildDefinedTermSchemas(extras.defined_terms));

  // HowTo × N
  entities.push(...buildHowToSchemas(post.content, url));

  // Products × N (gemstone, rudraksha, yantra)
  entities.push(...buildProductSchemas(post.content, url, post.published_at));

  // Consultation service — emit full definition once per post (with
  // WebPage wrapper). The @id is stable so duplicate @id dedupe
  // collapses siblings if ever duplicated elsewhere.
  entities.push(...buildConsultationServiceSchemas());
  // Reference the service from the post WebPage to wire the cross-ref.
  const webPageWithService = {
    ...webPage,
    mentions: [
      ...(Array.isArray((webPage as SchemaEntity).mentions)
        ? ((webPage as SchemaEntity).mentions as SchemaEntity[])
        : []),
      CONSULTATION_SERVICE_REF,
    ],
  };
  const webPageIdx = entities.findIndex((e) => e["@id"] === pageId);
  if (webPageIdx >= 0) entities[webPageIdx] = webPageWithService;

  // SpeakableSpecification
  entities.push(buildSpeakableSchema(url));

  // Images × N
  entities.push(...buildImageObjectSchemas(post.slug, extras.image_manifest));

  // Related-posts ItemList
  const relatedBlock = post.content.find((b) => b.type === "related-posts");
  if (relatedBlock && relatedBlock.type === "related-posts" && relatedBlock.posts.length > 0) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#related`,
      numberOfItems: relatedBlock.posts.length,
      itemListElement: relatedBlock.posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: p.href.startsWith("http") ? p.href : `${SITE_URL}${p.href}`,
      })),
    });
  }

  // Dataset — dasha-table
  const dashaBlock = post.content.find((b) => b.type === "dasha-table");
  if (dashaBlock && dashaBlock.type === "dasha-table" && dashaBlock.rows.length > 0) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${url}#dasha-dataset`,
      name: dashaBlock.heading ?? "Vimshottari Dasha activation",
      description:
        "Vimshottari mahadasha periods, durations, key themes, and intensity for this placement.",
      creator: { "@id": personId(post.author_id) },
      publisher: { "@id": "https://www.vastucart.in/#organization" },
      license: "https://www.vastucart.in/license",
      keywords: ["vimshottari", "mahadasha", "dasha", "jyotish"],
      variableMeasured: ["mahadasha", "duration", "themes", "intensity"],
      isPartOf: BLOG_ENTITY_REF,
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/html",
        contentUrl: url,
      },
    });
  }

  // Recipe — puja-vidhi posts
  const recipe = buildRecipeSchema(
    post,
    { "@id": personId(post.author_id) },
    url
  );
  if (recipe) entities.push(recipe);

  // Event — festival posts
  const event = buildEventSchema(post, url, url);
  if (event) entities.push(event);

  // Course — gemstone wearing ritual
  const course = buildGemstoneCourseSchema(post, url, url);
  if (course) entities.push(course);

  // Dedupe by @id
  const seen = new Set<string>();
  return entities.filter((e) => {
    const id = (e["@id"] ?? `${e["@type"]}`) as string;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export { BLOG_WEBSITE_REF, BLOG_ENTITY_REF };
