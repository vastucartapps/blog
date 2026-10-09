import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Search Console: queries containing "ascendant" earn 2.8% CTR on this blog, those
// containing "lagna" 0.18%, and the titles only said "Mesh Lagna". Batch 1 (the five
// pages with the most missed clicks) names the ascendant in plain English and keeps
// the Sanskrit lagna name in the description. URLs, H1 and body are unchanged.
const BATCH: Record<string, { sign: string; hindi: string; head: string }> = {
  "jupiter-9th-house-aries-lagna": { sign: "Aries", hindi: "Mesh", head: "Jupiter in 9th House" },
  "mars-6th-house-aries-lagna": { sign: "Aries", hindi: "Mesh", head: "Mars in 6th House" },
  "shani-5th-house-gemini-lagna": { sign: "Gemini", hindi: "Mithuna", head: "Saturn in 5th House" },
  "chandra-10th-house-pisces-lagna": { sign: "Pisces", hindi: "Meena", head: "Moon in 10th House" },
  "sun-5th-house-aries-lagna": { sign: "Aries", hindi: "Mesh", head: "Sun in 5th House" },
};

for (const [slug, b] of Object.entries(BATCH)) {
  const post = JSON.parse(readFileSync(`content/jyotish/graha-in-bhava/${slug}.json`, "utf8"));
  test(`${slug}: title names the ${b.sign} ascendant and keeps the searched phrase`, () => {
    const t: string = post.meta.title;
    assert.ok(t.startsWith(b.head), t);
    assert.ok(t.includes(`${b.sign} Ascendant`), t);
    assert.ok(t.length <= 66, `${t.length}: ${t}`);
    assert.ok(!/Lagna/.test(t), "plain English in the title");
  });
  test(`${slug}: description names the ascendant and keeps the lagna name, within the limit`, () => {
    const d: string = post.meta.description;
    assert.ok(d.toLowerCase().includes(`${b.sign.toLowerCase()} ascendant`), d);
    assert.ok(d.includes(`${b.hindi} Lagna`), d);
    assert.ok(d.length >= 110 && d.length <= 160, `${d.length}: ${d}`);
  });
  test(`${slug}: the page's own heading and slug are untouched`, () => {
    assert.equal(post.slug, slug);
    assert.ok(/Lagna/.test(post.title), post.title);
  });
}
