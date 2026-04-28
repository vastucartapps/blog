import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/content";
import { resolveFeaturedImage } from "@/lib/post-images";
import { SITE_URL } from "@/lib/utils";
import { buildPillarSchemas } from "@/lib/schema";

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
  const url = `${SITE_URL}/${cat.slug}/complete-guide`;
  const title = `${cat.label} Complete Guide — VastuCart Blog`;
  const description = `The complete ${cat.label.toLowerCase()} guide: every article in the VastuCart Blog ${cat.label.toLowerCase()} cluster, organised by topic.`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "x-default": url,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
    },
  };
}

export default async function CategoryPillarPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const posts = getPostsByCategory(cat.slug);
  const url = `${SITE_URL}/${cat.slug}/complete-guide`;
  const authorSlug = "vastucart-editorial";

  const now = new Date().toISOString();
  // Derive pillar word count from the intro + subcategory descriptions +
  // included post count so the schema has a real value and isn't a guess.
  const descriptionCount =
    cat.description.split(/\s+/).filter(Boolean).length +
    cat.subcategories
      .map((s) => s.description.split(/\s+/).filter(Boolean).length)
      .reduce((a, b) => a + b, 0);
  const wordCount = descriptionCount + posts.length * 12;

  const parts = posts.map((p) => ({
    name: p.title,
    url: `/${p.category}/${p.subcategory}/${p.slug}`,
    description: p.meta?.description ?? p.subtitle,
    level: ("Intermediate" as const),
  }));

  const schemas = buildPillarSchemas({
    category: cat.slug,
    categoryLabel: cat.label,
    name: `${cat.label} Complete Guide`,
    headline: `${cat.label} Complete Guide, ${cat.label_hindi}`,
    description: `The complete ${cat.label.toLowerCase()} guide from VastuCart Blog: every article organised by topic with links to the deeper cluster.`,
    wordCount,
    authorSlug,
    datePublished: now,
    dateModified: now,
    parts,
    breadcrumb: [
      { name: cat.label, url: `/${cat.slug}` },
      { name: "Complete Guide", url: `/${cat.slug}/complete-guide` },
    ],
  });

  return (
    <>
      <Header />
      <main>
        <section
          className="diamond-bg relative overflow-hidden"
          style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <div className="wrap-hero-lg relative z-10">
            <nav
              aria-label="Breadcrumb"
              style={{
                marginBottom: 24,
                display: "flex",
                gap: 8,
                fontSize: 11,
                color: "rgba(255,255,255,0.50)",
              }}
            >
              <Link
                href="/"
                style={{
                  color: "rgba(255,255,255,0.50)",
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
              <span style={{ opacity: 0.5 }}>›</span>
              <Link
                href={`/${cat.slug}`}
                style={{
                  color: "rgba(255,255,255,0.50)",
                  textDecoration: "none",
                }}
              >
                {cat.label}
              </Link>
              <span style={{ opacity: 0.5 }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Complete Guide
              </span>
            </nav>
            <span
              style={{
                display: "inline-flex",
                fontSize: 10.5,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 20,
                background: "rgba(232,132,10,0.15)",
                border: "1px solid rgba(232,132,10,0.30)",
                color: "var(--saffron-light)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Pillar
            </span>
            <h1
              style={{
                marginTop: 14,
                fontFamily: "var(--font-display)",
                fontSize: 38,
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.2,
              }}
            >
              {cat.label} Complete Guide
            </h1>
            <p
              style={{
                marginTop: 14,
                maxWidth: 720,
                fontSize: 15,
                lineHeight: 1.78,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              {cat.description}
            </p>
            <p
              style={{
                marginTop: 16,
                fontSize: 12.5,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {posts.length} articles across {cat.subcategories.length} subcategories.
            </p>
          </div>
        </section>

        <section className="wrap-article" style={{ paddingBlock: "clamp(2.25rem, 5vw, 4rem)" }}>
          {cat.subcategories.map((sub) => {
            const subPosts = posts.filter((p) => p.subcategory === sub.slug);
            if (subPosts.length === 0) return null;
            return (
              <div key={sub.slug} style={{ marginBottom: "3.5rem" }}>
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--teal)",
                    marginBottom: 8,
                  }}
                >
                  {sub.label_hindi}
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    marginBottom: 6,
                  }}
                >
                  <Link
                    href={`/${cat.slug}/${sub.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {sub.label}
                  </Link>
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--on-light-3)",
                    marginBottom: 18,
                    maxWidth: 720,
                  }}
                >
                  {sub.description}
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {subPosts.map((p) => {
                    const featured = resolveFeaturedImage(p);
                    return (
                    <Link
                      key={p.id}
                      href={`/${p.category}/${p.subcategory}/${p.slug}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: featured ? "100px 1fr" : "1fr",
                        gap: 12,
                        padding: featured ? "0" : "0.9rem 1.1rem",
                        paddingRight: "1.1rem",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "#ffffff",
                        textDecoration: "none",
                        color: "inherit",
                        overflow: "hidden",
                      }}
                      className="post-card"
                    >
                      {featured ? (
                        <div
                          style={{
                            position: "relative",
                            minHeight: 80,
                            background: "var(--cream-2)",
                          }}
                        >
                          <Image
                            src={featured.src}
                            alt={featured.alt}
                            fill
                            sizes="100px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : null}
                      <div style={{ padding: featured ? "0.75rem 0" : 0 }}>
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 15.5,
                            fontWeight: 600,
                            color: "var(--on-light-1)",
                            lineHeight: 1.35,
                          }}
                        >
                          {p.title}
                        </h3>
                        {p.subtitle ? (
                          <p
                            style={{
                              marginTop: 3,
                              fontSize: 12.5,
                              color: "var(--on-light-3)",
                              lineHeight: 1.55,
                            }}
                          >
                            {p.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-pillar-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
