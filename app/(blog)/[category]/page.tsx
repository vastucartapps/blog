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
import { buildCollectionPageSchema } from "@/lib/schema";
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

  const schemas = buildCollectionPageSchema({
    url: `${SITE_URL}/${cat.slug}`,
    name: `${cat.label}, ${cat.label_hindi} Articles`,
    description: cat.description,
    items: posts.map((p) => ({
      name: p.title,
      url: `/${p.category}/${p.subcategory}/${p.slug}`,
      description: p.meta?.description,
    })),
    breadcrumb: [{ name: cat.label, url: `/${cat.slug}` }],
  });

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
          <div style={{ marginBottom: "2rem" }}>
            <a
              href={`/${cat.slug}/complete-guide`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                borderRadius: 10,
                background: "var(--saffron)",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textDecoration: "none",
                textTransform: "uppercase",
                boxShadow: "0 14px 28px -18px rgba(232,132,10,0.6)",
              }}
            >
              Read the {cat.label.toLowerCase()} complete guide
              <span aria-hidden>›</span>
            </a>
          </div>
          <div style={{ marginBottom: "2.5rem" }}>
            <SubcategoryChips categorySlug={cat.slug} subs={cat.subcategories} counts={subCounts} />
          </div>
          <PostGrid posts={posts} categoryLabel={cat.label} />
        </div>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-cat-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
