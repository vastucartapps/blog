// Centralized OpenGraph + Twitter metadata helper.
//
// Why this exists: Next.js shallow-merges page-level `openGraph` over
// the layout's. Any page that emits `openGraph: { title, description, url }`
// wipes the layout's `locale`, `siteName`, and `images`. The audit on
// 257 URLs found this exact bug on 256 of them.
//
// Every page-level `generateMetadata` (and every static `export const
// metadata`) must spread `buildSocialMetadata(...)` so the rendered
// `<meta property="og:*">` set is complete on every URL.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/VastuCartLogo.png`;
export const DEFAULT_OG_IMAGE_WIDTH = 1024;
export const DEFAULT_OG_IMAGE_HEIGHT = 1024;
export const DEFAULT_OG_IMAGE_ALT = "VastuCart, Vedic Astrology and Jyotish";
export const SITE_NAME = "VastuCart Blog";
export const SITE_LOCALE = "en_IN";
export const SITE_TWITTER = "@vastucart";

export type SocialOgType =
  | "website"
  | "article"
  | "profile"
  | "book";

export interface SocialMetadataInput {
  title: string;
  description: string;
  /** Absolute URL of the page. */
  url: string;
  type?: SocialOgType;
  /** Absolute URL of the OG image, or relative path under SITE_URL. */
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Used only when `type === "article"`. */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: readonly string[];
  };
  /** Twitter handle override (defaults to @vastucart). */
  twitterCreator?: string;
}

/** Resolve a possibly-relative image path to an absolute URL. */
function absImg(path?: string): string {
  if (!path) return DEFAULT_OG_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${SITE_URL}${path}`;
  return `${SITE_URL}/${path}`;
}

/**
 * Returns a complete `openGraph` + `twitter` block. ALL six og: fields
 * required by Open Graph are populated:
 *   og:title, og:description, og:url, og:site_name, og:locale, og:image
 * Plus og:type (default `website`).
 *
 * Returned as a `Pick<Metadata, "openGraph" | "twitter">` so it can be
 * spread directly into a page's metadata return.
 */
export function buildSocialMetadata(
  input: SocialMetadataInput,
): Pick<Metadata, "openGraph" | "twitter"> {
  const {
    title,
    description,
    url,
    type = "website",
    imageUrl,
    imageAlt = DEFAULT_OG_IMAGE_ALT,
    imageWidth = DEFAULT_OG_IMAGE_WIDTH,
    imageHeight = DEFAULT_OG_IMAGE_HEIGHT,
    article,
    twitterCreator = SITE_TWITTER,
  } = input;

  const resolvedImage = absImg(imageUrl);
  const isDefaultImage = resolvedImage === DEFAULT_OG_IMAGE;

  const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
    title,
    description,
    url,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    alternateLocale: ["hi_IN"],
    type,
    images: [
      {
        url: resolvedImage,
        width: isDefaultImage ? DEFAULT_OG_IMAGE_WIDTH : imageWidth,
        height: isDefaultImage ? DEFAULT_OG_IMAGE_HEIGHT : imageHeight,
        alt: imageAlt,
        type: resolvedImage.endsWith(".png")
          ? "image/png"
          : resolvedImage.endsWith(".webp")
            ? "image/webp"
            : "image/jpeg",
      },
    ],
  };

  if (type === "article" && article) {
    Object.assign(baseOpenGraph, {
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime,
      authors: article.authors,
      section: article.section,
      tags: article.tags ? Array.from(article.tags) : undefined,
    });
  }

  return {
    openGraph: baseOpenGraph,
    twitter: {
      card: "summary_large_image",
      site: SITE_TWITTER,
      creator: twitterCreator,
      title,
      description,
      images: [resolvedImage],
    },
  };
}

/**
 * Pick the first candidate that fits inside `maxLen`. Falls back to a
 * word-boundary truncation of the longest one if every candidate is
 * too long. Always returns a non-empty string.
 *
 * Used so the rendered `<title>` never exceeds the SERP truncation
 * point (≈ 70 chars). Pages call this in `generateMetadata` to choose
 * between several human-written title variants:
 *
 *   pickTitle([post.meta.title, post.title, post.subtitle]);
 */
export function pickTitle(candidates: ReadonlyArray<string | undefined>, maxLen = 70): string {
  const cleaned = candidates
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter((c): c is string => c.length > 0);
  for (const c of cleaned) {
    if (c.length <= maxLen) return c;
  }
  // No candidate fits. Truncate the shortest at a word boundary.
  const fallback = cleaned.length ? cleaned.reduce((a, b) => (a.length <= b.length ? a : b)) : "VastuCart Blog";
  if (fallback.length <= maxLen) return fallback;
  const cut = fallback.slice(0, maxLen).replace(/\s+\S*$/, "");
  return cut || fallback.slice(0, maxLen);
}

/**
 * Trim a description to a length Google's snippet picker likes
 * (80–160 chars). Below 80: returned as-is (caller should supply
 * a longer description). Above 160: word-boundary truncation.
 */
export function clampDescription(text: string, maxLen = 160): string {
  const t = (text ?? "").trim().replace(/\s+/g, " ");
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen).replace(/\s+\S*$/, "");
  return cut || t.slice(0, maxLen);
}

/** Brand-tagline padding for short hub/category descriptions. */
const PAD_SUFFIX =
  " — long-form Jyotish, Vastu, numerology, and tarot guidance from VastuCart Editorial.";

/**
 * Produce a meta description that is 80–160 chars when possible.
 *
 * - If `text.length` is between 80 and 160, returns it cleaned.
 * - If `< 80`, appends the brand tagline (or `pad` if supplied) until
 *   the result clears 80 chars, then clamps to 160.
 * - If `> 160`, word-boundary truncates to 160.
 *
 * Used in `generateMetadata` for every route. Audit showed 47 hub
 * URLs with descriptions < 80 chars (cat/sub `description` is a
 * deliberately terse one-line summary used in PostGrid headers and
 * hero ribbons; the meta version pads it without changing the
 * source data).
 */
export function metaDescription(text: string, pad: string = PAD_SUFFIX): string {
  const cleaned = (text ?? "").trim().replace(/\s+/g, " ");
  if (cleaned.length >= 80 && cleaned.length <= 160) return cleaned;
  if (cleaned.length > 160) return clampDescription(cleaned, 160);
  const padTrimmed = pad.replace(/^\s+|\s+$/g, " ");
  const padded = cleaned + (cleaned.endsWith(".") || cleaned.endsWith("!") || cleaned.endsWith("?") ? padTrimmed : "." + padTrimmed);
  return clampDescription(padded, 160);
}

/**
 * Convenience: assemble the canonical alternates block. Single-locale
 * site, so `en-IN` + `x-default` both point at the same URL. Pages
 * pass the same absolute URL they pass to `buildSocialMetadata`.
 */
export function buildAlternates(canonicalUrl: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: canonicalUrl,
    languages: {
      "en-IN": canonicalUrl,
      "x-default": canonicalUrl,
    },
  };
}
