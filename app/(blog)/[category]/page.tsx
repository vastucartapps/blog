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
import { buildHubSchemas } from "@/lib/schema";
import { buildAlternates, buildSocialMetadata, metaDescription } from "@/lib/seo/social-metadata";
import { getCategoryFAQs } from "@/lib/category-faqs";
import { getCategoryConceptSlugs } from "@/lib/category-concepts";
import type { IconName } from "@/components/ui/Icon";

interface Params {
  category: string;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  const url = absoluteUrl(`/${cat.slug}`);
  const title = `${cat.label}, ${cat.label_hindi} — VastuCart Blog`;
  const description = metaDescription(cat.description);
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(url),
    ...buildSocialMetadata({
      title,
      description,
      url,
      type: "website",
    }),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const posts = getPostsByCategory(cat.slug);
  const subCounts = countPostsBySubcategory(cat.slug);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: cat.label, href: `/${cat.slug}` },
  ];

  const now = new Date().toISOString();
  const authorSlug = "vastucart-editorial";

  const schemas = buildHubSchemas({
    url: `${SITE_URL}/${cat.slug}`,
    pageType: "CollectionPage",
    name: `${cat.label}, ${cat.label_hindi} Articles`,
    description: cat.description,
    breadcrumb: [{ name: cat.label, url: `/${cat.slug}` }],
    items: posts.map((p, i) => ({
      name: p.title,
      url: `/${p.category}/${p.subcategory}/${p.slug}`,
      description: p.meta?.description,
      position: i + 1,
    })),
    navigation: [
      {
        name: `${cat.label} Complete Guide`,
        url: `/${cat.slug}/complete-guide`,
      },
      ...cat.subcategories.map((s) => ({
        name: s.label,
        url: `/${cat.slug}/${s.slug}`,
      })),
    ],
    faq: getCategoryFAQs(cat.slug),
    conceptSlugs: getCategoryConceptSlugs(cat.slug),
    authorSlug,
    datePublished: now,
    dateModified: now,
  });

  const faqs = getCategoryFAQs(cat.slug);

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
        <div
          className="wrap-wide"
          style={{ paddingTop: "clamp(2rem, 5vw, 3.5rem)", paddingBottom: "clamp(2.25rem, 5vw, 4rem)" }}
        >
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
            <SubcategoryChips
              categorySlug={cat.slug}
              subs={cat.subcategories}
              counts={subCounts}
            />
          </div>
          <PostGrid posts={posts} categoryLabel={cat.label} />

          {faqs.length > 0 ? (
            <section
              id="faq"
              style={{
                marginTop: "5rem",
                paddingTop: "clamp(1.75rem, 4vw, 3rem)",
                borderTop: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  marginBottom: 10,
                }}
              >
                Frequently asked
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 600,
                  color: "var(--on-light-1)",
                  marginBottom: 22,
                }}
              >
                {cat.label}, answered
              </h2>
              <div style={{ display: "grid", gap: 14 }}>
                {faqs.map((item, idx) => (
                  <details
                    key={idx}
                    style={{
                      padding: "1rem 1.3rem",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "#ffffff",
                    }}
                  >
                    <summary
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--on-light-1)",
                        cursor: "pointer",
                        listStyle: "none",
                      }}
                    >
                      {item.q}
                    </summary>
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 14.5,
                        lineHeight: 1.75,
                        color: "var(--on-light-2)",
                      }}
                    >
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
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
