import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isDone, remainingFromCandidates } from "../backlog";
import type { PostSpec } from "../types";

function seedContent(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "forge-content-"));
  const sub = path.join(dir, "jyotish", "graha-in-bhava");
  fs.mkdirSync(sub, { recursive: true });
  fs.writeFileSync(path.join(sub, "ready-post.json"), JSON.stringify({ slug: "ready-post", status: "ready" }));
  fs.writeFileSync(path.join(sub, "draft-post.json"), JSON.stringify({ slug: "draft-post", status: "draft" }));
  return dir;
}

const spec = (slug: string): PostSpec => ({ slug, category: "jyotish", subcategory: "graha-in-bhava", template: "planet-in-house" });

test("isDone is true only for an existing ready post", () => {
  const dir = seedContent();
  assert.equal(isDone(spec("ready-post"), { contentDir: dir }), true);
  assert.equal(isDone(spec("draft-post"), { contentDir: dir }), false);
  assert.equal(isDone(spec("missing-post"), { contentDir: dir }), false);
});

test("remainingFromCandidates returns drafts + missing, not ready", () => {
  const dir = seedContent();
  const candidates = [spec("ready-post"), spec("draft-post"), spec("missing-post")];
  const remaining = remainingFromCandidates(candidates, { contentDir: dir }).map((s) => s.slug);
  assert.deepEqual(remaining, ["draft-post", "missing-post"]);
});
