"use client";

import { motion } from "framer-motion";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  label?: string;
  html: string;
  /** True for the one block on the page that is the article's short answer. */
  anchor?: boolean;
}

// GEO/AEO TL;DR opener. Light card, accent rail, liftable first
// paragraph. Targeted by SpeakableSpecification (.tldr) so voice
// assistants and AI engines can quote it whole.
export function TldrBlock({ label = "The short answer", html, anchor }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      id={anchor ? "tldr" : undefined}
      className="tldr"
      style={{
        marginTop: "2.25rem",
        marginBottom: "1.75rem",
        padding: "1.25rem 1.5rem",
        // A full hairline, not a bar down one side. A tinted edge is decoration standing in for
        // hierarchy the layout has not established, and it reads as generated.
        border: "1px solid var(--saffron)",
        borderRadius: 10,
        background: "var(--saffron-pale)",
      }}
    >
      <div
        style={{
          marginBottom: 8,
          fontSize: 10.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--saffron)",
        }}
      >
        {label}
      </div>
      <div
        className="prose-block"
        style={{ fontSize: 16.5, lineHeight: 1.8, color: "var(--on-light-1)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.section>
  );
}
