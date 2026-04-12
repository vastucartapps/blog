import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

export interface ImageFigureProps {
  /** Post slug — used to resolve `public/posts/{slug}/{filename}` */
  slug: string;
  filename: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Pass true on the post hero image only */
  priority?: boolean;
  credit?: string;
}

/**
 * Renders a figure with the real image when present, or a styled
 * placeholder of the exact same dimensions when not. Layout never
 * shifts when the real file lands.
 *
 * Server component — checks the file system at render time.
 */
export function ImageFigure({
  slug,
  filename,
  alt,
  caption,
  width,
  height,
  priority,
  credit = "VastuCart",
}: ImageFigureProps) {
  const publicPath = path.join(process.cwd(), "public", "posts", slug, filename);
  const exists = fs.existsSync(publicPath);
  const src = `/posts/${slug}/${filename}`;

  return (
    <figure
      style={{
        margin: "2.5rem 0",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--border)",
        background: "var(--cream-2)",
        boxShadow: "0 18px 50px -28px rgba(1,63,71,0.25)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: `${width} / ${height}`,
          background:
            "linear-gradient(135deg, var(--cream-2) 0%, var(--cream-3) 100%)",
        }}
      >
        {exists ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority ?? false}
            sizes="(min-width: 880px) 860px, 100vw"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <Placeholder alt={alt} width={width} height={height} />
        )}
      </div>
      <figcaption
        style={{
          padding: "14px 18px 16px",
          fontSize: 12.5,
          lineHeight: 1.6,
          color: "var(--on-light-3)",
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span>{caption}</span>
        <span
          style={{
            fontStyle: "normal",
            fontSize: 10.5,
            color: "var(--on-light-4)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {credit}
        </span>
      </figcaption>
    </figure>
  );
}

function Placeholder({
  alt,
  width,
  height,
}: {
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        background:
          "repeating-linear-gradient(45deg, rgba(1,63,71,0.04) 0 12px, transparent 12px 24px), linear-gradient(135deg, var(--cream-2) 0%, var(--cream-3) 100%)",
        textAlign: "center",
        padding: "1.5rem",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--saffron)",
          background: "var(--saffron-pale)",
          padding: "5px 12px",
          borderRadius: 999,
          border: "1px solid var(--saffron-mid)",
        }}
      >
        Image generating
      </span>
      <p
        style={{
          margin: 0,
          maxWidth: 480,
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--on-light-3)",
          fontStyle: "italic",
        }}
      >
        {alt}
      </p>
      <div
        style={{
          fontSize: 11,
          color: "var(--on-light-4)",
        }}
      >
        {width} × {height}
      </div>
    </div>
  );
}
