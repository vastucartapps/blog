import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/utils";
import { getPublishedPosts } from "@/lib/content";
import { getCategory } from "@/lib/categories";
import {
  BLOG_WEBSITE_REF,
  type SchemaEntity,
} from "@/lib/schema/constants";
import { SearchForm } from "./SearchForm";

const URL = `${SITE_URL}/search`;

export const metadata: Metadata = {
  title: "Search — VastuCart Blog",
  description:
    "Search long-form Vedic astrology, Jyotish, Vastu, numerology, tarot, gemstones and rudraksha articles from the VastuCart Blog library.",
  alternates: { canonical: URL },
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchParams {
  q?: string;
}

function ranked(q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const tokens = needle.split(/\s+/).filter(Boolean);
  return getPublishedPosts()
    .map((p) => {
      const haystack = [
        p.title,
        p.subtitle,
        p.tags.join(" "),
        p.meta?.description ?? "",
        p.meta?.focus_keyword ?? "",
        (p.meta?.secondary_keywords ?? []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (haystack.includes(t)) score += 1;
        if (p.title.toLowerCase().includes(t)) score += 2;
      }
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40)
    .map((r) => r.p);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "" } = await searchParams;
  const hits = q ? ranked(q) : [];

  // SearchResultsPage is CreativeWork-legal, so isPartOf + breadcrumb apply.
  const schema: SchemaEntity = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "@id": `${URL}#page`,
    url: URL,
    name: q ? `Search results for "${q}"` : "Search — VastuCart Blog",
    isPartOf: BLOG_WEBSITE_REF,
    description: q
      ? `Articles matching "${q}" from the VastuCart Blog.`
      : "Search the VastuCart Blog library.",
  };

  return (
    <>
      <Header />
      <main>
        <section
          className="diamond-bg relative overflow-hidden"
          style={{ paddingBlock: "3rem" }}
        >
          <div className="wrap-hero-lg relative z-10">
            <nav
              aria-label="Breadcrumb"
              style={{
                marginBottom: 22,
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
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Search</span>
            </nav>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 10,
              }}
            >
              Search the library
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.72)",
                marginBottom: 22,
                maxWidth: 620,
              }}
            >
              Search 92 long-form articles across Jyotish, numerology, tarot,
              Vastu, puja, festivals, gemstones, and rudraksha.
            </p>
            <SearchForm initialQuery={q} />
          </div>
        </section>

        <section className="wrap-wide" style={{ paddingBlock: "3rem" }}>
          {q ? (
            hits.length > 0 ? (
              <>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--on-light-3)",
                    marginBottom: 20,
                  }}
                >
                  {hits.length}{" "}
                  {hits.length === 1 ? "article" : "articles"} matching{" "}
                  <strong style={{ color: "var(--on-light-1)" }}>
                    &ldquo;{q}&rdquo;
                  </strong>
                </p>
                <div style={{ display: "grid", gap: 14 }}>
                  {hits.map((p) => {
                    const cat = getCategory(p.category);
                    return (
                      <Link
                        key={p.id}
                        href={`/${p.category}/${p.subcategory}/${p.slug}`}
                        style={{
                          display: "block",
                          padding: "1.2rem 1.4rem",
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "#ffffff",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                        className="post-card"
                      >
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--teal)",
                            marginBottom: 6,
                          }}
                        >
                          {cat?.label ?? p.category}
                        </span>
                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 600,
                            color: "var(--on-light-1)",
                            lineHeight: 1.3,
                            marginBottom: 4,
                          }}
                        >
                          {p.title}
                        </h2>
                        <p
                          style={{
                            fontSize: 13.5,
                            color: "var(--on-light-3)",
                            lineHeight: 1.65,
                          }}
                        >
                          {p.subtitle}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  borderRadius: 14,
                  border: "1px dashed var(--border-mid)",
                  background: "var(--cream-2)",
                  color: "var(--on-light-3)",
                }}
              >
                No articles match <strong>&ldquo;{q}&rdquo;</strong>. Try a
                shorter query or browse categories from the header.
              </div>
            )
          ) : (
            <p style={{ fontSize: 14, color: "var(--on-light-3)" }}>
              Enter a search term to find articles.
            </p>
          )}
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
