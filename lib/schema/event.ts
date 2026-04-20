import { SITE_URL } from "../utils";
import type { ArticlePost } from "../types";
import { ORG_REF, type SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// Event — festival posts only. Requires a resolved festival_date so
// the date picker and event carousel have something to anchor on.
// Event does NOT receive isPartOf/about/mentions — those properties
// are scoped to CreativeWork subtypes. For Event to participate in
// cross-refs, the parent WebPage wraps it (per contract §5.10),
// which we handle in the blogPosting composer.
// ─────────────────────────────────────────────────────────────────

export function buildEventSchema(
  post: ArticlePost,
  url: string,
  baseUrl: string
): SchemaEntity | null {
  if (post.category !== "festivals") return null;

  const dyn = post as ArticlePost & {
    festival_date?: string;
    festival_end_date?: string;
  };
  if (!dyn.festival_date) return null;

  const image = post.meta.og_image?.startsWith("http")
    ? post.meta.og_image
    : `${SITE_URL}${post.meta.og_image ?? ""}`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${baseUrl}#event`,
    name: post.title,
    description: post.meta.description,
    startDate: dyn.festival_date,
    endDate: dyn.festival_end_date ?? dyn.festival_date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "Country",
      name: "India",
    },
    organizer: ORG_REF,
    image,
    isAccessibleForFree: true,
    url,
  };
}
