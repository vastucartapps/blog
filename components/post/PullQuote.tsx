"use client";

import { motion } from "framer-motion";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import type { GemTone } from "@/lib/types";

const variantMap: Record<
  GemTone,
  { border: string; bg: string; color: string }
> = {
  saffron: {
    border: "var(--saffron)",
    bg: "var(--saffron-pale)",
    color: "#5a3a00",
  },
  teal: {
    border: "var(--teal)",
    bg: "var(--teal-pale)",
    color: "var(--dark-2)",
  },
  rose: {
    border: "var(--rose)",
    bg: "var(--rose-pale)",
    color: "#5a1a2a",
  },
};

interface Props {
  text: string;
  variant?: GemTone;
}

// Matches prototype: clean italic, saffron border-left, saffron-pale bg.
// Small '"' marker at top-left, NOT a giant decorative mark.
export function PullQuote({ text, variant = "saffron" }: Props) {
  const v = variantMap[variant];
  return (
    <motion.figure
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{
        margin: "2.5rem 0",
        padding: "1.4rem 1.75rem 1.4rem 2rem",
        borderLeft: `3px solid ${v.border}`,
        borderRadius: "0 12px 12px 0",
        background: v.bg,
      }}
    >
      <blockquote
        className="verse"
        style={{
          margin: 0,
          fontSize: 17.5,
          lineHeight: 1.72,
          color: v.color,
        }}
      >
        {text}
      </blockquote>
    </motion.figure>
  );
}
