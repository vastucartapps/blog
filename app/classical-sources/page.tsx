import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/utils";
import {
  buildAboutPageSchema,
  buildBookSchemas,
  CLASSICAL_BOOKS,
  buildHubSchemas,
} from "@/lib/schema";
import { buildAlternates, buildSocialMetadata, metaDescription } from "@/lib/seo/social-metadata";

const URL = `${SITE_URL}/classical-sources`;
const PUBLISHED_AT = "2026-04-20T00:00:00.000Z";

const PAGE_TITLE = "Classical Sources — VastuCart Blog";
const PAGE_DESCRIPTION = metaDescription(
  "The classical texts and traditions that underpin every article on VastuCart Blog. Brihat Parashara Hora Shastra, Jaimini Sutras, Saravali, Manasara, Mayamatam, Rider Waite, and the numerology lineage.",
);

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: buildAlternates(URL),
  ...buildSocialMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: URL,
    type: "article",
  }),
};

interface SourceEntry {
  title: string;
  author?: string;
  sanskrit?: string;
  summary: string;
  domain: string;
}

const SOURCES: SourceEntry[] = [
  {
    title: "Brihat Parashara Hora Shastra",
    author: "Maharshi Parashara",
    sanskrit: "बृहत् पाराशर होरा शास्त्र",
    summary:
      "The foundational Parashari treatise. Houses, planets, yogas, dashas, and remedial principles. We cite BPHS chapters whenever a classical yoga or graha effect is invoked.",
    domain: "Jyotish",
  },
  {
    title: "Jaimini Sutras",
    author: "Maharshi Jaimini",
    summary:
      "The Jaimini system of chara dashas, arudha lagnas, and karaka-based analysis. Used for specialised timing techniques alongside the Parashari framework.",
    domain: "Jyotish",
  },
  {
    title: "Saravali",
    author: "Kalyan Varma",
    sanskrit: "सारावली",
    summary:
      "Tenth-century compendium on nativity analysis. Strong reference for planetary conjunctions, yogas, and marriage timing.",
    domain: "Jyotish",
  },
  {
    title: "Phaladeepika",
    author: "Mantreswara",
    sanskrit: "फलदीपिका",
    summary:
      "Classical predictive manual covering longevity, profession, and special nakshatra combinations. Cited in dasha prediction articles.",
    domain: "Jyotish",
  },
  {
    title: "Brihat Jataka",
    author: "Varahamihira",
    sanskrit: "बृहत् जातक",
    summary:
      "Sixth-century natal astrology. Definitive reference for planetary dignity, house meanings, and early yoga formulations.",
    domain: "Jyotish",
  },
  {
    title: "Brihat Samhita",
    author: "Varahamihira",
    sanskrit: "बृहत् संहिता",
    summary:
      "Encyclopaedic treatise on omens, planetary influences on society, muhurta selection, and civic architecture. Bridges Jyotish and Vastu content.",
    domain: "Jyotish and Vastu",
  },
  {
    title: "Manasara",
    sanskrit: "मानसार",
    summary:
      "Ancient Sanskrit manual on architecture and sculpture. Primary source for direction, room placement, and temple geometry in Vastu articles.",
    domain: "Vastu",
  },
  {
    title: "Mayamatam",
    summary:
      "South Indian Vastu and Shilpa classic. Used alongside Manasara for Vastu Purusha Mandala and site selection guidance.",
    domain: "Vastu",
  },
  {
    title: "Vishwakarma Prakash",
    summary:
      "Vastu text attributed to Vishwakarma. Informs entrance placement, brahmasthana rules, and residential Vastu articles.",
    domain: "Vastu",
  },
  {
    title: "Rider Waite Tarot",
    author: "A. E. Waite and Pamela Colman Smith, 1910",
    summary:
      "The canonical Western tarot imagery. Our Major and Minor Arcana articles describe the Rider Waite iconography, upright and reversed readings.",
    domain: "Tarot",
  },
  {
    title: "Pythagorean Numerology",
    summary:
      "The A=1..Z=26 reduction system. We use Pythagorean calculations for Life Path, Destiny, and Expression numbers.",
    domain: "Numerology",
  },
  {
    title: "Chaldean Numerology",
    summary:
      "The older Chaldean letter-value table. Applied when a post covers name numerology corrections and vibration analysis.",
    domain: "Numerology",
  },
  {
    title: "Nirnaya Sindhu",
    author: "Kamalakara Bhatta",
    sanskrit: "निर्णय सिन्धु",
    summary:
      "Seventeenth-century authority on vrata, tithi, muhurta, and ritual timing. Drives our festival date resolution and ekadashi articles.",
    domain: "Festivals and Puja",
  },
  {
    title: "Dharma Sindhu",
    author: "Kashinath Upadhyay",
    summary:
      "Companion text to Nirnaya Sindhu. Consulted for puja procedure, auspicious timing, and samskara sequences.",
    domain: "Festivals and Puja",
  },
  {
    title: "Garuda Purana",
    sanskrit: "गरुड़ पुराण",
    summary:
      "Puranic source for Rudraksha lineage, mukhi classification, and Shiva worship principles. Rudraksha articles reference the Rudraksha Jabala Upanishad alongside this text.",
    domain: "Rudraksha",
  },
  {
    title: "Rudraksha Jabala Upanishad",
    summary:
      "Primary Upanishadic text on the origin and classification of Rudraksha. Authoritative for mukhi significance.",
    domain: "Rudraksha",
  },
  {
    title: "Ratna Pariksha",
    summary:
      "Classical gemmology treatises within the Garuda Purana and Agni Purana traditions. Inform quality, carat, and wearing guidance for jyotish gemstones.",
    domain: "Gemstones",
  },
];

