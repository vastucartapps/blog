"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  planet: string;
  house: number;
  lagna: string;
  legend: { color: "saffron" | "white" | "teal"; text: string }[];
  ctaLabel?: string;
  ctaUrl?: string;
}

// North Indian kundali — fixed-size 320x320 SVG.
// Lagna (1st house) is the top centre diamond. Houses run anti-clockwise.
// House centres are calculated from the standard north-indian layout where
// the 12 houses are: 4 corner triangles, 4 edge triangles meeting in the
// centre, and the centre square split into 4 by an inner diamond.

interface Cell {
  num: number;
  label: { x: number; y: number };
  content: { x: number; y: number };
}

// ─────────────────────────────────────────────────────────────────
// North Indian kundali geometry (320×320 viewBox)
//
// Outer square: (10,10)–(310,310). Two diagonals + inner diamond
// connecting the four side-midpoints (160,10)(310,160)(160,310)(10,160).
//
// The 12 houses are NOT the 4 big quadrants. They are:
//   - 4 KENDRA houses (1, 4, 7, 10) — the small rhombuses of the inner
//     diamond, each split by where the outer diagonals cross it
//   - 8 CORNER houses (2, 3, 5, 6, 8, 9, 11, 12) — the small corner
//     triangles outside the inner diamond, two per outer corner
//
// Diagonal-inner-diamond intersection points (computed by solving
// y=x and x+y=320 against the inner diamond edges):
//   NE quadrant: (235, 85)
//   SE quadrant: (235, 235)
//   SW quadrant: (85, 235)
//   NW quadrant: (85, 85)
//
// Each highlight polygon below covers EXACTLY one house cell. The
// previous version covered the entire half-quadrant of the outer
// square — visually overlapping 3 houses. Fixed.
const HOUSE_POLYGONS: Record<number, string> = {
  // Kendra rhombuses (inner diamond quadrants)
  1:  "160,10 235,85 160,160 85,85",
  4:  "10,160 85,85 160,160 85,235",
  7:  "160,310 85,235 160,160 235,235",
  10: "310,160 235,235 160,160 235,85",
  // Top-right corner triangles (outside inner diamond)
  11: "310,10 310,160 235,85",
  12: "310,10 160,10 235,85",
  // Top-left corner triangles
  2:  "10,10 160,10 85,85",
  3:  "10,10 10,160 85,85",
  // Bottom-left corner triangles
  5:  "10,160 10,310 85,235",
  6:  "10,310 160,310 85,235",
  // Bottom-right corner triangles
  8:  "160,310 310,310 235,235",
  9:  "310,310 310,160 235,235",
};

// Coordinates tuned for a 320×320 viewBox.
const HOUSES: Cell[] = [
  // Top row centre = 1st (Lagna)
  { num: 1,  label: { x: 160, y: 56 },  content: { x: 160, y: 78 } },
  // Top-left corner = 2nd
  { num: 2,  label: { x: 76,  y: 30 },  content: { x: 64,  y: 50 } },
  // Left edge top = 3rd
  { num: 3,  label: { x: 40,  y: 70 },  content: { x: 56,  y: 92 } },
  // Left centre = 4th
  { num: 4,  label: { x: 76,  y: 160 }, content: { x: 90,  y: 160 } },
  // Left edge bottom = 5th
  { num: 5,  label: { x: 40,  y: 246 }, content: { x: 56,  y: 226 } },
  // Bottom-left corner = 6th
  { num: 6,  label: { x: 76,  y: 286 }, content: { x: 64,  y: 268 } },
  // Bottom centre = 7th
  { num: 7,  label: { x: 160, y: 256 }, content: { x: 160, y: 234 } },
  // Bottom-right corner = 8th
  { num: 8,  label: { x: 244, y: 286 }, content: { x: 256, y: 268 } },
  // Right edge bottom = 9th
  { num: 9,  label: { x: 280, y: 246 }, content: { x: 264, y: 226 } },
  // Right centre = 10th
  { num: 10, label: { x: 244, y: 160 }, content: { x: 230, y: 160 } },
  // Right edge top = 11th
  { num: 11, label: { x: 280, y: 70 },  content: { x: 264, y: 92 } },
  // Top-right corner = 12th
  { num: 12, label: { x: 244, y: 30 },  content: { x: 256, y: 50 } },
];

