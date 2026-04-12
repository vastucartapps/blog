"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQItem } from "@/lib/types";

interface Props {
  eyebrow?: string;
  heading?: string;
  items: FAQItem[];
}

export function FAQSection({ eyebrow, heading, items }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ marginTop: "4.5rem", marginBottom: "4.5rem" }}>
      {eyebrow ? (
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
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "var(--on-light-1)",
            letterSpacing: "-0.012em",
          }}
        >
          {heading}
        </h2>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={`${item.q}-${i}`}
              style={{
                overflow: "hidden",
                borderRadius: 16,
                border: isOpen ? "1px solid var(--teal-light)" : "1px solid var(--border)",
                background: "#ffffff",
                boxShadow: isOpen
                  ? "0 22px 56px -32px rgba(1,63,71,0.35)"
                  : "0 12px 30px -22px rgba(1,63,71,0.18)",
                transition: "border-color .2s ease, box-shadow .2s ease",
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "1.25rem 1.5rem",
                  textAlign: "left",
                  background: isOpen
                    ? "linear-gradient(180deg, var(--teal-pale) 0%, #d4ecf0 100%)"
                    : "linear-gradient(180deg, #ffffff 0%, var(--cream-2) 100%)",
                  borderBottom: isOpen ? "1px solid var(--teal-light)" : "none",
                  border: "none",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "background .2s ease, border-color .2s ease",
                }}
                aria-expanded={isOpen}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    lineHeight: 1.35,
                  }}
                >
                  {item.q}
                </span>
                <span
                  style={{
                    display: "flex",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isOpen
                      ? "linear-gradient(180deg, var(--saffron) 0%, #d4760a 100%)"
                      : "linear-gradient(180deg, var(--dark) 0%, var(--dark-2) 100%)",
                    color: "#ffffff",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    flexShrink: 0,
                    boxShadow: isOpen
                      ? "0 8px 18px -8px rgba(232,132,10,0.55)"
                      : "0 6px 14px -6px rgba(1,36,42,0.35)",
                    transition: "background .2s ease, box-shadow .2s ease",
                    lineHeight: 1,
                  }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="faq-a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        margin: 0,
                        padding: "1.25rem 1.5rem 1.4rem 1.5rem",
                        fontSize: 14.5,
                        lineHeight: 1.78,
                        color: "var(--on-light-2)",
                      }}
                    >
                      {item.a}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
