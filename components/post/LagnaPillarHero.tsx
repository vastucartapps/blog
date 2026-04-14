import Link from "next/link";
import { Breadcrumb, type Crumb } from "@/components/layout/Breadcrumb";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getTheme } from "@/lib/category-themes";
import { LAGNA_LABELS, type LagnaSlug } from "@/lib/internal-links";

// ─────────────────────────────────────────────────────────────────
// LagnaPillarHero — used ONLY for `template: "lagna-profile"` posts.
//
// A lagna pillar is the topical hub for ~108+ planet-in-house cluster
// posts plus rashi, nakshatra, dasha, yoga, and remedy clusters under
// the same lagna. It must visually signal "this is the index for an
// entire lagna's content network", not "this is another article".
//
// Layout:
//   ┌────────────────────────────────────────────────────────┐
//   │  Breadcrumb                                             │
//   │  Pillar badge                                           │
//   │  ╔══════════════╗  ╔════════════════════════════════╗  │
//   │  ║  Mesh        ║  ║  Cluster grid (9 categories)   ║  │
//   │  ║  Aries       ║  ║  ┌──────┐ ┌──────┐ ┌──────┐    ║  │
//   │  ║  Lord:Mangal ║  ║  │ Graha│ │Naksh.│ │ Dasha│    ║  │
//   │  ║              ║  ║  └──────┘ └──────┘ └──────┘    ║  │
//   │  ║  4-cell stat ║  ║  (... 6 more)                  ║  │
//   │  ╚══════════════╝  ╚════════════════════════════════╝  │
//   └────────────────────────────────────────────────────────┘
//
// Cluster posts (planet-in-house, etc.) keep using the regular
// PostHero. Only this template gets the pillar treatment.
// ─────────────────────────────────────────────────────────────────

interface ClusterCard {
  label: string;
  slug: string;
  icon: IconName;
  description: string;
}

// The 9 jyotish clusters that live under any lagna pillar.
// Slugs match `lib/categories.ts` jyotish subcategories.
const LAGNA_CLUSTERS: ClusterCard[] = [
  {
    label: "Graha in Bhava",
    slug: "graha-in-bhava",
    icon: "sun",
    description: "Every planet placed in every house, interpreted for this lagna.",
  },
  {
    label: "Graha States",
    slug: "graha-states",
    icon: "star",
    description: "Uchha, neecha, digbali, asta, vakri and baaladi avasthas.",
  },
  {
    label: "Conjunctions & Yogas",
    slug: "conjunctions",
    icon: "diamond-gem",
    description: "Two and three planet conjunctions producing rajyoga and dhana yoga.",
  },
  {
    label: "Nakshatras",
    slug: "nakshatra",
    icon: "moon",
    description: "All 27 nakshatras with padas, deities and qualities.",
  },
  {
    label: "Vimshottari Dasha",
    slug: "dasha",
    icon: "clock",
    description: "Mahadasha and antardasha periods, timing of life events.",
  },
  {
    label: "Yogas",
    slug: "yogas",
    icon: "triangle-house",
    description: "Raja yogas, dhana yogas, viparita raja yogas and nabhasa yogas.",
  },
  {
    label: "Remedies",
    slug: "remedies",
    icon: "check-circle",
    description: "Classical remedial measures, mantra, charity and daana.",
  },
  {
    label: "Rashi Profile",
    slug: "rashi-profiles",
    icon: "mars",
    description: "The matching rashi profile and personality template.",
  },
];

interface Props {
  breadcrumb: Crumb[];
  lagnaId: string; // e.g. "mesha"
  badgeLabel: string;
  /** Plain text version of the post title for screen readers + h1 */
  title: string;
  /** Sanskrit + English split, e.g. "Mesh Lagna" / "Aries Ascendant" */
  sanskritName: string;
  englishName: string;
  description: string;
  /** Stat strip cells: Lord, Element, Quality, Direction etc */
  stats: { label: string; value: string; sub?: string }[];
  /** Live count of published posts keyed by jyotish subcategory slug. */
  clusterCounts?: Record<string, number>;
}

