import { SITE_URL } from "../utils";
import type { ArticlePost } from "../types";
import { type SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// Recipe — emitted only on puja-vidhi template posts that have both
// a samagri-list and a puja-vidhi block with concrete data.
// samagri → recipeIngredient; vidhi steps → recipeInstructions.
// ─────────────────────────────────────────────────────────────────

export function buildRecipeSchema(
  post: ArticlePost,
  authorRef: { "@id": string },
  baseUrl: string
): SchemaEntity | null {
  if (post.template !== "puja-vidhi") return null;

  const samagri = post.content.find((b) => b.type === "samagri-list");
  const vidhi = post.content.find((b) => b.type === "puja-vidhi");
  if (
    !samagri ||
    samagri.type !== "samagri-list" ||
    !vidhi ||
    vidhi.type !== "puja-vidhi"
  ) {
    return null;
  }
  if (samagri.items.length < 2 || vidhi.steps.length < 2) return null;

  const image = post.meta.og_image?.startsWith("http")
    ? post.meta.og_image
    : `${SITE_URL}${post.meta.og_image ?? ""}`;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `${baseUrl}#recipe`,
    name: post.title,
    description: post.meta.description,
    author: authorRef,
    datePublished: post.published_at,
    image,
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
  };
}
