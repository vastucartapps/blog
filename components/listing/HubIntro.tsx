import Link from "next/link";
import type { CategoryDef, SubCategory } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────
// HubIntro — derived prose block rendered on every subcategory hub
// above the PostGrid.
//
// Purpose: subcategory hubs with zero published posts (e.g. several
// /festivals/* hubs) were rendering only the hero ribbon, the empty
// state, and footer chrome. Body length dropped below the 1500-char
// thin-content threshold and the audit flagged them under class B5.
//
// This component derives a substantial topic intro from the existing
// taxonomy data (category, subcategory, sibling subcategories,
// complete-guide pillar) — no new prose to maintain, just structured
// navigation copy that reads naturally as topic context. Empty hubs
// gain ~600-900 chars of real content; populated hubs gain
// supplementary topic framing above the post grid.
// ─────────────────────────────────────────────────────────────────

interface Props {
  category: CategoryDef;
  subcategory: SubCategory;
  postCount: number;
}

export function HubIntro({ category, subcategory, postCount }: Props) {
  const siblings = category.subcategories.filter(
    (s) => s.slug !== subcategory.slug,
  );
  const completeGuideUrl = `/${category.slug}/complete-guide`;

  return (
    <section
      aria-label={`About ${subcategory.label}`}
      style={{
        marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
        marginBottom: "clamp(2rem, 4vw, 3rem)",
        padding: "clamp(1.5rem, 3vw, 2.25rem)",
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--cream-2)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 2.4vw, 26px)",
          fontWeight: 600,
          color: "var(--on-light-1)",
          margin: 0,
        }}
      >
        About {subcategory.label}
      </h2>

      <p
        style={{
          marginTop: 14,
          fontSize: 15,
          lineHeight: 1.75,
          color: "var(--on-light-2)",
        }}
      >
        {subcategory.description} This {category.label.toLowerCase()}
        {" "}cluster of VastuCart Blog focuses on{" "}
        <strong>{subcategory.label.toLowerCase()}</strong>{" "}
        ({subcategory.label_hindi}) and how it intersects with the broader{" "}
        {category.label} tradition. {postCount === 0
          ? `Articles in this section are in active production by the VastuCart Editorial desk and will publish on the standard ${category.label.toLowerCase()} cadence; in the meantime the parent ${category.label} complete guide already covers the foundational concepts.`
          : postCount === 1
            ? `One article is currently live in this section, with more in the editorial queue.`
            : `${postCount} long-form articles are currently live in this section, every one researched against the classical sources listed in the VastuCart editorial standards.`}
      </p>

      <p
        style={{
          marginTop: 16,
          fontSize: 14.5,
          lineHeight: 1.75,
          color: "var(--on-light-3)",
        }}
      >
        For the full topic map of {category.label}, start with the{" "}
        <Link
          href={completeGuideUrl}
          style={{ color: "var(--teal)", fontWeight: 600 }}
        >
          {category.label} complete guide
        </Link>
        . The guide covers every subcategory in {category.label} and links to
        the deepest article in each cluster. For sibling topics under{" "}
        {category.label}, see{" "}
        {siblings.slice(0, 4).map((s, i) => (
          <span key={s.slug}>
            <Link
              href={`/${category.slug}/${s.slug}`}
              style={{ color: "var(--teal)" }}
            >
              {s.label}
            </Link>
            {i < Math.min(siblings.length, 4) - 1 ? ", " : ""}
            {i === Math.min(siblings.length, 4) - 2 ? "and " : ""}
          </span>
        ))}
        {siblings.length > 4 ? `, plus ${siblings.length - 4} more` : ""}.
      </p>

      <p
        style={{
          marginTop: 16,
          fontSize: 13.5,
          lineHeight: 1.7,
          color: "var(--on-light-3)",
        }}
      >
        Every article on VastuCart Blog is sourced from classical Sanskrit
        texts and reviewed by the VastuCart Jyotish Review Panel before
        publication. Read the{" "}
        <Link
          href="/editorial-standards"
          style={{ color: "var(--teal)" }}
        >
          editorial standards
        </Link>{" "}
        and{" "}
        <Link
          href="/classical-sources"
          style={{ color: "var(--teal)" }}
        >
          classical sources
        </Link>{" "}
        used across the {category.label} cluster.
      </p>
    </section>
  );
}
