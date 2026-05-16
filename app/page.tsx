import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeHero } from "@/components/home/HomeHero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { getPublishedPosts, countPostsByCategory } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import {
  buildWebsiteSchema,
  buildBlogEntitySchema,
  buildOrganizationStub,
  buildAllPersonSchemas,
} from "@/lib/schema";

// NOTE: This route does NOT export its own metadata — the layout's
// `default` title and full `openGraph` (siteName, locale, alternateLocale,
// images) apply to the home page. The home is the one route where the
// shallow-merge bug never bit, and the audit confirms it ships a
// complete og: tag set. Pages with their OWN generateMetadata must use
// `buildSocialMetadata` from `lib/seo/social-metadata` to avoid wiping
// the layout's og block.

export const revalidate = 3600;

export default function HomePage() {
  const posts = getPublishedPosts();
  const counts = countPostsByCategory();

  // Home emits the canonical anchors for this subdomain + a thin
  // Organization stub (so the blog can render rich results
  // standalone). Every other page only references these via @id.
  const schemas = [
    buildOrganizationStub(),
    buildWebsiteSchema(),
    buildBlogEntitySchema(),
    ...buildAllPersonSchemas(),
  ];

  return (
    <>
      <Header />
      <main>
        <HomeHero totalPosts={posts.length} totalCategories={CATEGORIES.length} />
        <CategoryGrid postCounts={counts} />
        <FeaturedPosts posts={posts} />
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-home-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
