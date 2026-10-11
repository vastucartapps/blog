import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// next/image `fill` renders <img> with no width/height attributes, which the
// audit counts as "missing image size" and which gives the browser no intrinsic
// ratio. These components must pass explicit width and height instead.
const FILES = [
  "components/post/FeaturedHero.tsx",
  "components/post/AuthorCard.tsx",
  "components/post/RelatedPosts.tsx",
  "components/listing/PostCard.tsx",
  "components/listing/PostGrid.tsx",
];

for (const f of FILES) {
  test(`${f} gives next/image explicit width and height`, () => {
    const src = readFileSync(join(process.cwd(), f), "utf8");
    const images = [...src.matchAll(/<Image\b[\s\S]*?\/>/g)].map((m) => m[0]);
    assert.ok(images.length > 0);
    for (const img of images) {
      assert.ok(!/\n\s*fill\s*\n/.test(img), `${f}: still uses fill`);
      assert.match(img, /\bwidth=\{?\d+\}?/, `${f}: no width`);
      assert.match(img, /\bheight=\{?\d+\}?/, `${f}: no height`);
    }
  });
}
