"use client";

import { motion } from "framer-motion";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Term {
  term: string;
  meaning: string;
}

interface Props {
  eyebrow?: string;
  heading?: string;
  intro_html?: string;
  terms: Term[];
}

export function AstroGlossary({
  eyebrow = "Quick reference",
  heading = "Terms used in this article",
  intro_html,
  terms,
}: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{
        margin: "2.5rem 0",
        padding: "1.75rem 1.75rem 1.5rem",
        borderRadius: 16,
        background:
          "linear-gradient(135deg, var(--cream-2) 0%, var(--cream-3) 100%)",
        border: "1px solid var(--border)",
        boxShadow: "0 12px 40px -28px rgba(1,63,71,0.20)",
      }}
    >
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
          color: "var(--saffron)",
        }}
      >
        {eyebrow}
        <span
          style={{
            height: 1.5,
            width: 36,
            background: "var(--saffron)",
            opacity: 0.4,
          }}
        />
      </div>
      <h3
        style={{
          margin: "0 0 12px",
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 600,
          color: "var(--on-light-1)",
          letterSpacing: "-0.005em",
        }}
      >
        {heading}
      </h3>
      {intro_html ? (
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--on-light-2)",
            marginBottom: 14,
          }}
          dangerouslySetInnerHTML={{ __html: intro_html }}
        />
      ) : null}
      <dl
        style={{
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "12px 24px",
        }}
      >
        {terms.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <dt
              style={{
                flex: "0 0 auto",
                minWidth: 60,
                fontWeight: 700,
                color: "var(--saffron-dark)",
                fontSize: 14.5,
                fontFamily: "var(--font-display)",
                paddingTop: 1,
              }}
            >
              {t.term}
            </dt>
            <dd
              style={{
                margin: 0,
                fontSize: 14.5,
                lineHeight: 1.55,
                color: "var(--on-light-2)",
              }}
            >
              {t.meaning}
            </dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
}
