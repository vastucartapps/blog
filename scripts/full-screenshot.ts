#!/usr/bin/env tsx
// Full-page screenshot helper using puppeteer-core + system Chrome.
// Usage: npx tsx scripts/full-screenshot.ts <url> <output-path> [width]
import puppeteer from "puppeteer-core";

async function main() {
  const [url, out, widthArg] = process.argv.slice(2);
  if (!url || !out) {
    console.error("usage: full-screenshot.ts <url> <out.png> [width]");
    process.exit(2);
  }
  const width = widthArg ? parseInt(widthArg, 10) : 1440;
  const browser = await puppeteer.launch({
    executablePath: "/opt/google/chrome/chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  // Scroll the page to trigger lazy load
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        y += step;
        if (y >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 80);
    });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: out as `${string}.png`, fullPage: true });
  await browser.close();
  console.log(`saved ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
