"use client";

import { motion } from "framer-motion";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  html: string;
}

export function ProseBlock({ eyebrow, heading, html }: Props) {
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
      {heading ? (
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
      ) : null}
      <div
        className="prose-block"
        style={{
          fontSize: 16.5,
          lineHeight: 1.85,
          color: "var(--on-light-2)",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.section>
  );
}
