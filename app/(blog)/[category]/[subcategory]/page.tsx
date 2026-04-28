import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryHero } from "@/components/listing/CategoryHero";
import { SubcategoryChips } from "@/components/listing/SubcategoryChips";
import { PostGrid } from "@/components/listing/PostGrid";
import { CATEGORIES, getCategory, getSubcategory } from "@/lib/categories";
import { getPostsBySubcategory, countPostsBySubcategory } from "@/lib/content";
import { absoluteUrl, SITE_URL } from "@/lib/utils";
import { buildHubSchemas } from "@/lib/schema";
import { getSubcategoryConceptSlugs } from "@/lib/category-concepts";
import type { IconName } from "@/components/ui/Icon";

interface Params {
  category: string;
  subcategory: string;
}

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) =>
    c.subcategories.map((s) => ({ category: c.slug, subcategory: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) return {};
  const url = absoluteUrl(`/${cat.slug}/${sub.slug}`);
  return {
    title: `${sub.label}, ${cat.label} — VastuCart Blog`,
    description: sub.description,
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "x-default": url,
      },
    },
    openGraph: {
      title: sub.label,
      description: sub.description,
      url,
      type: "website",
    },
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, subcategory } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) notFound();
  const posts = getPostsBySubcategory(cat.slug, sub.slug);
  const subCounts = countPostsBySubcategory(cat.slug);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: cat.label, href: `/${cat.slug}` },
    { label: sub.label, href: `/${cat.slug}/${sub.slug}` },
  ];

  const now = new Date().toISOString();
  const authorSlug = "vastucart-editorial";

  const schemas = buildHubSchemas({
    url: `${SITE_URL}/${cat.slug}/${sub.slug}`,
    pageType: "CollectionPage",
    name: `${sub.label}, ${cat.label} Articles`,
    description: sub.description,
    breadcrumb: [
      { name: cat.label, url: `/${cat.slug}` },
      { name: sub.label, url: `/${cat.slug}/${sub.slug}` },
    ],
    items: posts.map((p, i) => ({
      name: p.title,
      url: `/${p.category}/${p.subcategory}/${p.slug}`,
      description: p.meta?.description,
      position: i + 1,
    })),
    navigation: cat.subcategories.map((s) => ({
      name: s.label,
      url: `/${cat.slug}/${s.slug}`,
    })),
    conceptSlugs: getSubcategoryConceptSlugs(cat.slug, sub.slug),
    authorSlug,
    datePublished: now,
    dateModified: now,
  });

  return (
    <>
      <Header />
      <main>
        <CategoryHero
          breadcrumb={breadcrumb}
          eyebrow={cat.label}
          label={sub.label}
          labelHindi={sub.label_hindi}
          description={sub.description}
          icon={cat.icon_name as IconName}
          postCount={posts.length}
          category={cat.id}
        />
        <div
          className="wrap-wide"
          style={{ paddingTop: "clamp(2rem, 5vw, 3.5rem)", paddingBottom: "clamp(2.25rem, 5vw, 4rem)" }}
        >
          <div style={{ marginBottom: "2.5rem" }}>
            <SubcategoryChips
              categorySlug={cat.slug}
              subs={cat.subcategories}
              active={sub.slug}
              counts={subCounts}
            />
          </div>
          <PostGrid posts={posts} categoryLabel={cat.label} />
        </div>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-sub-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
