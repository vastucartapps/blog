import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/ui/Icon";
import { AUTHORS, getAuthor } from "@/lib/authors";
import { getPublishedPosts } from "@/lib/content";
import { resolveFeaturedImage } from "@/lib/post-images";
import { absoluteUrl, formatDate, SITE_URL } from "@/lib/utils";
import { authorUrl } from "@/lib/internal-links";
import {
  buildPersonSchema,
  buildProfilePageSchema,
} from "@/lib/schema";
import { buildAlternates, buildSocialMetadata, metaDescription } from "@/lib/seo/social-metadata";

interface Params {
  slug: string;
}

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  const url = absoluteUrl(authorUrl(slug));
  const title = `${author.name}, ${author.title}`;
  const description = metaDescription(author.bio);
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(url),
    ...buildSocialMetadata({
      title,
      description,
      url,
      type: "profile",
      imageUrl: author.avatar_url,
    }),
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const posts = getPublishedPosts().filter((p) => p.author_id === slug);

  // Canonical Person + ProfilePage per public/00-shared-contracts.md §2.2.
  // Both use the contract @id strings so sister subdomains can reference
  // them verbatim without redefinition.
  const personSchema = buildPersonSchema(slug);
  const profileSchema = buildProfilePageSchema(slug);
  const schemas = [personSchema, profileSchema].filter(
    (s): s is NonNullable<typeof s> => s !== null
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="diamond-bg relative overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: -120,
              right: -100,
              width: 520,
              height: 520,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,132,10,0.20) 0%, transparent 65%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              bottom: -120,
              left: -80,
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(51,138,149,0.18) 0%, transparent 65%)",
            }}
          />
          <div className="wrap-hero-lg relative z-10">
            <nav
              aria-label="Breadcrumb"
              style={{
                marginBottom: 24,
                display: "flex",
                gap: 8,
                fontSize: 11,
                color: "rgba(255,255,255,0.50)",
                letterSpacing: "0.07em",
              }}
            >
              <Link
                href="/"
                style={{ color: "rgba(255,255,255,0.50)", textDecoration: "none" }}
              >
                Home
              </Link>
              <span style={{ opacity: 0.5 }}>›</span>
              <span>Authors</span>
              <span style={{ opacity: 0.5 }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>{author.name}</span>
            </nav>

            <div className="author-hero">
              <div
                style={{
                  width: 156,
                  height: 156,
                  borderRadius: "50%",
                  border: "3px solid var(--gold-light)",
                  background: author.avatar_url
                    ? "transparent"
                    : "linear-gradient(135deg, var(--dark) 0%, var(--teal) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold-light)",
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 600,
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow:
                    "0 22px 50px -16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                {author.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={`${author.name}, ${author.title}`}
                    fill
                    sizes="156px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  author.initials
                )}
              </div>
              <div className="author-hero-body">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
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
                  {slug === "vastucart-editorial" ? "Editorial Desk" : "Senior Author"}
                </span>
                <h1
                  className="hero-display-sm"
                  style={{
                    marginTop: 14,
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  {author.name}
                </h1>
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 16,
                    color: "var(--saffron-light)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  {author.title}
                </p>
                <p
                  style={{
                    marginTop: 18,
                    maxWidth: 720,
                    fontSize: 15,
                    lineHeight: 1.78,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {author.bio}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: 28,
                paddingTop: 22,
                borderTop: "1px solid rgba(255,255,255,0.10)",
                display: "flex",
                gap: 36,
                flexWrap: "wrap",
              }}
            >
              {slug === "vastucart-editorial" ? (
                <>
                  <Stat label="Desk" value="Editorial" />
                  <Stat label="Articles published" value={`${posts.length}`} />
                  <Stat label="Coverage" value={`${author.categories.length} categories`} />
                  <Stat label="Based in" value={author.location} />
                </>
              ) : (
                <>
                  <Stat label="Years of practice" value={`${author.experience_years}+`} />
                  <Stat label="Articles published" value={`${posts.length}`} />
                  <Stat label="Lineage" value={author.lineage ?? "Parashari Jyotish"} />
                  <Stat label="Based in" value={author.location} />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Specialisation + recent posts */}
        <section className="wrap-wide" style={{ paddingTop: "clamp(2.25rem, 5vw, 4rem)", paddingBottom: "clamp(2.5rem, 6vw, 5rem)" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--teal)",
              }}
            >
              Areas of expertise
            </p>
            <h2
              style={{
                marginTop: 10,
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 600,
                color: "var(--on-light-1)",
              }}
            >
              Specialisations
            </h2>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {author.specialization.map((s) => (
                <span
                  key={s}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "var(--cream-2)",
                    color: "var(--on-light-1)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--teal)",
              }}
            >
              Articles by {author.name}
            </p>
            <h2
              style={{
                marginTop: 10,
                marginBottom: 22,
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 600,
                color: "var(--on-light-1)",
              }}
            >
              {posts.length === 0
                ? "Articles coming soon"
                : `${posts.length} published ${posts.length === 1 ? "article" : "articles"}`}
            </h2>
            {posts.length === 0 ? (
              <div
                style={{
                  borderRadius: 16,
                  border: "1px dashed var(--border-mid)",
                  background: "var(--cream-2)",
                  padding: "clamp(1.75rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2rem)",
                  textAlign: "center",
                  color: "var(--on-light-3)",
                  fontSize: 14,
                }}
              >
                {author.name} is currently writing the first batch of articles.
                Check back shortly.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 18,
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                {posts.map((p) => {
                  const featured = resolveFeaturedImage(p);
                  return (
                  <Link
                    key={p.id}
                    href={`/${p.category}/${p.subcategory}/${p.slug}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      borderRadius: 16,
                      border: "1px solid var(--border)",
                      background: "#ffffff",
                      textDecoration: "none",
                      boxShadow: "0 14px 36px -22px rgba(1,63,71,0.20)",
                    }}
                    className="post-card"
                  >
                    {featured ? (
                      <div
                        style={{
                          position: "relative",
                          height: 160,
                          overflow: "hidden",
                          background: "var(--cream-2)",
                        }}
                      >
                        <Image
                          src={featured.src}
                          alt={featured.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 280px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div
                        className="diamond-bg"
                        style={{
                          height: 140,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--saffron-light)",
                        }}
                      >
                        <Icon name="sun" size={56} />
                      </div>
                    )}
                    <div style={{ padding: "1.25rem 1.4rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: "var(--cream-2)",
                          color: "var(--teal)",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {p.category}
                      </span>
                      <h3
                        style={{
                          marginTop: 12,
                          fontFamily: "var(--font-display)",
                          fontSize: 17,
                          fontWeight: 600,
                          lineHeight: 1.3,
                          color: "var(--on-light-1)",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{
                          marginTop: 8,
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: "var(--on-light-3)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.subtitle}
                      </p>
                      <div
                        style={{
                          marginTop: 14,
                          display: "flex",
                          gap: 12,
                          fontSize: 11,
                          color: "var(--on-light-4)",
                        }}
                      >
                        <span
                          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                        >
                          <Icon name="clock" size={11} />
                          {p.reading_time_minutes} min
                        </span>
                        <span>{formatDate(p.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-author-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 600,
          color: "var(--saffron-light)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
