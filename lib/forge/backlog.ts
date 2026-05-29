// lib/forge/backlog.ts
import fs from "node:fs";
import path from "node:path";
import type { PostSpec } from "./types";

export interface RemainingOpts {
  contentDir?: string;       // default: <cwd>/content
  requireReady?: boolean;    // default: true — a post counts as done only if status === "ready"
}

function postFilePath(contentDir: string, spec: PostSpec): string {
  return path.join(contentDir, spec.category, spec.subcategory, `${spec.slug}.json`);
}

export function isDone(spec: PostSpec, opts: RemainingOpts = {}): boolean {
  const contentDir = opts.contentDir ?? path.join(process.cwd(), "content");
  const f = postFilePath(contentDir, spec);
  if (!fs.existsSync(f)) return false;
  if (opts.requireReady === false) return true;
  try {
    const post = JSON.parse(fs.readFileSync(f, "utf8"));
    return post.status === "ready";
  } catch {
    return false;
  }
}

export function remainingFromCandidates(candidates: PostSpec[], opts: RemainingOpts = {}): PostSpec[] {
  return candidates.filter((c) => !isDone(c, opts));
}
