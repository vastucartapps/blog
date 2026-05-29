import { test } from "node:test";
import assert from "node:assert/strict";
import { checkImages } from "../image-qa";

const GOOD_BLOCK = {
  type: "image-figure",
  filename: "guru-7th-house-pisces-lagna-career-infographic.webp",
  width: 1200,
  height: 800,
  alt: "Jupiter in 7th house career fits infographic for Meena Lagna natives",
};
const MISSING_BLOCK = {
  type: "image-figure",
  filename: "guru-7th-house-pisces-lagna-north-indian-kundali.webp",
  width: 1024,
  height: 1024,
  alt: "North Indian kundali chart highlighting Jupiter in the seventh house",
};

test("passes for an existing webp with correct declared dimensions", async () => {
  const post = { slug: "guru-7th-house-pisces-lagna", content: [GOOD_BLOCK] };
  const r = await checkImages(post);
  assert.equal(r.passed, true, JSON.stringify(r.issues));
});

test("flags a referenced image that does not exist on disk", async () => {
  const post = { slug: "guru-7th-house-pisces-lagna", content: [MISSING_BLOCK] };
  const r = await checkImages(post);
  assert.equal(r.passed, false);
  assert.ok(r.issues.some((i) => i.problem.includes("missing")));
});

test("flags alt that equals the filename", async () => {
  const post = { slug: "guru-7th-house-pisces-lagna", content: [{ ...GOOD_BLOCK, alt: GOOD_BLOCK.filename }] };
  const r = await checkImages(post);
  assert.equal(r.passed, false);
  assert.ok(r.issues.some((i) => i.problem.includes("alt")));
});