const DOMAINS = Array.from(new Set(SOURCES.map((s) => s.domain)));

export default function ClassicalSourcesPage() {
  const aboutSchemas = buildAboutPageSchema({
    slug: "classical-sources",
    name: "Classical Sources — VastuCart Blog",
    description:
      "The classical texts VastuCart Blog draws from across Jyotish, Vastu, numerology, tarot, festivals, rudraksha, and gemstones.",
    breadcrumb: [{ name: "Classical Sources", url: "/classical-sources" }],
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
  });

  // Emit a Book entity for every classical text so each carries its
  // own schema signature in Google's Knowledge Graph.
  const bookSchemas = buildBookSchemas(CLASSICAL_BOOKS, URL);

  // Hub-style listing for the books-as-items representation.
  const hubSchemas = buildHubSchemas({
    url: URL,
    pageType: "CollectionPage",
    name: "Classical Sources — VastuCart Blog",
    description:
      "Every article on VastuCart Blog is grounded in a named classical source. This page lists the Sanskrit and English texts that underpin our content.",
    breadcrumb: [{ name: "Classical Sources", url: "/classical-sources" }],
    items: CLASSICAL_BOOKS.map((b, i) => ({
      name: b.name,
      url: `/classical-sources#${b.id}`,
      description: b.description,
      position: i + 1,
    })),
    navigation: [
      { name: "Editorial Standards", url: "/editorial-standards" },
      { name: "Authors", url: "/authors" },
      { name: "Glossary", url: "/glossary" },
    ],
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
  });

  const schemas = [...aboutSchemas, ...hubSchemas, ...bookSchemas];

  return (
    <>
      <Header />
      <main>
        <section className="diamond-bg relative overflow-hidden">
          <div
            className="wrap-hero-lg relative z-10"
            style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem)" }}
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
                Classical Sources
              </span>
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
              Sources
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
              The texts we stand on
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
              Every article on VastuCart Blog is grounded in a named classical
              source. This page lists them by domain so you can verify the
              lineage of any claim we publish.
            </p>
          </div>
        </section>

        <section className="wrap-article" style={{ paddingBlock: "clamp(2.25rem, 5vw, 4rem)" }}>
          {DOMAINS.map((domain) => (
            <div key={domain} style={{ marginBottom: "3.5rem" }}>
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
                {domain}
              </p>
              <div style={{ display: "grid", gap: 14 }}>
                {SOURCES.filter((s) => s.domain === domain).map((s) => (
                  <article
                    key={s.title}
                    id={s.title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}
                    style={{
                      scrollMarginTop: 90,
                      padding: "1.4rem 1.6rem",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "#ffffff",
                      boxShadow:
                        "0 14px 30px -22px rgba(1,63,71,0.15)",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 19,
                        fontWeight: 600,
                        color: "var(--on-light-1)",
                        marginBottom: 4,
                      }}
                    >
                      {s.title}
                      {s.sanskrit ? (
                        <span
                          style={{
                            marginLeft: 10,
                            fontFamily: "var(--font-verse)",
                            fontSize: 16,
                            fontWeight: 500,
                            color: "var(--saffron)",
                          }}
                        >
                          {s.sanskrit}
                        </span>
                      ) : null}
                    </h3>
                    {s.author ? (
                      <p
                        style={{
                          fontSize: 13,
                          fontStyle: "italic",
                          color: "var(--on-light-3)",
                          marginBottom: 8,
                        }}
                      >
                        {s.author}
                      </p>
                    ) : null}
                    <p
                      style={{
                        fontSize: 14.5,
                        lineHeight: 1.75,
                        color: "var(--on-light-2)",
                      }}
                    >
                      {s.summary}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
          <p
            style={{
              fontSize: 13,
              color: "var(--on-light-4)",
              marginTop: "2rem",
            }}
          >
            See our{" "}
            <Link
              href="/editorial-standards"
              style={{ color: "var(--teal)", textDecoration: "underline" }}
            >
              editorial standards
            </Link>{" "}
            for how these sources are used before publication.
          </p>
        </section>
      </main>
      <Footer />
      {schemas.map((entity, i) => (
        <script
          key={`ld-cls-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
