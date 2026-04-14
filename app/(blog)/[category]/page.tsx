import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryHero } from "@/components/listing/CategoryHero";
import { SubcategoryChips } from "@/components/listing/SubcategoryChips";
import { PostGrid } from "@/components/listing/PostGrid";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getPostsByCategory, countPostsBySubcategory } from "@/lib/content";
import { absoluteUrl, SITE_URL } from "@/lib/utils";
import type { IconName } from "@/components/ui/Icon";

interface Params { category: string; }

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  const url = absoluteUrl(`/${cat.slug}`);
  return {
    title: `${cat.label}, ${cat.label_hindi} Articles`,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: { title: cat.label, description: cat.description, url, type: "website" },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const posts = getPostsByCategory(cat.slug);
  const subCounts = countPostsBySubcategory(cat.slug);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: cat.label, href: `/${cat.slug}` },
  ];

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.label,
    description: cat.description,
    url: `${SITE_URL}/${cat.slug}`,
    hasPart: posts.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`,
    })),
  };
  const crumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `${SITE_URL}${b.href}`,
    })),
  };

  return (
    <>
      <Header />
      <main>
        <CategoryHero
          breadcrumb={breadcrumb}
          eyebrow="Category"
          label={cat.label}
          labelHindi={cat.label_hindi}
          description={cat.description}
          icon={cat.icon_name as IconName}
          postCount={posts.length}
          category={cat.id}
        />
        <div className="wrap-wide" style={{ paddingTop: "3.5rem", paddingBottom: "4rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <SubcategoryChips categorySlug={cat.slug} subs={cat.subcategories} counts={subCounts} />
          </div>
          <PostGrid posts={posts} categoryLabel={cat.label} />
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([collection, crumb]) }}
      />
    </>
  );
}
