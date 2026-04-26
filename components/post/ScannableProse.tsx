"use client";

import { motion } from "framer-motion";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Subsection {
  h3: string;
  html: string;
}

interface Props {
  eyebrow?: string;
  heading: string;
  lead_html: string;
  subsections: Subsection[];
}

export function ScannableProse({ eyebrow, heading, lead_html, subsections }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{ marginTop: "4rem", marginBottom: "1.75rem" }}
    >
      {eyebrow ? (
        <div
          style={{
            marginBottom: 12,
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
      <h2
        style={{
          marginBottom: 22,
          fontFamily: "var(--font-display)",
          fontSize: 32,
          fontWeight: 600,
          lineHeight: 1.2,
          color: "var(--on-light-1)",
          letterSpacing: "-0.012em",
        }}
      >
        {heading}
      </h2>
      <div
        className="prose-block scannable-lead"
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--on-light-2)",
          marginBottom: 28,
        }}
        dangerouslySetInnerHTML={{ __html: lead_html }}
      />
      {subsections.map((sub, i) => (
        <div key={i} style={{ marginTop: 28 }}>
          <h3
            style={{
              marginBottom: 14,
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.3,
              color: "var(--on-light-1)",
              letterSpacing: "-0.005em",
            }}
          >
            {sub.h3}
          </h3>
          <div
            className="prose-block"
            style={{
              fontSize: 16.5,
              lineHeight: 1.75,
              color: "var(--on-light-2)",
            }}
            dangerouslySetInnerHTML={{ __html: sub.html }}
          />
        </div>
      ))}
    </motion.section>
  );
}
