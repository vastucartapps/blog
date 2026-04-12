#!/usr/bin/env tsx
// Log into Coolify, create an API token with root permission, capture it.
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const COOLIFY_URL = "http://175.111.130.243:8000";
const EMAIL = "kumarprashantvaishnav@gmail.com";
const PASSWORD = "Prashant$$31$$";

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

  // Tokens page
  await page.goto(`${COOLIFY_URL}/security/api-tokens`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  // Discover all checkboxes and their labels for inspection
  const inspect = await page.evaluate(() => {
    const out: { idx: number; label: string; checked: boolean; type: string; id: string; name: string }[] = [];
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
    inputs.forEach((i, idx) => {
      const el = i as HTMLInputElement;
      let label = "";
      if (el.id) {
        const lab = document.querySelector(`label[for="${el.id}"]`);
        if (lab) label = (lab.textContent ?? "").trim();
      }
      if (!label) {
        const parent = el.closest("label");
        if (parent) label = (parent.textContent ?? "").trim();
      }
      if (!label) {
        const next = el.parentElement?.parentElement;
        if (next) label = (next.textContent ?? "").trim().slice(0, 80);
      }
      out.push({
        idx,
        label,
        checked: el.checked,
        type: el.type,
        id: el.id,
        name: el.name,
      });
    });
    return out;
  });
  console.log("checkboxes:", JSON.stringify(inspect, null, 2));

  // Fill description
  await (await page.$('input[type="text"]'))!.type("Blog deployment auto-token");

  // Determine which checkboxes correspond to root/write/deploy by index.
  // Coolify's permission checkboxes are the first 5: root, write, deploy, read, read:sensitive.
  // We use ElementHandle.click() which fires real mouse events that Livewire's wire:model picks up.
  const checkboxHandles = await page.$$('input[type="checkbox"]');
  console.log(`found ${checkboxHandles.length} checkboxes`);
  // Click root (idx 0), write (idx 1), deploy (idx 2). Skip read (idx 3, already checked).
  for (const idx of [0, 1, 2]) {
    if (checkboxHandles[idx]) {
      // Use the parent label click for Filament — the checkbox itself might be display:none
      await page.evaluate((i) => {
        const inputs = document.querySelectorAll('input[type="checkbox"]');
        const el = inputs[i] as HTMLInputElement | undefined;
        if (el) {
          // Find the closest clickable label or wrapper
          const label = el.closest("label");
          if (label) (label as HTMLElement).click();
          else el.click();
          // Trigger Livewire reactivity
          el.dispatchEvent(new Event("change", { bubbles: true }));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }, idx);
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  // Verify state
  const verify = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    return inputs.slice(0, 5).map((i, idx) => `${idx}:${(i as HTMLInputElement).checked}`);
  });
  console.log("verified state:", verify);
  await page.screenshot({ path: "/tmp/coolify-5-pre-create.png", fullPage: true });

  // Click Create
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    for (const b of buttons) {
      if ((b.textContent ?? "").trim() === "Create") {
        (b as HTMLButtonElement).click();
        return true;
      }
    }
    return false;
  });
  await new Promise((r) => setTimeout(r, 4000));
  await page.screenshot({ path: "/tmp/coolify-6-after-create.png", fullPage: true });

  const tokenMatches = await page.evaluate(() => {
    const out: string[] = [];
    const all = (document.body as HTMLElement).innerText;
    const m = all.match(/[0-9]+\|[A-Za-z0-9]{40,}/g);
    if (m) out.push(...m);
    const inputs = Array.from(document.querySelectorAll('input[type="text"], textarea'));
    for (const i of inputs) {
      const v = (i as HTMLInputElement).value;
      if (v && /^[0-9]+\|[A-Za-z0-9]{40,}$/.test(v)) out.push(v);
    }
    return out;
  });

  console.log("tokens found:", JSON.stringify(tokenMatches));
  if (tokenMatches.length > 0) {
    fs.writeFileSync("/tmp/coolify-token.txt", tokenMatches[0]);
    console.log("saved to /tmp/coolify-token.txt");
  }

  await browser.close();
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
