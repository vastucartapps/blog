import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  /** Optional caption displayed beneath the image. */
  caption?: string;
}

/**
 * Full-width band that renders the locked 1060×1048 hero card at the
 * very top of a Jyotish post, above PostHero. The same WebP also
 * serves as the in-body section image, the OG/Twitter image, and the
 * archives card thumbnail (PostCard.tsx).
 *
 * Sits on the cream paper backdrop (matches the SVG's right panel)
 * so the image bleeds visually into the page without a hard frame.
 */
export function FeaturedHero({ src, alt, caption }: Props) {
  return (
    <section
      style={{
        background: "var(--cream-2)",
        padding: "clamp(1.25rem, 4vw, 2.5rem) 0 clamp(1.5rem, 4vw, 3rem)",
      }}
    >
      <div
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          padding: "0 clamp(1rem, 4vw, 2rem)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1060 / 1048",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 28px 80px -36px rgba(1,63,71,0.45)",
            border: "1px solid var(--border)",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 1060px"
            style={{ objectFit: "cover" }}
          />
        </div>
        {caption ? (
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: 13.5,
              fontStyle: "italic",
              color: "var(--on-light-3)",
              textAlign: "center",
              lineHeight: 1.55,
            }}
          >
            {caption}
          </p>
        ) : null}
      </div>
    </section>
  );
}
