import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostHero } from "@/components/post/PostHero";
import { BlockRenderer } from "@/components/post/BlockRenderer";
import { getCategory, getSubcategory } from "@/lib/categories";
import { getPostBySlug, getPublishedPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

interface Params {
  category: string;
  subcategory: string;
  slug: string;
}

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({
    category: p.category,
    subcategory: p.subcategory,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = absoluteUrl(`/${post.category}/${post.subcategory}/${post.slug}`);
  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.meta.og_title ?? post.meta.title,
      description: post.meta.og_description ?? post.meta.description,
      url,
      images: [{ url: post.meta.og_image }],
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [absoluteUrl(`/authors/${post.author_id}`)],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.og_title ?? post.meta.title,
      description: post.meta.og_description ?? post.meta.description,
      images: [post.meta.og_image],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const cat = getCategory(post.category);
  const sub = getSubcategory(post.category, post.subcategory);
  if (!cat || !sub) notFound();

  const breadcrumb = [
    { label: cat.label, href: `/${cat.slug}` },
    { label: sub.label, href: `/${cat.slug}/${sub.slug}` },
    { label: post.title },
  ];

  const schemas = Object.values(post.schema).filter(Boolean);

  return (
    <>
      <Header />
      <article>
        <PostHero
          breadcrumb={breadcrumb}
          badgeLabel={post.hero.badge_label}
          titleHtml={post.hero.title_html}
          description={post.hero.description}
          meta={post.hero.meta}
          tags={post.hero.tags}
          authorId={post.author_id}
          category={post.category}
        />
        <main className="wrap-article" style={{ paddingBottom: "5rem" }}>
          <BlockRenderer blocks={post.content} category={post.category} />
        </main>
      </article>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </>
  );
}
