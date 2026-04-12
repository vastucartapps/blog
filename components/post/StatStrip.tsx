"use client";

import { motion } from "framer-motion";
import type { StatCell } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";

interface Props {
  cells: StatCell[];
  /** Category to pull accent label colour from. Falls back to teal. */
  category?: string;
}

export function StatStrip({ cells, category }: Props) {
  const theme = getTheme(category);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={staggerContainer}
      style={{
        marginTop: "2.5rem",
        marginBottom: "2.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        overflow: "hidden",
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "#ffffff",
        boxShadow: "0 18px 50px -28px rgba(1,63,71,0.25)",
      }}
    >
      {cells.map((c, i) => {
        const good = c.tone === "good";
        const isLast = i === cells.length - 1;
        return (
          <motion.div
            key={`${c.label}-${i}`}
            variants={fadeInUp}
            style={{
              padding: "1.75rem 1.25rem",
              textAlign: "center",
              borderRight: isLast ? "none" : "1px solid var(--border)",
              background: "#ffffff",
              position: "relative",
            }}
            className="stat-cell"
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: theme.statLabelColor,
                marginBottom: 12,
              }}
            >
              {c.label}
            </div>
            {c.icon ? (
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin: "0 auto 14px",
                  borderRadius: 14,
                  background: good
                    ? "linear-gradient(135deg, #f0faf2 0%, #d6f0dc 100%)"
                    : "linear-gradient(135deg, var(--teal-pale) 0%, #c8e7ec 100%)",
                  border: good
                    ? "1px solid #b8dfc0"
                    : "1px solid var(--border-mid)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: good ? "#3a9e55" : "var(--teal)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 14px -8px rgba(1,63,71,0.20)",
                }}
              >
                <Icon name={c.icon as IconName} size={26} />
              </div>
            ) : null}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 600,
                lineHeight: 1,
                marginBottom: 6,
                color: good ? "#1a6b2a" : "var(--on-light-1)",
              }}
            >
              {c.value}
            </div>
            {c.sub ? (
              <div style={{ fontSize: 11.5, color: "var(--on-light-4)" }}>
                {c.sub}
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
