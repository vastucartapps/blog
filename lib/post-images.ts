import fs from "node:fs";
import path from "node:path";
import type { ArticlePost, ImageManifestEntry } from "./types";

/**
 * Resolve the featured image for a post listing card. Order of
 * preference:
 *   1. /og/{slug}.png (the social-share image, 1200×630)
 *   2. image_manifest[0] — the canonical hero WebP rendered by
 *      lib/svg/hero-card.ts and saved as {slug}-hero-vN.webp
 *
 * Returns null when neither exists; the consuming card then falls
 * back to a themed medallion placeholder.
 *
 * Single source of truth for both PostCard (small grid card) and
 * FeaturedPostCard (the big editorial card at the top of archives).
 */
export function resolveFeaturedImage(
  post: ArticlePost,
): { src: string; alt: string; width?: number; height?: number } | null {
  const cwd = process.cwd();

  const ogPath = path.join(cwd, "public", "og", `${post.slug}.png`);
  if (fs.existsSync(ogPath)) {
    return {
      src: `/og/${post.slug}.png`,
      alt: post.meta?.og_title ?? post.title,
      width: 1200,
      height: 630,
    };
  }

  const manifest = (
    post as ArticlePost & { image_manifest?: ImageManifestEntry[] }
  ).image_manifest;
  if (manifest && manifest.length > 0) {
    for (const img of manifest) {
      const p = path.join(cwd, "public", "posts", post.slug, img.filename);
      if (fs.existsSync(p)) {
        return {
          src: `/posts/${post.slug}/${img.filename}`,
          alt: img.alt,
          width: img.width,
          height: img.height,
        };
      }
    }
  }
  return null;
}
