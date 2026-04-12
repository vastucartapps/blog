#!/usr/bin/env tsx
// Configure the blog Coolify app: enable auto-deploy, capture webhook URL,
// configure env vars, then trigger deploy.
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const COOLIFY_URL = "http://175.111.130.243:8000";
const EMAIL = "kumarprashantvaishnav@gmail.com";
const PASSWORD = "Prashant$$31$$";
const APP_UUID = fs.readFileSync("/tmp/blog-app-uuid.txt", "utf8").trim();

async function main() {
  const browser = await puppeteer.launch({
    executablePath: "/opt/google/chrome/chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1400 });
  page.setDefaultTimeout(30000);

  // Login
  await page.goto(`${COOLIFY_URL}/login`, { waitUntil: "networkidle2" });
  await (await page.$('input[type="email"]'))!.type(EMAIL);
  await (await page.$('input[type="password"]'))!.type(PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}),
    (await page.$('button[type="submit"]'))!.click(),
  ]);
  await new Promise((r) => setTimeout(r, 1500));

  // Coolify dashboard, then click into the project
  await page.goto(`${COOLIFY_URL}/`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: "/tmp/coolify-dashboard.png", fullPage: true });

  const projectUuid = fs.readFileSync("/tmp/blog-project-uuid.txt", "utf8").trim();
  // Match the project entry by UUID in href
  const blogLink = await page.evaluate((uuid) => {
    const links = Array.from(document.querySelectorAll("a"));
    for (const a of links) {
      if (a.href.includes(`/project/${uuid}/environment/`)) {
        return a.href;
      }
    }
    return null;
  }, projectUuid);
  console.log("blog project link:", blogLink);
  if (blogLink) {
    await page.goto(blogLink, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: "/tmp/coolify-project.png", fullPage: true });
  }

  // Find link to the "blog" application
  const appLink = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a"));
    for (const a of links) {
      const t = (a.textContent ?? "").trim();
      if (t === "blog" || t.startsWith("blog ") || a.href.includes("/application/")) {
        return a.href;
      }
    }
    return null;
  });
  console.log("blog app link:", appLink);
  if (appLink) {
    await page.goto(appLink, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: "/tmp/coolify-app-1-overview.png", fullPage: true });
    console.log("on app page:", page.url());
  } else {
    console.error("could not find blog app link");
    await browser.close();
    return;
  }

  // Now navigate to the configuration sub-route to find auto-deploy
  await page.goto(page.url(), { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  // Dump all toggles + their labels
  const toggles = await page.evaluate(() => {
    const out: { idx: number; label: string; checked: boolean; type: string }[] = [];
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
    inputs.forEach((i, idx) => {
      const el = i as HTMLInputElement;
      let label = "";
      if (el.id) {
        const lab = document.querySelector(`label[for="${el.id}"]`);
        if (lab) label = (lab.textContent ?? "").trim().slice(0, 100);
      }
      if (!label) {
        const parent = el.closest("label");
        if (parent) label = (parent.textContent ?? "").trim().slice(0, 100);
      }
      out.push({ idx, label, checked: el.checked, type: el.type });
    });
    return out;
  });
  console.log("toggles:", JSON.stringify(toggles, null, 2));

  // Look for any visible webhook URL on the page
  const webhookUrls = await page.evaluate(() => {
    const text = (document.body as HTMLElement).innerText;
    const matches: string[] = [];
    const re = /https?:\/\/[^\s"]+webhooks?\/[^\s"]+/gi;
    let m;
    while ((m = re.exec(text))) matches.push(m[0]);
    return matches;
  });
  console.log("webhook urls on page:", webhookUrls);

  await browser.close();
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