export function LagnaPillarHero({
  breadcrumb,
  lagnaId,
  badgeLabel,
  title,
  sanskritName,
  englishName,
  description,
  stats,
  clusterCounts,
}: Props) {
  const theme = getTheme("jyotish");
  // Resolve lagna canonical labels for cross-checking
  const lagnaSlug = (Object.keys(LAGNA_LABELS) as LagnaSlug[]).find(
    (k) => k === lagnaId || k === lagnaId.replace(/a$/, "")
  );
  void lagnaSlug;

  return (
    <section
      className="diamond-bg relative overflow-hidden"
      style={{ backgroundColor: theme.heroBg, paddingBottom: "3.5rem" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -120,
          right: -100,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 65%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: -150,
          left: -120,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.glowColorAlt} 0%, transparent 65%)`,
        }}
      />

      <div className="wrap-page" style={{ position: "relative", zIndex: 1, paddingTop: "2rem" }}>
        <Breadcrumb items={breadcrumb} tone="dark" />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(232,132,10,0.18)",
            border: "1px solid rgba(232,132,10,0.45)",
            color: theme.tagColor,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginTop: 24,
            marginBottom: 18,
          }}
        >
          <Icon name="diamond-gem" size={14} />
          {badgeLabel}
        </div>

        <h1
          className="text-on-dark"
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontWeight: 600,
          }}
        >
          <span style={{ display: "block", color: theme.tagColor, fontStyle: "italic" }}>
            {sanskritName}
          </span>
          <span style={{ display: "block", marginTop: 4 }}>{englishName}</span>
        </h1>
        <span className="sr-only">{title}</span>

        <p
          className="text-on-dark-body"
          style={{
            maxWidth: 720,
            marginTop: 18,
            fontSize: 17,
            lineHeight: 1.65,
            opacity: 0.92,
          }}
        >
          {description}
        </p>

        {/* Stat ribbon */}
        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 16,
            padding: "1.25rem 1rem",
            borderRadius: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(8px)",
            maxWidth: "100%",
          }}
        >
          {stats.map((cell, i) => (
            <div key={`${cell.label}-${i}`} style={{ textAlign: "center" }}>
              <div
                className="text-on-dark-faint"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {cell.label}
              </div>
              <div
                className="text-on-dark"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 600,
                  color: theme.tagColor,
                  lineHeight: 1.1,
                }}
              >
                {cell.value}
              </div>
              {cell.sub ? (
                <div
                  className="text-on-dark-muted"
                  style={{ marginTop: 4, fontSize: 11, opacity: 0.85 }}
                >
                  {cell.sub}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Cluster grid — the index of all content under this lagna */}
        <div style={{ marginTop: 40 }}>
          <div
            className="text-on-dark-faint"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            Explore the {sanskritName} cluster
            <span
              style={{
                height: 1,
                flex: 1,
                background: "rgba(255,255,255,0.18)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            {LAGNA_CLUSTERS.map((c) => (
              <Link
                key={c.slug}
                href={`/jyotish/${c.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "1.1rem 1.25rem 1.25rem",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  textDecoration: "none",
                  transition: "background .2s ease, border-color .2s ease, transform .2s ease",
                }}
                className="lagna-cluster-card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(232,132,10,0.18)",
                      border: "1px solid rgba(232,132,10,0.40)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.tagColor,
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={c.icon} size={18} />
                  </span>
                  <div
                    className="text-on-dark"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: 1.25,
                    }}
                  >
                    {c.label}
                  </div>
                </div>
                <p
                  className="text-on-dark-body"
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.55,
                    opacity: 0.85,
                  }}
                >
                  {c.description}
                </p>
                <div
                  style={{
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span
                    className="text-on-dark-faint"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      opacity: 0.75,
                    }}
                  >
                    {clusterCounts?.[c.slug] ?? 0} posts
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: theme.tagColor,
                      fontWeight: 600,
                    }}
                  >
                    Browse →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
