import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/sitemap-builder";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap();
}
