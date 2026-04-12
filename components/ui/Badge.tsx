import type { CSSProperties, ReactNode } from "react";

type Tone = "saffron" | "teal" | "rose" | "gold" | "dark" | "green" | "hero";

const toneStyle: Record<Tone, CSSProperties> = {
  saffron: {
    background: "var(--saffron-mid)",
    color: "#7a3d00",
    border: "1px solid rgba(232,132,10,0.30)",
  },
  teal: {
    background: "var(--teal-pale)",
    color: "var(--on-light-1)",
    border: "1px solid var(--border-mid)",
  },
  rose: {
    background: "var(--rose-pale)",
    color: "#7a2e38",
    border: "1px solid var(--rose-mid)",
  },
  gold: {
    background: "var(--gold-pale)",
    color: "#6a5a1a",
    border: "1px solid rgba(201,168,76,0.35)",
  },
  dark: {
    background: "var(--dark)",
    color: "#ffffff",
    border: "1px solid var(--dark-2)",
  },
  green: {
    background: "#f0faf2",
    color: "#1a5e28",
    border: "1px solid #b8dfc0",
  },
  hero: {
    background: "rgba(232,132,10,0.15)",
    color: "var(--saffron-light)",
    border: "1px solid rgba(232,132,10,0.30)",
  },
};

interface Props {
  tone?: Tone;
  children: ReactNode;
}

export function Badge({ tone = "saffron", children }: Props) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 4,
        padding: "3px 10px",
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        ...toneStyle[tone],
      }}
    >
      {children}
    </span>
  );
}
