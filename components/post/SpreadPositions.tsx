"use client";

import { motion } from "framer-motion";
import type { SpreadPosition } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  positions: SpreadPosition[];
  category?: string;
}

export function SpreadPositions({
  eyebrow,
  heading,
  positions,
  category = "tarot",
}: Props) {
  const theme = getTheme(category);
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
          overflow: "hidden",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "#ffffff",
          boxShadow: "0 22px 60px -32px rgba(1,63,71,0.30)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 1fr",
            padding: "16px 22px",
            background: "var(--cream-2)",
            borderBottom: "1px solid var(--border)",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--on-light-3)",
            gap: 16,
          }}
        >
          <div>Position</div>
          <div>What this card means here</div>
          <div>Context</div>
        </div>
        {positions.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr 1fr",
              padding: "18px 22px",
              borderBottom:
                i === positions.length - 1 ? "none" : "1px solid var(--cream-3)",
              fontSize: 13.5,
              alignItems: "start",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--on-light-1)",
              }}
            >
              {p.name}
            </div>
            <div style={{ color: "var(--on-light-2)", lineHeight: 1.6 }}>
              {p.meaning}
            </div>
            <div style={{ color: "var(--on-light-3)", lineHeight: 1.6, fontSize: 12.5 }}>
              {p.context}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
