"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { YantraBlockData } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  yantra: YantraBlockData;
}

export function YantraSection({ eyebrow, heading, yantra }: Props) {
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
        style={{
          overflow: "hidden",
          borderRadius: 22,
          border: "1px solid var(--border)",
          background: "#ffffff",
          boxShadow: "0 22px 60px -32px rgba(1,63,71,0.30)",
          display: "grid",
        }}
        className="yantra-card"
      >
        <div
          className="diamond-bg relative"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem 1.5rem",
            color: "var(--gold-light)",
            minHeight: 240,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: -60,
              left: -40,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,132,10,0.18) 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(232,132,10,0.30)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <Icon name="yantra" size={160} />
          </div>
        </div>
        <div className="yantra-body" style={{ padding: "2rem 2rem", minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 600,
              color: "var(--on-light-1)",
              overflowWrap: "anywhere",
            }}
          >
            {yantra.name}
          </div>
          {yantra.sanskrit ? (
            <div className="verse" style={{ marginTop: 4, fontSize: 13, color: "var(--on-light-4)" }}>
              {yantra.sanskrit}
            </div>
          ) : null}
          <p
            style={{
              marginTop: 14,
              fontSize: 14,
              lineHeight: 1.75,
              color: "var(--on-light-2)",
            }}
          >
            {yantra.description}
          </p>
          <div
            className="yantra-kv"
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
              gap: 16,
              padding: "16px 18px",
              borderRadius: 14,
              background: "var(--cream-2)",
              border: "1px solid var(--border)",
            }}
          >
            <KV k="Best direction" v={yantra.direction} />
            <KV k="Install on" v={yantra.install_day} />
            <KV k="Material" v={yantra.material} />
          </div>
          {yantra.cta_label && yantra.cta_url ? (
            <div style={{ marginTop: 20 }}>
              <Button href={yantra.cta_url} size="md" variant="primary">
                {yantra.cta_label}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.10em",
          color: "var(--on-light-3)",
        }}
      >
        {k}
      </div>
      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: "var(--on-light-1)" }}>
        {v}
      </div>
    </div>
  );
}
