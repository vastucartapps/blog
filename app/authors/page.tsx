import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AUTHORS } from "@/lib/authors";
import { getPublishedPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";
import {
  buildHubSchemas,
  buildAllPersonSchemas,
} from "@/lib/schema";

const URL = `${SITE_URL}/authors`;

export const metadata: Metadata = {
  title: "Authors — VastuCart Blog",
  description:
    "VastuCart Editorial is the in-house desk that researches, writes, and edits every article on VastuCart Blog. Jyotish content is additionally reviewed by the VastuCart Jyotish Review Panel.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "Authors — VastuCart Blog",
    description:
      "VastuCart Editorial is the in-house desk that produces every article on VastuCart Blog. Jyotish content is reviewed by the VastuCart Jyotish Review Panel.",
    url: URL,
  },
};

export default function AuthorsIndexPage() {
  const posts = getPublishedPosts();
  const countByAuthor = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.author_id] = (acc[p.author_id] ?? 0) + 1;
    return acc;
  }, {});

  const authorList = Object.values(AUTHORS);

  const hubSchemas = buildHubSchemas({
    url: URL,
    pageType: "CollectionPage",
    name: "Authors — VastuCart Blog",
    description:
      "VastuCart Editorial is the in-house desk that researches, writes, and edits every article on VastuCart Blog. Jyotish content is additionally reviewed by the VastuCart Jyotish Review Panel.",
    breadcrumb: [{ name: "Authors", url: "/authors" }],
    items: authorList.map((a, i) => ({
      name: a.name,
      url: `/authors/${a.id}`,
      description: a.bio,
      position: i + 1,
    })),
    navigation: [
      { name: "Editorial Standards", url: "/editorial-standards" },
      { name: "Classical Sources", url: "/classical-sources" },
      { name: "Glossary", url: "/glossary" },
    ],
    faq: [
      {
        q: "Who writes the articles on VastuCart Blog?",
        a: "Every article on VastuCart Blog is published under a single byline: VastuCart Editorial. We are an in-house desk that researches, writes, and edits long-form content on Vedic astrology, numerology, Vastu, tarot, puja vidhi, festivals, gemstones, and rudraksha.",
      },
      {
        q: "Who reviews Jyotish articles before publication?",
        a: "Every Jyotish article is reviewed by the VastuCart Jyotish Review Panel, an in-house collective of senior Vedic astrology practitioners. The panel verifies graha placements, dasha calculations, yoga interpretations, and remedial recommendations before any Jyotish article ships.",
      },
      {
        q: "How is accuracy ensured?",
        a: "Every article passes four editorial gates: factual review against primary classical sources (BPHS, Jaimini Sutras, Manasara, Rudraksha Jabala Upanishad, and others listed on our Classical Sources page), Sanskrit spelling check, internal-link validation, and JSON-LD schema validation.",
      },
      {
        q: "Can I contact the editorial desk?",
        a: "Editorial queries go to hi@vastucart.in. Business queries go to business@vastucart.in. We do not surface individual contributor names because our content reflects the desk and its review panel, not a single practitioner.",
      },
    ],
    datePublished: "2026-04-20T00:00:00.000Z",
    dateModified: new Date().toISOString(),
  });

  const schemas = [...hubSchemas, ...buildAllPersonSchemas()];

  return (
    <>
      <Header />
      <main>
        <section className="diamond-bg relative overflow-hidden">
          <div className="wrap-hero-lg relative z-10" style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem)" }}>
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
              <Link href="/" style={{ color: "rgba(255,255,255,0.50)", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ opacity: 0.5 }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Authors</span>
            </nav>
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
              Authors
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
              Who writes the VastuCart Blog
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
              Every article on this blog is published under one byline:
              VastuCart Editorial. Our in-house desk researches, writes, and
              edits the content. Jyotish articles are additionally reviewed
              by the VastuCart Jyotish Review Panel before publication.
              Read our{" "}
              <Link
                href="/editorial-standards"
                style={{ color: "var(--saffron-light)", textDecoration: "underline" }}
              >
                editorial standards
              </Link>{" "}
              and the{" "}
              <Link
                href="/classical-sources"
                style={{ color: "var(--saffron-light)", textDecoration: "underline" }}
              >
                classical sources
              </Link>{" "}
              we draw from.
            </p>
          </div>
        </section>

        <section className="wrap-wide" style={{ paddingBlock: "clamp(2.25rem, 5vw, 4rem)" }}>
          <div
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            {authorList.map((author) => {
              const count = countByAuthor[author.id] ?? 0;
              return (
                <Link
                  key={author.id}
                  href={`/authors/${author.id}`}
                  style={{
                    display: "block",
                    padding: "2rem",
                    borderRadius: 18,
                    border: "1px solid var(--border)",
                    background: "#ffffff",
                    boxShadow: "0 18px 40px -24px rgba(1,63,71,0.18)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  className="post-card"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        overflow: "hidden",
                        position: "relative",
                        background: "var(--cream-2)",
                        border: "2px solid var(--border)",
                        flexShrink: 0,
                      }}
                    >
                      {author.avatar_url ? (
                        <Image
                          src={author.avatar_url}
                          alt={author.name}
                          fill
                          sizes="72px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            color: "var(--teal)",
                            fontWeight: 600,
                            fontSize: 22,
                          }}
                        >
                          {author.initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--teal)",
                        }}
                      >
                        Editorial Desk
                      </span>
                      <h2
                        style={{
                          marginTop: 4,
                          fontFamily: "var(--font-display)",
                          fontSize: 21,
                          fontWeight: 600,
                          color: "var(--on-light-1)",
                          lineHeight: 1.25,
                        }}
                      >
                        {author.name}
                      </h2>
                      <p
                        style={{
                          marginTop: 2,
                          fontSize: 13,
                          color: "var(--on-light-3)",
                        }}
                      >
                        {author.title}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--on-light-2)",
                      marginBottom: 18,
                    }}
                  >
                    {author.bio}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      fontSize: 11,
                      color: "var(--on-light-4)",
                    }}
                  >
                    <span>{count} articles</span>
                    <span>·</span>
                    <span>{author.location}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-authors-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
