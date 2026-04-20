import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/utils";
import { GLOSSARY_TERMS } from "@/lib/glossary-terms";
import {
  buildDefinedTermSchemas,
  buildCollectionPageSchema,
} from "@/lib/schema";

const URL = `${SITE_URL}/glossary`;
const PUBLISHED_AT = "2026-04-20T00:00:00.000Z";

export const metadata: Metadata = {
  title: "Glossary — VastuCart Blog",
  description:
    "Canonical glossary of Sanskrit terms used across the VastuCart Blog: lagna, graha, bhava, rashi, nakshatra, dasha, yoga, dosha, muhurta, panchanga, and more.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "Glossary — VastuCart Blog",
    description:
      "Canonical glossary of Sanskrit terms used across Jyotish, Vastu, puja, and ritual articles on VastuCart Blog.",
    url: URL,
  },
};

export default function GlossaryPage() {
  const collection = buildCollectionPageSchema({
    url: URL,
    name: "Glossary — VastuCart Blog",
    description:
      "Canonical Sanskrit term definitions used across every article on VastuCart Blog.",
    items: GLOSSARY_TERMS.map((t) => ({
      name: t.name,
      url: `/glossary#${t.id}`,
      description: t.description,
    })),
    breadcrumb: [{ name: "Glossary", url: "/glossary" }],
  });

  const definedTerms = buildDefinedTermSchemas(GLOSSARY_TERMS);
  const schemas = [...collection, ...definedTerms];

  const sorted = [...GLOSSARY_TERMS].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <Header />
      <main>
        <section
          className="diamond-bg relative overflow-hidden"
          style={{ paddingBlock: "3.5rem" }}
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
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Glossary</span>
            </nav>
            <span
              style={{
                display: "inline-flex",
                fontSize: 10.5,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 20,
                background: "rgba(51,138,149,0.18)",
                border: "1px solid rgba(51,138,149,0.30)",
                color: "var(--teal-light)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Glossary
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
              Sanskrit terms, defined once
            </h1>
            <p
              style={{
                marginTop: 16,
                maxWidth: 720,
                fontSize: 15,
                lineHeight: 1.78,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Every Sanskrit term used across the blog maps to a canonical
              definition here. Click any entry to deep-link it from an article
              reference.
            </p>
          </div>
        </section>

        <section className="wrap-article" style={{ paddingBlock: "4rem" }}>
          <div style={{ display: "grid", gap: 14 }}>
            {sorted.map((t) => (
              <article
                key={t.id}
                id={t.id}
                style={{
                  padding: "1.3rem 1.5rem",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "#ffffff",
                  boxShadow: "0 12px 28px -22px rgba(1,63,71,0.15)",
                  scrollMarginTop: 90,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 19,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    marginBottom: 6,
                  }}
                >
                  {t.name}
                </h2>
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.72,
                    color: "var(--on-light-2)",
                  }}
                >
                  {t.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-glossary-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
