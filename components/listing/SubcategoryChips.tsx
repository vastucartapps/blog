import Link from "next/link";
import type { SubCategory } from "@/lib/types";

interface Props {
  categorySlug: string;
  subs: SubCategory[];
  active?: string;
}

export function SubcategoryChips({ categorySlug, subs, active }: Props) {
  return (
    <nav aria-label="Subcategories" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {subs.map((s) => {
        const isActive = s.slug === active;
        return (
          <Link
            key={s.id}
            href={`/${categorySlug}/${s.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 6px 9px 16px",
              borderRadius: 999,
              border: `1px solid ${isActive ? "var(--dark)" : "var(--border-mid)"}`,
              background: isActive ? "var(--dark)" : "#ffffff",
              color: isActive ? "#ffffff" : "var(--on-light-1)",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              transition: "border-color .2s, color .2s, background .2s",
              boxShadow: isActive ? "0 8px 20px -14px rgba(1,63,71,0.40)" : "none",
            }}
            className="sub-chip"
          >
            {s.label}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 24,
                height: 22,
                padding: "0 7px",
                borderRadius: 999,
                background: isActive ? "rgba(255,255,255,0.18)" : "var(--cream-2)",
                color: isActive ? "#ffffff" : "var(--on-light-3)",
                fontSize: 10.5,
                fontWeight: 700,
                marginLeft: 2,
              }}
            >
              {s.target_post_count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
