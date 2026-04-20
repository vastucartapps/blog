"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      style={{
        display: "flex",
        gap: 10,
        maxWidth: 620,
        background: "rgba(255,255,255,0.08)",
        padding: 6,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <input
        name="q"
        type="search"
        autoFocus
        placeholder="Search by planet, house, lagna, festival..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          padding: "12px 14px",
          color: "#ffffff",
          fontSize: 15,
        }}
      />
      <button
        type="submit"
        style={{
          background: "var(--saffron)",
          color: "#ffffff",
          border: "none",
          borderRadius: 8,
          padding: "10px 22px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </form>
  );
}
