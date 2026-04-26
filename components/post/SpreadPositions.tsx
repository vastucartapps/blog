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
        className="row-table"
        style={{
          overflow: "hidden",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "#ffffff",
          boxShadow: "0 22px 60px -32px rgba(1,63,71,0.30)",
        }}
      >
        <div className="row-table-head">
          <div>Position</div>
          <div>What this card means here</div>
          <div>Context</div>
        </div>
        {positions.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="row-table-row"
            style={{ fontSize: 13.5 }}
          >
            <div>
              <div className="row-label">Position</div>
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
            </div>
            <div>
              <div className="row-label">What this card means here</div>
              <div style={{ color: "var(--on-light-2)", lineHeight: 1.6 }}>
                {p.meaning}
              </div>
            </div>
            <div>
              <div className="row-label">Context</div>
              <div style={{ color: "var(--on-light-3)", lineHeight: 1.6, fontSize: 12.5 }}>
                {p.context}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
