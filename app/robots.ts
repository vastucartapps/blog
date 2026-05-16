import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

// AI bot policy: explicitly ALLOW search-time citation bots (these pull
// content live to answer a user query and cite the source), explicitly
// BLOCK training-time bots (these scrape content to train models with
// no per-query attribution).
const AI_CITATION_BOTS = [
  "ChatGPT-User",      // OpenAI ChatGPT live web fetch
  "OAI-SearchBot",     // OpenAI search index
  "PerplexityBot",     // Perplexity live web fetch + index
  "Perplexity-User",   // Perplexity citation fetch
  "Claude-User",       // Anthropic Claude live web fetch
  "Claude-Web",        // Anthropic Claude search index
  "Applebot",          // Apple Spotlight / Siri (allowed — Spotlight cites)
];

const AI_TRAINING_BOTS = [
  "GPTBot",            // OpenAI training scraper
  "anthropic-ai",      // Anthropic training scraper (legacy UA)
  "ClaudeBot",         // Anthropic training scraper
  "CCBot",             // Common Crawl (feeds many training datasets)
  "Google-Extended",   // Google's training opt-out UA
  "Applebot-Extended", // Apple's training opt-out UA
  "FacebookBot",       // Meta training scraper
  "Bytespider",        // ByteDance training scraper
  "Diffbot",           // Diffbot extraction (training feeds)
  "Omgilibot",         // Omgili training scraper
  "ImagesiftBot",      // ImageSift training scraper
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: everyone else (including Googlebot, Bingbot, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/search"],
      },
      // AI citation bots — explicitly allowed (their crawls feed live
      // search-time answers with source attribution back to us).
      {
        userAgent: AI_CITATION_BOTS,
        allow: "/",
        disallow: ["/api/", "/admin/", "/search"],
      },
      // AI training bots — explicitly blocked across the whole site.
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap-index.xml`,
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap-image.xml`,
    ],
    host: SITE_URL,
  };
}
