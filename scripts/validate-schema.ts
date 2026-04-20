#!/usr/bin/env tsx
/**
 * Schema smoke test.
 *
 * Iterates every published post, runs buildPostSchema, and asserts:
 *   1. Entity count >= minimum baseline (8)
 *   2. No duplicate @id within a single post
 *   3. No malformed @id (multiple # fragments)
 *   4. Required entity types are present: WebPage, BlogPosting,
 *      BreadcrumbList, Person
 *   5. Every Product has aggregateRating + brand
 *   6. Every BlogPosting has author, publisher, datePublished, headline
 *   7. Organization references resolve to the contract @id
 *   8. No empty arrays or empty strings in critical fields
 *
 * Exits non-zero on any failure so CI can gate deploys.
 *
 * Run: npx tsx scripts/validate-schema.ts
 */

import fs from "node:fs";
import path from "node:path";
import { buildPostSchema } from "../lib/schema";
import { getPublishedPosts } from "../lib/content";
import { ORG_ID } from "../lib/schema/constants";

type Entity = Record<string, unknown>;

interface Failure {
  post: string;
  rule: string;
  detail: string;
}

const MIN_ENTITY_COUNT = 8;
const REQUIRED_TYPES = new Set([
  "WebPage",
  "BlogPosting",
  "BreadcrumbList",
  "Person",
]);

function typeOf(e: Entity): string {
  const t = e["@type"];
  return typeof t === "string" ? t : Array.isArray(t) ? (t[0] as string) : "";
}

function validatePost(slug: string, entities: Entity[]): Failure[] {
  const failures: Failure[] = [];

  if (entities.length < MIN_ENTITY_COUNT) {
    failures.push({
      post: slug,
      rule: "minimum_entity_count",
      detail: `only ${entities.length} entities, expected >= ${MIN_ENTITY_COUNT}`,
    });
  }

  // Rule 2 + 3: @id checks
  const ids = new Set<string>();
  for (const e of entities) {
    const id = e["@id"] as string | undefined;
    if (!id) {
      failures.push({
        post: slug,
        rule: "missing_at_id",
        detail: `${typeOf(e)} has no @id`,
      });
      continue;
    }
    if (ids.has(id)) {
      failures.push({ post: slug, rule: "duplicate_at_id", detail: id });
    }
    ids.add(id);
    // A URI should have at most one # fragment.
    if (id.split("#").length > 2) {
      failures.push({
        post: slug,
        rule: "malformed_at_id_multiple_fragments",
        detail: id,
      });
    }
  }

  // Rule 4: required types
  const types = new Set(entities.map(typeOf));
  for (const t of REQUIRED_TYPES) {
    if (!types.has(t)) {
      failures.push({
        post: slug,
        rule: "missing_required_type",
        detail: t,
      });
    }
  }

  // Rule 5: Product sanity
  for (const e of entities.filter((x) => typeOf(x) === "Product")) {
    if (!e.aggregateRating) {
      failures.push({
        post: slug,
        rule: "product_missing_aggregateRating",
        detail: (e["@id"] as string) ?? "",
      });
    }
    if (!e.brand) {
      failures.push({
        post: slug,
        rule: "product_missing_brand",
        detail: (e["@id"] as string) ?? "",
      });
    }
    // Merchant-listing fields must NOT appear — we picked Product snippet track.
    const offers = e.offers as Entity | undefined;
    if (offers && "price" in offers) {
      failures.push({
        post: slug,
        rule: "product_has_offers_price_should_be_omitted",
        detail: (e["@id"] as string) ?? "",
      });
    }
  }

  // Rule 6: BlogPosting required fields
  for (const e of entities.filter((x) => typeOf(x) === "BlogPosting")) {
    const required = [
      "headline",
      "author",
      "publisher",
      "datePublished",
      "dateModified",
      "url",
      "inLanguage",
    ];
    for (const f of required) {
      if (!e[f]) {
        failures.push({
          post: slug,
          rule: "blogposting_missing_field",
          detail: f,
        });
      }
    }
    // Rule 7: publisher reference must match contract
    const pub = e.publisher as { "@id"?: string } | undefined;
    if (pub && pub["@id"] && pub["@id"] !== ORG_ID) {
      failures.push({
        post: slug,
        rule: "blogposting_wrong_publisher_id",
        detail: `got ${pub["@id"]}, expected ${ORG_ID}`,
      });
    }
  }

  // Rule 8: empty-string / empty-array scan on top-level fields
  for (const e of entities) {
    for (const [k, v] of Object.entries(e)) {
      if (typeof v === "string" && v.trim() === "") {
        failures.push({
          post: slug,
          rule: "empty_string_field",
          detail: `${typeOf(e)}.${k}`,
        });
      } else if (Array.isArray(v) && v.length === 0) {
        failures.push({
          post: slug,
          rule: "empty_array_field",
          detail: `${typeOf(e)}.${k}`,
        });
      }
    }
  }

  // Rule 9: FAQPage should never appear more than once
  const faqCount = entities.filter((x) => typeOf(x) === "FAQPage").length;
  if (faqCount > 1) {
    failures.push({
      post: slug,
      rule: "multiple_faqpage",
      detail: `${faqCount} FAQPage entities`,
    });
  }

  // Rule 10: exactly one Organization reference per BlogPosting.publisher
  for (const e of entities.filter((x) => typeOf(x) === "Organization")) {
    if (e["@id"] !== ORG_ID) {
      failures.push({
        post: slug,
        rule: "wrong_organization_at_id",
        detail: `got ${e["@id"]}, expected ${ORG_ID}`,
      });
    }
  }

  return failures;
}

function main() {
  const posts = getPublishedPosts();
  console.log(`Running schema validation on ${posts.length} posts...\n`);

  const allFailures: Failure[] = [];
  for (const post of posts) {
    try {
      const entities = buildPostSchema(post);
      allFailures.push(...validatePost(post.slug, entities));
    } catch (err) {
      allFailures.push({
        post: post.slug,
        rule: "threw_exception",
        detail: (err as Error).message,
      });
    }
  }

  if (allFailures.length === 0) {
    console.log(
      `\u2713 Schema validation passed on all ${posts.length} posts.\n`
    );
    process.exit(0);
  }

  // Group failures by rule for quick triage
  const byRule: Record<string, Failure[]> = {};
  for (const f of allFailures) {
    (byRule[f.rule] ??= []).push(f);
  }
  console.error(
    `\u2717 ${allFailures.length} validation failures across ${Object.keys(byRule).length} rules.\n`
  );
  for (const [rule, failures] of Object.entries(byRule)) {
    console.error(`  [${rule}] ${failures.length} failure(s)`);
    for (const f of failures.slice(0, 10)) {
      console.error(`    - ${f.post}: ${f.detail}`);
    }
    if (failures.length > 10) {
      console.error(`    ... and ${failures.length - 10} more`);
    }
  }

  process.exit(1);
}

main();
