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
