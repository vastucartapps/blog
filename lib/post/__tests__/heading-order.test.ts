import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Article pages go h1 (hero) then h2 sections then h3. A literal h4-h6 in a
// post component can follow an h2 and skip a level (Lighthouse "heading order").
test("post components never emit h4, h5 or h6", () => {
  const dir = join(process.cwd(), "components", "post");
  const bad: string[] = [];
  for (const n of readdirSync(dir)) {
    if (!n.endsWith(".tsx")) continue;
    if (/<h[456][\s>]/.test(readFileSync(join(dir, n), "utf8"))) bad.push(n);
  }
  assert.deepEqual(bad, []);
});
