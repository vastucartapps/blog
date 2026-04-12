import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeHero } from "@/components/home/HomeHero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { getPublishedPosts, countPostsByCategory } from "@/lib/content";
import { CATEGORIES, ORGANIZATION_SAME_AS } from "@/lib/categories";
import { SITE_URL } from "@/lib/utils";

export const revalidate = 3600;

export default function HomePage() {
  const posts = getPublishedPosts();
  const counts = countPostsByCategory();

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VastuCart Blog",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VastuCart",
    url: "https://vastucart.in",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/VastuCartLogo.png`, width: 1024, height: 1024 },
    sameAs: ORGANIZATION_SAME_AS,
  };

  return (
    <>
      <Header />
      <main>
        <HomeHero totalPosts={posts.length} totalCategories={CATEGORIES.length} />
        <CategoryGrid postCounts={counts} />
        <FeaturedPosts posts={posts} />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([website, org]) }}
      />
    </>
  );
}
