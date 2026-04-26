import Link from "next/link";
import Image from "next/image";
import type { ArticlePost } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/utils";
import { resolveFeaturedImage } from "@/lib/post-images";

interface Props {
  post: ArticlePost;
  categoryLabel?: string;
}

export function PostCard({ post, categoryLabel }: Props) {
  const featured = resolveFeaturedImage(post);
  return (
    <article style={{ height: "100%" }}>
      <Link
        href={`/${post.category}/${post.subcategory}/${post.slug}`}
        className="post-card group"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "#ffffff",
          textDecoration: "none",
          boxShadow: "0 14px 36px -22px rgba(1,63,71,0.20)",
          transition: "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
        }}
      >
        {featured ? (
          <div
            style={{
              position: "relative",
              height: 200,
              overflow: "hidden",
              background: "var(--cream-2)",
            }}
          >
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            className="diamond-bg relative"
            style={{
              height: 168,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--saffron-light)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                top: -40,
                right: -30,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(232,132,10,0.18) 0%, transparent 65%)",
              }}
            />
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                border: "1px solid rgba(232,132,10,0.35)",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Icon name="sun" size={48} />
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "1.4rem 1.4rem 1.5rem",
            flex: 1,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              background: "var(--cream-2)",
              color: "var(--teal)",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel ?? post.category}
          </span>
          <h3
            style={{
              marginTop: 14,
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.3,
              color: "var(--on-light-1)",
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              marginTop: 8,
              fontSize: 13,
              lineHeight: 1.65,
              color: "var(--on-light-3)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.subtitle}
          </p>
          <div
            style={{
              marginTop: "auto",
              paddingTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 11,
              color: "var(--on-light-4)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="clock" size={11} />
              {post.reading_time_minutes} min
            </span>
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
