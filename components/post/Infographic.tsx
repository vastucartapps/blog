import fs from "node:fs";
import path from "node:path";

interface Props {
  illustration: string;
  alt: string;
  caption?: string;
  eyebrow?: string;
  heading?: string;
}

/**
 * Renders a brand-recoloured open-source illustration (sourced from
 * unDraw / OpenDoodles, recoloured to the VastuCart palette) as an
 * in-body infographic figure. Server component; reads the SVG from
 * public/illustrations/ at render time so the markup ships inline
 * (no extra HTTP request) and stays accessible to crawlers.
 */
export function Infographic({
  illustration,
  alt,
  caption,
  eyebrow,
  heading,
}: Props) {
  const svgPath = path.join(
    process.cwd(),
    "public",
    "illustrations",
    illustration
  );
  let svg = "";
  try {
    if (fs.existsSync(svgPath)) {
      svg = fs.readFileSync(svgPath, "utf-8");
      // Inject role + aria-label for accessibility / SEO. Replace the
      // outer <svg ...> tag.
      svg = svg.replace(
        /<svg([^>]*)>/,
        `<svg$1 role="img" aria-label="${alt.replace(/"/g, "&quot;")}">`
      );
    }
  } catch {
    svg = "";
  }

  return (
    <figure
      style={{
        margin: "2.75rem 0",
        padding: "1.75rem 1.75rem 1.5rem",
        borderRadius: 16,
        background:
          "linear-gradient(135deg, var(--cream-2) 0%, var(--cream-3) 100%)",
        border: "1px solid var(--border)",
        boxShadow: "0 16px 44px -28px rgba(1,63,71,0.20)",
      }}
    >
      {eyebrow ? (
        <div
          style={{
            marginBottom: 8,
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--saffron)",
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      {heading ? (
        <h3
          style={{
            margin: "0 0 18px",
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--on-light-1)",
            letterSpacing: "-0.005em",
          }}
        >
          {heading}
        </h3>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem 0",
          minHeight: 220,
        }}
      >
        {svg ? (
          <div
            style={{
              maxWidth: 480,
              width: "100%",
              display: "block",
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            style={{
              padding: "2rem",
              fontStyle: "italic",
              color: "var(--on-light-3)",
              textAlign: "center",
            }}
          >
            {alt}
          </div>
        )}
      </div>
      {caption ? (
        <figcaption
          style={{
            marginTop: 8,
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--on-light-3)",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
