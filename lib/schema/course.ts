import type { ArticlePost } from "../types";
import { ORG_REF, personId, type SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// Course — two shapes:
//
//   (a) Per-post mini course on a gemstone wearing ritual. Keeps
//       the existing behaviour so gemstone posts still qualify for
//       the Course rich result.
//
//   (b) buildLearningPathCourseSchema() — for future
//       /courses/mesh-lagna-foundations style landing pages that
//       aggregate 10+ articles as a structured learning path.
//       Builder ships now so the landing route can be wired later
//       without re-touching schema code.
// ─────────────────────────────────────────────────────────────────

export function buildGemstoneCourseSchema(
  post: ArticlePost,
  url: string,
  baseUrl: string
): SchemaEntity | null {
  if (post.template !== "gemstone") return null;
  const wearing = post.content.find((b) => b.type === "wearing-ritual");
  if (!wearing) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${baseUrl}#course`,
    name: `${post.title} — wearing ritual`,
    description:
      "Step-by-step gemstone wearing ritual including muhurta, energising mantra, and care.",
    provider: ORG_REF,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    educationalLevel: "Beginner",
    url,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT30M",
      instructor: { "@id": personId(post.author_id) },
    },
    offers: {
      "@type": "Offer",
      category: "Free",
      price: "0",
      priceCurrency: "INR",
    },
  };
}

export interface LearningPathLesson {
  title: string;
  url: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export interface LearningPathInput {
  slug: string;
  name: string;
  description: string;
  instructorAuthorSlug: string;
  lessons: LearningPathLesson[];
  baseUrl: string; // e.g. "https://blog.vastucart.in/courses/mesh-lagna-foundations"
}

export function buildLearningPathCourseSchema(
  input: LearningPathInput
): SchemaEntity | null {
  if (input.lessons.length < 10) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${input.baseUrl}#course`,
    name: input.name,
    description: input.description,
    provider: ORG_REF,
    inLanguage: ["en", "hi"],
    educationalLevel: "Intermediate to Advanced",
    isAccessibleForFree: true,
    url: input.baseUrl,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${input.lessons.length * 12}M`,
      instructor: { "@id": personId(input.instructorAuthorSlug) },
    },
    hasPart: input.lessons.map((lesson) => ({
      "@type": "LearningResource",
      name: lesson.title,
      url: lesson.url,
      learningResourceType: "Article",
      educationalLevel: lesson.level ?? "Intermediate",
    })),
  };
}
