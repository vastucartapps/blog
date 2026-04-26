import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { Icon, type IconName } from "@/components/ui/Icon";

interface Props {
  postCounts: Record<string, number>;
}

const accentByColor: Record<string, { bg: string; border: string; ico: string }> = {
  saffron: {
    bg: "linear-gradient(135deg, rgba(232,132,10,0.10), rgba(232,132,10,0.02))",
    border: "rgba(232,132,10,0.30)",
    ico: "#e8840a",
  },
  teal: {
    bg: "linear-gradient(135deg, rgba(51,138,149,0.10), rgba(51,138,149,0.02))",
    border: "rgba(51,138,149,0.30)",
    ico: "#338a95",
  },
  rose: {
    bg: "linear-gradient(135deg, rgba(183,110,121,0.10), rgba(183,110,121,0.02))",
    border: "rgba(183,110,121,0.30)",
    ico: "#b76e79",
  },
  gold: {
    bg: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.02))",
    border: "rgba(201,168,76,0.30)",
    ico: "#c9a84c",
  },
};

export function CategoryGrid({ postCounts }: Props) {
  return (
    <section className="wrap-wide" style={{ paddingTop: "clamp(2.5rem, 6vw, 5.5rem)", paddingBottom: "clamp(2.5rem, 6vw, 5.5rem)" }}>
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--teal)",
          }}
        >
          Eight disciplines
        </p>
        <h2
          className="section-h"
          style={{
            marginTop: 12,
            fontFamily: "var(--font-display)",
            color: "var(--on-light-1)",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 600,
          }}
        >
          Every tradition, in depth.
        </h2>
        <p
          style={{
            margin: "14px auto 0",
            maxWidth: 540,
            fontSize: 14,
            lineHeight: 1.75,
            color: "var(--on-light-3)",
          }}
        >
          From Vedic astrology and tarot to vastu, gemstones and stotras. Every
          tradition explained by practising experts.
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
          const accent = accentByColor[c.color_var] ?? accentByColor.teal;
          return (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              className="cat-card"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 18,
                border: "1px solid var(--border)",
                background: "#ffffff",
                textDecoration: "none",
                boxShadow: "0 18px 50px -28px rgba(1,63,71,0.18)",
                transition:
                  "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
              }}
            >
              {/* Top accent strip with gradient + icon medallion */}
              <div
                style={{
                  position: "relative",
                  height: 110,
                  background: accent.bg,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: "var(--dark)",
                    color: "#ffffff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 999,
                    letterSpacing: "0.04em",
                  }}
                >
                  {postCounts[c.id] ?? 0}
                </span>
                <div
                  style={{
                    position: "absolute",
                    bottom: -28,
                    left: 22,
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: "#ffffff",
                    border: `1px solid ${accent.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accent.ico,
                    boxShadow: "0 12px 28px -14px rgba(1,63,71,0.30)",
                  }}
                >
                  <Icon name={c.icon_name as IconName} size={30} />
                </div>
              </div>

              <div style={{ padding: "44px 22px 22px 22px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 19,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    lineHeight: 1.25,
                  }}
                >
                  {c.label}
                </div>
                <div
                  className="verse"
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    color: "var(--on-light-4)",
                  }}
                >
                  {c.label_hindi}
                </div>
                <p
                  style={{
                    marginTop: 14,
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "var(--on-light-2)",
                  }}
                >
                  {c.description}
                </p>
                <div
                  style={{
                    marginTop: 18,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: accent.ico,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Explore
                  <Icon name="arrow-right" size={12} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
