"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { StotraBlockData } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  stotra: StotraBlockData;
}

export function StotraSection({ eyebrow, heading, stotra }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
    >
      {eyebrow ? (
        <div
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
        </div>
      ) : null}
      {heading ? (
        <h2
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
        </h2>
      ) : null}

      <div
        className="diamond-bg relative overflow-hidden"
        style={{
          borderRadius: 22,
          padding: "2.5rem 2.5rem",
          boxShadow: "0 28px 70px -32px rgba(1,63,71,0.40)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -100,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,132,10,0.18) 0%, transparent 65%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "var(--saffron-light)",
              marginBottom: 8,
            }}
          >
            {stotra.eyebrow}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 600,
              color: "#ffffff",
              marginBottom: 6,
              lineHeight: 1.18,
            }}
          >
            {stotra.title}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 26 }}>
            {stotra.sub}
          </div>

          <div
            className="verse"
            style={{
              borderLeft: "3px solid var(--saffron)",
              paddingLeft: 22,
              marginBottom: 22,
              fontSize: 17,
              lineHeight: 2,
              color: "rgba(255,255,255,0.85)",
            }}
            dangerouslySetInnerHTML={{ __html: stotra.verse }}
          />
          <p
            style={{
              borderLeft: "2px solid rgba(255,255,255,0.15)",
              paddingLeft: 22,
              marginBottom: 26,
              fontSize: 13.5,
              lineHeight: 1.78,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              Translation:
            </strong>{" "}
            {stotra.translation}
          </p>

          <Link
            href={stotra.url}
            target="_blank"
            rel="noopener noreferrer"
            className="stotra-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 24px",
              borderRadius: 12,
              background: "linear-gradient(180deg, #c46a08 0%, #9f5306 100%)",
              border: "1px solid rgba(232,132,10,0.40)",
              color: "#fff5e0",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow:
                "0 16px 36px -14px rgba(196,106,8,0.55), inset 0 1px 0 rgba(255,255,255,0.20)",
              transition: "transform .15s ease, box-shadow .15s ease, background .2s ease",
            }}
          >
            <Icon name="external-link" size={14} />
            Read the full stotra on stotra.vastucart.in
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
