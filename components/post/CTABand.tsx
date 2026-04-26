"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { CTABandData } from "@/lib/types";
import { scaleIn, inViewConfig } from "@/lib/motion";

interface Props {
  data: CTABandData;
}

export function CTABand({ data }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={scaleIn}
      className="diamond-bg relative overflow-hidden"
      style={{
        marginTop: "4rem",
        marginBottom: "4rem",
        borderRadius: 22,
        padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)",
        textAlign: "center",
        boxShadow: "0 28px 80px -32px rgba(1,63,71,0.45)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -120,
          right: -100,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,132,10,0.20) 0%, transparent 65%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: -120,
          left: -100,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(51,138,149,0.18) 0%, transparent 65%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.18,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {data.title}
        </h3>
        <p
          style={{
            margin: "16px auto 26px",
            maxWidth: 480,
            fontSize: 14.5,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          {data.subtitle}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {data.buttons.map((b, i) => {
            const variant =
              b.variant === "primary"
                ? "primary"
                : b.variant === "teal"
                  ? "teal"
                  : "outline-dark";
            return (
              <Button key={`${b.label}-${i}`} href={b.url} size="lg" variant={variant}>
                {b.label}
              </Button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
