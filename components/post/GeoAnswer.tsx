"use client";

import { motion } from "framer-motion";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  question: string;
  answer_html: string;
  elaboration_html?: string;
}

// GEO passage block. A question-style H2 a worried reader would type,
// then a 40-75 word self-contained answer (.geo-answer) an AI engine
// can lift verbatim, then optional elaboration. Answer leads, context
// follows.
export function GeoAnswer({ question, answer_html, elaboration_html }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{ marginTop: "3.25rem", marginBottom: "1.5rem" }}
    >
      <h2
        style={{
          marginBottom: 14,
          fontFamily: "var(--font-display)",
          fontSize: 27,
          fontWeight: 600,
          lineHeight: 1.25,
          color: "var(--on-light-1)",
          letterSpacing: "-0.01em",
        }}
      >
        {question}
      </h2>
      <p
        className="geo-answer"
        style={{
          fontSize: 16.5,
          lineHeight: 1.78,
          fontWeight: 500,
          color: "var(--on-light-1)",
        }}
        dangerouslySetInnerHTML={{ __html: answer_html }}
      />
      {elaboration_html ? (
        <div
          className="prose-block"
          style={{
            marginTop: "1rem",
            fontSize: 16.5,
            lineHeight: 1.85,
            color: "var(--on-light-2)",
          }}
          dangerouslySetInnerHTML={{ __html: elaboration_html }}
        />
      ) : null}
    </motion.section>
  );
}
