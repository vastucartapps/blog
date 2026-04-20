import { SITE_URL } from "../utils";
import { BRAND, ORG_ID, ORG_REF, type SchemaEntity } from "./constants";

export interface ImageManifestEntry {
  filename: string;
  caption: string;
  width: number;
  height: number;
}

// ─────────────────────────────────────────────────────────────────
// ImageObject — emitted per entry in a post's image_manifest. Each
// carries licence + credit so Google Images can attribute the
// publisher and link the asset to the canonical organisation.
// ─────────────────────────────────────────────────────────────────

export function buildImageObjectSchemas(
  slug: string,
  manifest: ImageManifestEntry[] | undefined
): SchemaEntity[] {
  if (!manifest || manifest.length === 0) return [];
  return manifest.map((img) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${SITE_URL}/posts/${slug}/${img.filename}#image`,
    contentUrl: `${SITE_URL}/posts/${slug}/${img.filename}`,
    url: `${SITE_URL}/posts/${slug}/${img.filename}`,
    width: img.width,
    height: img.height,
    caption: img.caption,
    name: img.caption,
    description: img.caption,
    creator: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: BRAND.name,
    },
    creditText: BRAND.name,
    license: "https://www.vastucart.in/license",
    acquireLicensePage: "https://www.vastucart.in/license#acquire",
    copyrightNotice: `© ${BRAND.name}`,
    copyrightHolder: ORG_REF,
  }));
}