export function KundaliVisual({
  eyebrow,
  heading,
  planet,
  house,
  lagna,
  legend,
  ctaLabel,
  ctaUrl,
}: Props) {
  void lagna;
  return (
    <section style={{ marginTop: "4rem", marginBottom: "4rem" }}>
      {eyebrow ? (
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--teal)",
          }}
        >
          {eyebrow}
          <span style={{ height: 1.5, width: 36, background: "var(--teal)", opacity: 0.4 }} />
        </div>
      ) : null}
      {heading ? (
        <h2
          style={{
            marginBottom: 22,
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "var(--on-light-1)",
            letterSpacing: "-0.012em",
          }}
        >
          {heading}
        </h2>
      ) : null}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={inViewConfig}
        variants={fadeInUp}
        className="diamond-bg relative overflow-hidden kundali-visual-grid"
        style={{
          display: "grid",
          alignItems: "center",
          gap: 28,
          padding: "1.75rem",
          borderRadius: 22,
          boxShadow: "0 28px 72px -32px rgba(1,63,71,0.40)",
          maxWidth: "100%",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -100,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,132,10,0.14) 0%, transparent 65%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            aria-label={`North Indian kundali chart highlighting house ${house}`}
            style={{ maxWidth: "100%", height: "auto" }}
          >
            {/* Outer square */}
            <rect
              x="10"
              y="10"
              width="300"
              height="300"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(232,132,10,0.55)"
              strokeWidth="2"
              rx="4"
            />
            {/* Diagonals (corner to corner) */}
            <line x1="10" y1="10" x2="310" y2="310" stroke="rgba(255,255,255,0.30)" strokeWidth="1.4" />
            <line x1="310" y1="10" x2="10" y2="310" stroke="rgba(255,255,255,0.30)" strokeWidth="1.4" />
            {/* Inner diamond connecting midpoints of the outer square */}
            <line x1="160" y1="10" x2="310" y2="160" stroke="rgba(232,132,10,0.55)" strokeWidth="1.6" />
            <line x1="310" y1="160" x2="160" y2="310" stroke="rgba(232,132,10,0.55)" strokeWidth="1.6" />
            <line x1="160" y1="310" x2="10" y2="160" stroke="rgba(232,132,10,0.55)" strokeWidth="1.6" />
            <line x1="10" y1="160" x2="160" y2="10" stroke="rgba(232,132,10,0.55)" strokeWidth="1.6" />

            {/* Highlight ONLY the active house cell (not the whole quadrant) */}
            {HOUSE_POLYGONS[house] ? (
              <polygon
                points={HOUSE_POLYGONS[house]}
                fill="rgba(232,132,10,0.22)"
                stroke="rgba(232,132,10,0.55)"
                strokeWidth="1.4"
              />
            ) : null}

            {/* House numbers */}
            {HOUSES.map((c) => {
              const isActive = c.num === house;
              return (
                <g key={c.num}>
                  <text
                    x={c.label.x}
                    y={c.label.y}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? "rgba(245,166,35,0.90)" : "rgba(255,255,255,0.45)"}
                    letterSpacing="0.04em"
                  >
                    {c.num}
                  </text>
                  {isActive ? (
                    <g>
                      <circle
                        cx={c.content.x}
                        cy={c.content.y}
                        r="13"
                        fill="rgba(232,132,10,0.30)"
                      />
                      <circle
                        cx={c.content.x}
                        cy={c.content.y}
                        r="8"
                        fill="#f5a623"
                      />
                      <circle
                        cx={c.content.x}
                        cy={c.content.y}
                        r="3.2"
                        fill="#fff"
                        opacity="0.95"
                      />
                      <text
                        x={c.content.x}
                        y={c.content.y + 26}
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="Inter, sans-serif"
                        fontWeight="600"
                        fill="rgba(250,236,170,0.90)"
                        letterSpacing="0.04em"
                      >
                        {planet}
                      </text>
                    </g>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              color: "#ffffff",
              marginBottom: 18,
            }}
          >
            Reading this North Indian chart
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {legend.map((l, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "7px 0",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      l.color === "saffron"
                        ? "var(--saffron-light)"
                        : l.color === "teal"
                          ? "var(--teal-light)"
                          : "rgba(255,255,255,0.30)",
                  }}
                />
                {l.text}
              </li>
            ))}
          </ul>
          {ctaLabel && ctaUrl ? (
            <div style={{ marginTop: 22 }}>
              <Button href={ctaUrl} size="md" variant="primary">
                {ctaLabel}
              </Button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
