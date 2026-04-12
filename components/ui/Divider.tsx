import type { CSSProperties } from "react";
import { getTheme } from "@/lib/category-themes";

interface DividerProps {
  gem?: "saffron" | "teal" | "rose" | "accent";
  category?: string;
}

const fixedStyles: Record<"saffron" | "teal" | "rose", { bg: string; border: string }> = {
  saffron: { bg: "var(--saffron)", border: "var(--saffron-light)" },
  teal: { bg: "var(--teal)", border: "var(--teal-light)" },
  rose: { bg: "var(--rose)", border: "var(--rose-light)" },
};

export function Divider({ gem = "saffron", category }: DividerProps) {
  let bg: string;
  let border: string;
  if (gem === "accent") {
    const theme = getTheme(category);
    bg = theme.accentColor;
    border = theme.accentMid;
  } else {
    bg = fixedStyles[gem].bg;
    border = fixedStyles[gem].border;
  }
  const gemStyle: CSSProperties = {
    display: "block",
    height: 10,
    width: 10,
    transform: "rotate(45deg)",
    flexShrink: 0,
    background: bg,
    border: `1.5px solid ${border}`,
  };
  return (
    <div
      aria-hidden
      style={{
        margin: "4rem 0",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span
        style={{
          height: 1,
          flex: 1,
          background:
            "linear-gradient(90deg, transparent 0%, var(--border-mid) 30%, var(--border-mid) 70%, transparent 100%)",
        }}
      />
      <span style={gemStyle} />
      <span
        style={{
          height: 1,
          flex: 1,
          background:
            "linear-gradient(90deg, transparent 0%, var(--border-mid) 30%, var(--border-mid) 70%, transparent 100%)",
        }}
      />
    </div>
  );
}
