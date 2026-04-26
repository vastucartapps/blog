import Link from "next/link";
import Image from "next/image";
import type { ArticlePost } from "@/lib/types";
import { PostCard } from "./PostCard";
import { EmptyState } from "./EmptyState";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/utils";
import { resolveFeaturedImage } from "@/lib/post-images";

interface Props {
  posts: ArticlePost[];
  categoryLabel?: string;
  emptyTitle?: string;
  emptySub?: string;
}

export function PostGrid({ posts, categoryLabel, emptyTitle, emptySub }: Props) {
  if (posts.length === 0) {
    return <EmptyState title={emptyTitle} sub={emptySub} />;
  }

  // Featured layout: when only 1 post, show it as a full-width editorial card.
  if (posts.length === 1) {
    const p = posts[0];
    return <FeaturedPostCard post={p} categoryLabel={categoryLabel} />;
  }

  // Featured + grid: first post big, rest in 3-col grid below.
  const [hero, ...rest] = posts;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <FeaturedPostCard post={hero} categoryLabel={categoryLabel} />
      {rest.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          }}
        >
          {rest.map((p) => (
            <PostCard key={p.id} post={p} categoryLabel={categoryLabel} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FeaturedPostCard({
  post,
  categoryLabel,
}: {
  post: ArticlePost;
  categoryLabel?: string;
}) {
  const featured = resolveFeaturedImage(post);
  return (
    <Link
      href={`/${post.category}/${post.subcategory}/${post.slug}`}
      style={{
        overflow: "hidden",
        borderRadius: 18,
        border: "1px solid var(--border)",
        background: "#ffffff",
        textDecoration: "none",
        boxShadow: "0 24px 60px -28px rgba(1,63,71,0.30)",
      }}
      className="featured-card split-card group"
      data-media="ratio"
    >
      <div
        className="split-media relative"
        style={{
          minHeight: 240,
          background: "var(--cream-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {featured ? (
          <Image
            src={featured.src}
            alt={featured.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div className="diamond-bg" style={{ position: "absolute", inset: 0 }}>
            <span
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                top: -60,
                right: -40,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(232,132,10,0.18) 0%, transparent 65%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--saffron-light)",
              }}
            >
              <div
                style={{
                  width: 168,
                  height: 168,
                  borderRadius: "50%",
                  border: "1px solid rgba(232,132,10,0.35)",
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="sun" size={92} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="split-body"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2.5rem 2.25rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--saffron)",
          }}
        >
          <span
            style={{
              width: 24,
              height: 1.5,
              background: "var(--saffron)",
              borderRadius: 1,
            }}
          />
          Featured study
        </div>
        <h3
          style={{
            marginTop: 14,
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.18,
            color: "var(--on-light-1)",
            letterSpacing: "-0.01em",
          }}
        >
          {post.title}
        </h3>
        {post.title_hindi ? (
          <p
            className="verse"
            style={{
              marginTop: 6,
              fontSize: 16,
              color: "var(--on-light-4)",
            }}
          >
            {post.title_hindi}
          </p>
        ) : null}
        <p
          style={{
            marginTop: 16,
            fontSize: 14,
            lineHeight: 1.75,
            color: "var(--on-light-2)",
          }}
        >
          {post.subtitle}
        </p>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            color: "var(--on-light-4)",
            fontSize: 12,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              background: "var(--cream-2)",
              color: "var(--teal)",
              fontWeight: 600,
              fontSize: 10.5,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel ?? post.category}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="clock" size={12} />
            {post.reading_time_minutes} min read
          </span>
          <span>{formatDate(post.published_at)}</span>
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--saffron)",
              fontWeight: 600,
            }}
          >
            Read the study
            <Icon name="arrow-right" size={14} />
          </span>
        </div>
      </div>
      {/* Reference image to keep tree-shaking quiet for next/image when unused */}
      <Image
        src="/VastuCartLFAV.png"
        alt=""
        width={1}
        height={1}
        style={{ display: "none" }}
        aria-hidden
      />
    </Link>
  );
}
