import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import type {
  PillarStripLink,
  CrossCategoryBridge,
} from "@/lib/internal-links";

interface Props {
  pillars: PillarStripLink[];
  bridges: CrossCategoryBridge[];
}

const pillarIcon: Record<PillarStripLink["kind"], IconName> = {
  category: "kundali",
  subcategory: "book",
  pillar: "star",
  author: "user",
};

const bridgeAccent: Record<string, string> = {
  jyotish: "var(--saffron)",
  numerology: "var(--teal)",
  gemstones: "var(--gold)",
  rudraksha: "var(--gold)",
  tarot: "var(--rose)",
  vastu: "var(--gold)",
  puja: "var(--saffron)",
  festivals: "var(--rose)",
};

/**
 * The site's automatic enterprise nav-strip. Rendered above the
 * related-posts block on every post by BlockRenderer. Authors do
 * not declare it in post JSON — the render layer guarantees it.
 *
 * Visual: a gentle two-row strip. Top row is the four pillar links
 * (subcategory, category, complete-guide, author). Bottom row is
 * the cross-category bridges (when any resolve).
 */
export function NavStrip({ pillars, bridges }: Props) {
  if (pillars.length === 0 && bridges.length === 0) return null;
  return (
    <section
      style={{
        marginTop: "3.25rem",
        marginBottom: "3rem",
        borderRadius: 18,
        border: "1px solid var(--border)",
        background:
          "linear-gradient(135deg, var(--cream-1, #FBF6E8) 0%, var(--cream-2, #ECE0C5) 100%)",
        padding: "1.4rem 1.6rem 1.6rem",
        boxShadow: "0 16px 40px -28px rgba(1,63,71,0.20)",
      }}
      aria-label="Pillar and cross-category navigation"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--teal)",
        }}
      >
        Continue exploring
        <span style={{ height: 1.5, width: 36, background: "var(--teal)", opacity: 0.4 }} />
      </div>

      {pillars.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {pillars.map((p) => (
            <Link
              key={`pillar-${p.kind}`}
              href={p.href}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "0.75rem 0.95rem",
                borderRadius: 12,
                background: "#ffffff",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color .18s ease, transform .18s ease",
              }}
              className="post-card"
            >
              <span
                aria-hidden
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--cream-2, #ECE0C5)",
                  color: "var(--saffron, #E97A2B)",
                  flexShrink: 0,
                }}
              >
                <Icon name={pillarIcon[p.kind]} size={16} />
              </span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    lineHeight: 1.3,
                  }}
                >
                  {p.label}
                </span>
                {p.sub ? (
                  <span
                    style={{
                      marginTop: 2,
                      fontSize: 11.5,
                      color: "var(--on-light-3)",
                      lineHeight: 1.4,
                    }}
                  >
                    {p.sub}
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      {bridges.length > 0 ? (
        <>
          <div
            style={{
              marginTop: 18,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--saffron, #E97A2B)",
            }}
          >
            Cross-tradition bridges
            <span
              style={{
                height: 1.5,
                width: 36,
                background: "var(--saffron, #E97A2B)",
                opacity: 0.4,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {bridges.map((b, i) => (
              <Link
                key={`bridge-${i}-${b.href}`}
                href={b.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0.45rem 0.9rem",
                  borderRadius: 999,
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  color: "var(--on-light-1)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  transition: "border-color .18s ease",
                }}
                className="post-card"
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: bridgeAccent[b.to_category] ?? "var(--teal)",
                  }}
                />
                <span style={{ fontWeight: 600 }}>{b.label}</span>
                <span style={{ color: "var(--on-light-3)", fontSize: 11.5 }}>
                  · {b.sub}
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
