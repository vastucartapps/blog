import { test } from "node:test";
import assert from "node:assert/strict";
import { runGates, type ScriptRunner } from "../gates";

test("verdict passes when both gates exit 0", () => {
  const fake: ScriptRunner = () => ({ code: 0, out: "[PASS]" });
  const v = runGates("content/x/y/some-slug.json", fake);
  assert.equal(v.slug, "some-slug");
  assert.equal(v.passed, true);
  assert.equal(v.results.length, 2);
  assert.ok(v.results.every((r) => r.passed));
});

test("verdict fails and captures details when validate-post exits 1", () => {
  const fake: ScriptRunner = (script) =>
    script.includes("validate-post")
      ? { code: 1, out: "prose (10/15):\n    - prose over target\n    - banned phrase: delve" }
      : { code: 0, out: "[PASS]" };
  const v = runGates("content/x/y/bad-slug.json", fake);
  assert.equal(v.passed, false);
  const vp = v.results.find((r) => r.name === "validate-post")!;
  assert.equal(vp.passed, false);
  assert.ok(vp.details.some((d) => d.includes("prose over target")));
});
