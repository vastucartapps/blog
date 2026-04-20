import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/utils";
import { buildAboutPageSchema, buildHubSchemas } from "@/lib/schema";

const URL = `${SITE_URL}/editorial-standards`;
const PUBLISHED_AT = "2026-04-20T00:00:00.000Z";

export const metadata: Metadata = {
  title: "Editorial Standards — VastuCart Blog",
  description:
    "How articles on VastuCart Blog are researched, written, reviewed, sourced, corrected, and updated. Our practitioner-reviewed process for Vedic astrology, Vastu, numerology, tarot, puja, and gemstone content.",
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    title: "Editorial Standards — VastuCart Blog",
    description:
      "How VastuCart Blog researches, writes, reviews, and updates its long-form content on Jyotish, Vastu, numerology, tarot, and traditional practice.",
    url: URL,
  },
};

export default function EditorialStandardsPage() {
  const aboutSchemas = buildAboutPageSchema({
    slug: "editorial-standards",
    name: "Editorial Standards — VastuCart Blog",
    description:
      "How articles on VastuCart Blog are researched, written, reviewed, sourced, corrected, and updated.",
    breadcrumb: [{ name: "Editorial Standards", url: "/editorial-standards" }],
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
  });

  // Hub layer adds FAQPage + SiteNavigation cross-refs so this policy
  // page gets pulled into Q&A rich results alongside its AboutPage.
  const hubSchemas = buildHubSchemas({
    url: URL,
    pageType: "AboutPage",
    name: "Editorial Standards — VastuCart Blog",
    description:
      "Editorial process, sourcing, review gates, corrections policy, editorial independence, and contact channels.",
    breadcrumb: [{ name: "Editorial Standards", url: "/editorial-standards" }],
    items: [
      { name: "Authorship", url: "/editorial-standards#authorship", position: 1 },
      {
        name: "Research and sourcing",
        url: "/editorial-standards#sourcing",
        position: 2,
      },
      {
        name: "Review before publish",
        url: "/editorial-standards#review",
        position: 3,
      },
      {
        name: "Corrections policy",
        url: "/editorial-standards#corrections",
        position: 4,
      },
      {
        name: "Editorial independence",
        url: "/editorial-standards#independence",
        position: 5,
      },
      {
        name: "Disclaimers",
        url: "/editorial-standards#disclaimers",
        position: 6,
      },
      { name: "Contact", url: "/editorial-standards#contact", position: 7 },
    ],
    navigation: [
      { name: "Authors", url: "/authors" },
      { name: "Classical Sources", url: "/classical-sources" },
      { name: "Glossary", url: "/glossary" },
    ],
    faq: [
      {
        q: "How are articles on VastuCart Blog researched?",
        a: "We cite classical texts first: Brihat Parashara Hora Shastra, Jaimini Sutras, Saravali, Phaladeepika, and Brihat Samhita for Jyotish; Manasara, Mayamatam, and Vishwakarma Prakash for Vastu; Rider Waite tradition for tarot; Pythagorean and Chaldean systems for numerology; Nirnaya Sindhu and Dharma Sindhu for festival timing; Garuda Purana and Rudraksha Jabala Upanishad for Rudraksha. The full reading list lives on the Classical Sources page.",
      },
      {
        q: "Who reviews articles before publication?",
        a: "Jyotish content is authored and reviewed by Pt. Raghav Sharma, a Varanasi-based practicing Jyotishacharya. Everything else is produced by the VastuCart Editorial desk and reviewed by senior practitioners on staff before publication.",
      },
      {
        q: "What happens when a reader flags an error?",
        a: "We investigate within seven days. If the error is confirmed, we correct the article, update the dateModified field, and note the correction at the end of the article. We do not silently edit substantive claims. Email corrections to hi@vastucart.in.",
      },
      {
        q: "Does VastuCart Blog accept sponsored content?",
        a: "No. Our recommendations on gemstones, rudraksha, puja samagri, and consultations are editorial judgements based on classical prescription. Where we link to the VastuCart store, the reader sees the path we would recommend to a consulting client. We do not accept paid placements or sponsored content in editorial articles.",
      },
      {
        q: "Do astrology articles replace professional advice?",
        a: "No. Astrology, numerology, and Vastu are classical knowledge systems that inform personal reflection. Articles on this blog do not substitute for medical, legal, psychological, or financial advice. For personal guidance, book a consultation through the VastuCart panel.",
      },
    ],
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
  });

  const schemas = [...aboutSchemas, ...hubSchemas];

  return (
    <>
      <Header />
      <main>
        <section className="diamond-bg relative overflow-hidden">
          <div
            className="wrap-hero-lg relative z-10"
            style={{ paddingBlock: "3.5rem" }}
          >
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
                style={{
                  color: "rgba(255,255,255,0.50)",
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
              <span style={{ opacity: 0.5 }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Editorial Standards
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
              About
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
              How we research, write, and review
            </h1>
            <p
              style={{
                marginTop: 18,
                maxWidth: 720,
                fontSize: 15,
                lineHeight: 1.78,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              VastuCart Blog publishes long-form articles on Vedic astrology,
              Vastu Shastra, numerology, tarot, puja vidhi, festivals,
              gemstones, and rudraksha. Every article follows the process below
              before it reaches a reader.
            </p>
          </div>
        </section>

        <section
          className="wrap-article"
          style={{ paddingBlock: "4rem" }}
        >
          <div
            className="prose-block"
            style={{
              fontSize: 16,
              lineHeight: 1.85,
              color: "var(--on-light-2)",
            }}
          >
            <h2 id="authorship" style={proseH2}>1. Authorship</h2>
            <p>
              Jyotish content — every Graha placement, Dasha analysis, Lagna
              profile, Nakshatra reading, and remedial article — is authored
              and reviewed by{" "}
              <Link href="/authors/pt-raghav-sharma" style={proseLink}>
                Pt. Raghav Sharma
              </Link>
              , a practicing Jyotishacharya in Varanasi with two decades of
              consultation experience in the Parasari tradition. Everything
              else, including numerology, Vastu, tarot, puja vidhi, festivals,
              gemstones, and rudraksha, is produced by the{" "}
              <Link href="/authors/vastucart-editorial" style={proseLink}>
                VastuCart Editorial Desk
              </Link>{" "}
              and reviewed by the senior panel before publication.
            </p>

            <h2 id="sourcing" style={proseH2}>2. Research and sourcing</h2>
            <p>
              We cite classical texts first: Brihat Parashara Hora Shastra,
              Jaimini Sutras, Saravali, Phaladeepika, Brihat Samhita, and the
              Manasagari. Vastu content references Manasara, Mayamatam, and
              Vishwakarma Prakash. Tarot content references the Rider Waite
              tradition and Pamela Colman Smith's 1910 deck as the primary
              source. Numerology follows the Pythagorean and Chaldean systems.
              The full reading list lives on our{" "}
              <Link href="/classical-sources" style={proseLink}>
                classical sources
              </Link>{" "}
              page.
            </p>

            <h2 id="review" style={proseH2}>3. Review before publish</h2>
            <p>
              Every article goes through four gates: factual review against the
              primary source, Sanskrit term spelling check, internal-link
              validation against a sitemap cache so no URL is fabricated, and
              JSON-LD schema validation against Google Rich Results. Nothing
              ships with broken schema or unresolved internal links.
            </p>

            <h2 id="corrections" style={proseH2}>4. Corrections policy</h2>
            <p>
              When a reader flags an error, we investigate within seven days.
              If confirmed, we correct the article, update the{" "}
              <code
                style={{
                  fontSize: 13.5,
                  padding: "2px 6px",
                  background: "var(--cream-2)",
                  borderRadius: 4,
                }}
              >
                dateModified
              </code>{" "}
              field, and note the correction at the end of the article. We do
              not silently edit substantive claims. Email corrections to{" "}
              <a href="mailto:hi@vastucart.in" style={proseLink}>
                hi@vastucart.in
              </a>
              .
            </p>

            <h2 id="independence" style={proseH2}>5. Editorial independence</h2>
            <p>
              Our recommendations on gemstones, rudraksha, puja samagri, and
              consultations are editorial judgements based on classical
              prescription. Where we link to the VastuCart store, the reader
              sees the path we would recommend to a consulting client. We do
              not accept paid placements or sponsored content in editorial
              articles.
            </p>

            <h2 id="disclaimers" style={proseH2}>6. Disclaimers</h2>
            <p>
              Astrology, numerology, and Vastu are classical knowledge systems
              that inform personal reflection. Articles on this blog do not
              substitute for medical, legal, psychological, or financial
              advice. For personal guidance, book a consultation through the
              VastuCart panel.
            </p>

            <h2 id="contact" style={proseH2}>7. Contact</h2>
            <p>
              Editorial queries:{" "}
              <a href="mailto:hi@vastucart.in" style={proseLink}>
                hi@vastucart.in
              </a>
              . Business queries:{" "}
              <a href="mailto:business@vastucart.in" style={proseLink}>
                business@vastucart.in
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-edit-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}

const proseH2 = {
  fontFamily: "var(--font-display)",
  fontSize: 24,
  fontWeight: 600,
  color: "var(--on-light-1)",
  marginTop: "2.5rem",
  marginBottom: "0.75rem",
} as const;

const proseLink = {
  color: "var(--teal)",
  textDecoration: "underline",
  textUnderlineOffset: 3,
} as const;
