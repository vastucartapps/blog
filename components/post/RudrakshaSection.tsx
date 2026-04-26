"use client";

import { motion } from "framer-motion";
import type { RudrakshaBead } from "@/lib/types";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";
import { RudrakshaSvg } from "@/components/ui/RudrakshaSvg";

interface Props {
  eyebrow?: string;
  heading?: string;
  introHtml?: string;
  beads: RudrakshaBead[];
}

export function RudrakshaSection({ eyebrow, heading, introHtml, beads }: Props) {
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
        </motion.div>
      ) : null}
      {heading ? (
        <motion.h2
          variants={fadeInUp}
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
        </motion.h2>
      ) : null}
      {introHtml ? (
        <motion.div
          variants={fadeInUp}
          className="prose-block"
          style={{ marginBottom: 22 }}
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        }}
      >
        {beads.map((b) => (
          <motion.div
            key={b.mukhi}
            variants={fadeInUp}
            className="rudra-card"
            style={{
              display: "flex",
              gap: 18,
              padding: "1.4rem 1.5rem",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "#ffffff",
              boxShadow: "0 14px 36px -24px rgba(1,63,71,0.20)",
              transition: "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RudrakshaSvg mukhi={b.mukhi} size={84} aria-hidden />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--on-light-1)",
                  lineHeight: 1.25,
                }}
              >
                {b.name}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: 12,
                  color: "var(--on-light-4)",
                }}
              >
                {b.sub}
              </div>
              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "var(--on-light-2)",
                }}
              >
                {b.benefit}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
