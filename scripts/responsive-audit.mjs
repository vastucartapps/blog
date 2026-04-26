// Capture rendered post at 3 viewport widths to find responsive bugs.
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const URL = "http://localhost:3017/jyotish/graha-in-bhava/rahu-12th-house-aries-lagna";
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  headless: "new",
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60_000 });
  await page.waitForFunction(() => document.fonts.ready);
  // Wait a beat for animations to settle
  await new Promise((r) => setTimeout(r, 500));
  const path = `/tmp/audit-${vp.name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ ${vp.name} (${vp.width}×${vp.height}) → ${path}`);
  // Also dump body width and any horizontal scroll
  const diag = await page.evaluate(() => ({
    bodyW: document.body.scrollWidth,
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
    overflowX: document.documentElement.scrollWidth > window.innerWidth,
  }));
  console.log(`   ${JSON.stringify(diag)}`);
  await page.close();
}

await browser.close();
