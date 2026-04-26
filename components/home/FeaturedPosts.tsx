import Link from "next/link";
import type { ArticlePost } from "@/lib/types";
import { PostGrid } from "@/components/listing/PostGrid";

interface Props {
  posts: ArticlePost[];
}

export function FeaturedPosts({ posts }: Props) {
  return (
    <section style={{ background: "var(--cream-2)" }}>
      <div className="wrap-wide" style={{ paddingTop: "clamp(2.5rem, 6vw, 5rem)", paddingBottom: "clamp(2.5rem, 6vw, 5rem)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2.25rem",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--teal)",
              }}
            >
              Latest wisdom
            </p>
            <h2
              className="section-h"
              style={{
                marginTop: 10,
                fontFamily: "var(--font-display)",
                color: "var(--on-light-1)",
              }}
            >
              Recent articles
            </h2>
          </div>
          <Link
            href="/jyotish"
            className="hidden md:inline"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--saffron)",
            }}
          >
            Browse all
          </Link>
        </div>
        <PostGrid posts={posts.slice(0, 6)} />
      </div>
    </section>
  );
}
