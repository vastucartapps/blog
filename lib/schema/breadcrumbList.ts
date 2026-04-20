import { SITE_URL } from "../utils";
import { HOME_BREADCRUMB_ITEM, type SchemaEntity } from "./constants";

export interface BreadcrumbNode {
  name: string;
  url?: string;
}

// ─────────────────────────────────────────────────────────────────
// BreadcrumbList — universal helper.
// First item is always Home. The final item may omit `item` when it
// is the current page (Google tolerates both forms).
// ─────────────────────────────────────────────────────────────────

export function buildBreadcrumbListSchema(
  nodes: BreadcrumbNode[],
  baseUrl: string
): SchemaEntity | null {
  if (!nodes.length) return null;

  const items = [
    HOME_BREADCRUMB_ITEM,
    ...nodes.map((n, i) => {
      const item: SchemaEntity = {
        "@type": "ListItem",
        position: i + 2,
        name: n.name,
      };
      if (n.url) {
        item.item = n.url.startsWith("http") ? n.url : `${SITE_URL}${n.url}`;
      }
      return item;
    }),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}#breadcrumb`,
    itemListElement: items,
  };
}
