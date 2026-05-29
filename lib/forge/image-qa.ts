// lib/forge/image-qa.ts
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { ImageQaIssue, ImageQaResult } from "./types";

const MAX_BYTES = 200 * 1024;

interface ImageFigureLike {
  type: string;
  filename?: string;
  width?: number;
  height?: number;
  alt?: string;
}
interface PostLike {
  slug: string;
  content?: ImageFigureLike[];
}

export async function checkImages(post: PostLike, opts: { publicDir?: string } = {}): Promise<ImageQaResult> {
  const publicDir = opts.publicDir ?? path.join(process.cwd(), "public");
  const issues: ImageQaIssue[] = [];
  const blocks = post.content ?? [];

  for (const b of blocks) {
    if (b.type !== "image-figure" || !b.filename) continue;
    const rel = `posts/${post.slug}/${b.filename}`;
    const abs = path.join(publicDir, "posts", post.slug, b.filename);

    if (!b.filename.endsWith(".webp")) issues.push({ file: rel, problem: "not .webp" });
    if (!b.alt || !b.alt.trim()) issues.push({ file: rel, problem: "missing alt text" });
    else if (b.alt.trim().toLowerCase() === b.filename.toLowerCase()) issues.push({ file: rel, problem: "alt equals filename (not descriptive)" });

    if (!fs.existsSync(abs)) {
      issues.push({ file: rel, problem: "file missing on disk (would 404)" });
      continue;
    }

    const bytes = fs.statSync(abs).size;
    if (bytes > MAX_BYTES) issues.push({ file: rel, problem: `file too large ${Math.round(bytes / 1024)}KB > 200KB` });

    try {
      const meta = await sharp(abs).metadata();
      if (b.width && meta.width !== b.width) issues.push({ file: rel, problem: `width ${meta.width} != declared ${b.width} (CLS risk)` });
      if (b.height && meta.height !== b.height) issues.push({ file: rel, problem: `height ${meta.height} != declared ${b.height} (CLS risk)` });
    } catch (e) {
      issues.push({ file: rel, problem: `unreadable image: ${(e as Error).message}` });
    }
  }

  return { passed: issues.length === 0, issues };
}
