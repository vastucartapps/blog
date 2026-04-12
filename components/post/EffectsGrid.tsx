"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  positive: string[];
  negative: string[];
  career: string[];
  positive_label?: string;
  negative_label?: string;
  career_label?: string;
}

export function EffectsGrid({
  eyebrow,
  heading,
  positive,
  negative,
  career,
  positive_label = "Strengths",
  negative_label = "Challenges",
  career_label = "Career best fits",
}: Props) {
  const cols = [
    {
      label: positive_label,
      items: positive,
      bg: "linear-gradient(180deg, #f4fbf6 0%, #ecf7ef 100%)",
      border: "#b8dfc0",
      head: "#1a5e28",
      dot: "#3a9e55",
      bullet: "#3a9e55",
    },
    {
      label: negative_label,
      items: negative,
      bg: "linear-gradient(180deg, #fdf3f4 0%, #f9e8ea 100%)",
      border: "#f0b8bc",
      head: "#8b1a1a",
      dot: "#c94444",
      bullet: "#c94444",
    },
    {
      label: career_label,
      items: career,
      bg: "linear-gradient(180deg, var(--saffron-pale) 0%, #fde9c4 100%)",
      border: "rgba(232,132,10,0.30)",
      head: "#8b4a00",
      dot: "var(--saffron)",
      bullet: "var(--saffron)",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={staggerContainer}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
    >
      {eyebrow ? (
        <motion.div
          variants={fadeInUp}
          style={{
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--teal)",
          }}
        >
          {eyebrow}
          <span style={{ height: 1.5, width: 32, background: "var(--teal)", opacity: 0.4 }} />
        </motion.div>
      ) : null}
      {heading ? (
        <motion.h2
          variants={fadeInUp}
          style={{
            marginBottom: 22,
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "var(--on-light-1)",
            letterSpacing: "-0.01em",
          }}
        >
          {heading}
        </motion.h2>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {cols.map((c) => (
          <motion.div
            key={c.label}
            variants={fadeInUp}
            style={{
              borderRadius: 16,
              padding: "1.5rem 1.4rem",
              background: c.bg,
              border: `1px solid ${c.border}`,
              boxShadow: "0 16px 36px -28px rgba(1,63,71,0.20)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.7)",
                color: c.head,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
                border: `1px solid ${c.border}`,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: c.dot,
                  flexShrink: 0,
                }}
              />
              {c.label}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {c.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    position: "relative",
                    paddingLeft: 22,
                    paddingTop: 6,
                    paddingBottom: 6,
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--on-light-1)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 12,
                      width: 12,
                      height: 2,
                      borderRadius: 1,
                      background: c.bullet,
                      opacity: 0.7,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
