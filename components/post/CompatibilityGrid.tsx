"use client";

import { motion } from "framer-motion";
import type { CompatibilityScore } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  number: number;
  compatibilities: CompatibilityScore[];
  category?: string;
}

const scoreStyle: Record<
  CompatibilityScore["score"],
  { bg: string; border: string; color: string }
> = {
  high: {
    bg: "linear-gradient(180deg, #f4fbf6 0%, #e2f2e8 100%)",
    border: "#b8dfc0",
    color: "#1a5e28",
  },
  neutral: {
    bg: "linear-gradient(180deg, #fff8e6 0%, #fce8b8 100%)",
    border: "#f0d68a",
    color: "#7a5600",
  },
  low: {
    bg: "linear-gradient(180deg, #fdf3f4 0%, #f9dde0 100%)",
    border: "#f0b8bc",
    color: "#8b1a1a",
  },
};

export function CompatibilityGrid({
  eyebrow,
  heading,
  number,
  compatibilities,
  category = "numerology",
}: Props) {
  const theme = getTheme(category);
  // Map by partner number for stable 1..9 ordering
  const map = new Map<number, CompatibilityScore>();
  compatibilities.forEach((c) => map.set(c.with, c));

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
    >
      <SectionHeader eyebrow={eyebrow} heading={heading} accentColor={theme.accentDeep} />

      <div
        style={{
          padding: "2rem",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "#ffffff",
          boxShadow: "0 18px 50px -28px rgba(1,63,71,0.25)",
        }}
      >
        <div
          style={{
            marginBottom: 22,
            fontSize: 13,
            color: "var(--on-light-2)",
          }}
        >
          Compatibility scores for life path number{" "}
          <strong style={{ color: theme.accentDeep, fontWeight: 700 }}>
            {number}
          </strong>{" "}
          paired with every other number, 1 through 9.
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
            gap: 14,
          }}
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
            const c =
              map.get(n) ?? { with: n, score: "neutral" as const, label: "Neutral" };
            const s = scoreStyle[c.score];
            const isSelf = n === number;
            return (
              <div
                key={n}
                style={{
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: isSelf ? "var(--cream-2)" : s.bg,
                  border: `1px solid ${isSelf ? "var(--border-mid)" : s.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: isSelf ? "var(--dark)" : "#ffffff",
                    border: `2px solid ${isSelf ? theme.accentColor : s.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: isSelf ? "#ffffff" : s.color,
                    flexShrink: 0,
                  }}
                >
                  {n}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: isSelf ? "var(--on-light-3)" : s.color,
                      marginBottom: 2,
                    }}
                  >
                    {isSelf ? "Self" : c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--on-light-3)",
                      lineHeight: 1.4,
                    }}
                  >
                    {isSelf ? "Pure resonance" : (c.note ?? "Balanced match")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
