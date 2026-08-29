import type { ArticlePost, ImageManifestEntry } from "./types";

/**
 * Resolve the featured image for a post listing card. Order of
 * preference:
 *   1. post.meta.og_image or `/og/${post.slug}.png`
 *   2. image_manifest[0] — the canonical hero WebP
 *
 * Returns null when neither exists; the consuming card then falls
 * back to a themed medallion placeholder.
 */
export function resolveFeaturedImage(
  post: ArticlePost,
): { src: string; alt: string; width?: number; height?: number } | null {
  if (post.meta?.og_image) {
    return {
      src: post.meta.og_image,
      alt: post.meta?.og_title ?? post.title,
      width: 1200,
      height: 630,
    };
  }

  const manifest = (
    post as ArticlePost & { image_manifest?: ImageManifestEntry[] }
  ).image_manifest;

  if (manifest && manifest.length > 0 && manifest[0]?.filename) {
    const img = manifest[0];
    return {
      src: `/posts/${post.slug}/${img.filename}`,
      alt: img.alt || post.title,
      width: img.width || 1200,
      height: img.height || 630,
    };
  }

  return null;
}

