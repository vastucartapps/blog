import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

// ─────────────────────────────────────────────────────────────────
// Topical Index — homepage section that explicitly surfaces every
// subcategory hub + complete-guide pillar so Google has a direct,
// in-content link from the (already indexed) homepage to all 56
// otherwise-thin internal targets.
//
// Why it exists: the GSC URL Inspection audit on 257 URLs showed
// 80 hub pages in "URL is unknown to Google" state — Google saw them
// in the sitemap but never crawled them, presumably because the only
// inbound links were from cluster posts that Google itself had not
// yet crawled. The Footer already lists the 8 top-level categories
// and E-E-A-T anchors, but not the deeper subcategory and pillar
// surface. This section closes that gap from the strongest internal
// signal on the site: the home page.
//
// Anchor text follows category.label so each link carries topical
// relevance. The component renders as a static SSR block (no client
// state) so Googlebot's first-pass HTML contains the entire link
// matrix.
// ─────────────────────────────────────────────────────────────────

interface Props {
  postCounts: Record<string, number>;
  subcategoryCounts: Record<string, Record<string, number>>;
}

const EDITORIAL_LINKS: { label: string; href: string }[] = [
  { label: "VastuCart Editorial — author profile", href: "/authors/vastucart-editorial" },
  { label: "Editorial standards", href: "/editorial-standards" },
  { label: "Classical sources", href: "/classical-sources" },
  { label: "Sanskrit glossary", href: "/glossary" },
  { label: "All authors", href: "/authors" },
];

export function TopicalIndex({ postCounts, subcategoryCounts }: Props) {
  return (
    <section
      aria-labelledby="topical-index-heading"
      className="diamond-bg"
      style={{
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
      }}
    >
      <div className="wrap-page">
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--saffron-light)",
              margin: 0,
            }}
          >
            Topical index
          </p>
          <h2
            id="topical-index-heading"
            style={{
              marginTop: 12,
              fontFamily: "var(--font-display)",
              color: "var(--on-dark-1)",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 600,
            }}
          >
            Every hub on the blog
          </h2>
          <p
            style={{
              margin: "12px auto 0",
              maxWidth: 620,
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "var(--on-dark-3)",
            }}
          >
            The full topical map of the VastuCart Blog. Eight disciplines, every
            subcategory hub, and the complete-guide pillar for each.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 22,
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          }}
        >
          {CATEGORIES.map((c) => {
            const total = postCounts[c.id] ?? 0;
            return (
              <div
                key={c.id}
                style={{
                  padding: "20px 22px 22px 22px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <Link
                  href={`/${c.slug}`}
                  style={{
                    color: "var(--on-dark-1)",
                    textDecoration: "none",
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {c.label}
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--saffron-light)",
                    }}
                  >
                    {total}
                  </span>
                </Link>
                <div
                  className="verse"
                  style={{ marginTop: 2, fontSize: 12, color: "var(--on-dark-4)" }}
                >
                  {c.label_hindi}
                </div>

                <Link
                  href={`/${c.slug}/complete-guide`}
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    padding: "5px 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(232,132,10,0.40)",
                    background: "rgba(232,132,10,0.10)",
                    color: "var(--saffron-light)",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Complete guide
                </Link>

                <ul
                  style={{
                    marginTop: 16,
                    padding: 0,
                    listStyle: "none",
                    display: "grid",
                    gap: 7,
                  }}
                >
                  {c.subcategories.map((s) => {
                    const subTotal = subcategoryCounts[c.id]?.[s.id] ?? 0;
                    return (
                      <li key={s.id} style={{ fontSize: 13, lineHeight: 1.4 }}>
                        <Link
                          href={`/${c.slug}/${s.slug}`}
                          style={{
                            color: "var(--on-dark-2)",
                            textDecoration: "none",
                          }}
                          className="hover:text-white"
                        >
                          {s.label}
                          {subTotal > 0 ? (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 10.5,
                                color: "var(--on-dark-4)",
                              }}
                            >
                              ({subTotal})
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "2.75rem",
            paddingTop: "1.75rem",
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--saffron-light)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Editorial trust
          </p>
          <ul
            style={{
              marginTop: 14,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px 22px",
            }}
          >
            {EDITORIAL_LINKS.map((e) => (
              <li key={e.href} style={{ fontSize: 13 }}>
                <Link
                  href={e.href}
                  style={{ color: "var(--on-dark-2)", textDecoration: "none" }}
                  className="hover:text-white"
                >
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
