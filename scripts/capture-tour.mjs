// Captures the private product tour (ZEN-783) from the hosted demo and rewrites
// api/_tour/ (the screenshots and manifest.json) in place.
//
//   TOUR_DEMO_PASSWORD=... [TOUR_DEMO_USERNAME=acmetest] \
//   [PLAYWRIGHT_PATH=/path/to/node_modules/playwright/index.mjs] \
//   [CHROMIUM_PATH=/path/to/chrome] node scripts/capture-tour.mjs
//
// Use a demo TEST workspace (acmetest), never a prospect's: it signs in, runs
// Ask Zensus (two messages of the workspace's allowance) and clears the
// scenario afterwards. Hotspots come from the elements' real positions, so a
// layout change moves them with it. The password is read from the environment
// and never printed. Playwright is not a dependency of this repo; point
// PLAYWRIGHT_PATH at any installed copy.
import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const TOUR_DIR = join(ROOT, "api", "_tour");
const BASE = process.env.TOUR_DEMO_URL ?? "https://demo.zensus.app";
const USERNAME = process.env.TOUR_DEMO_USERNAME ?? "acmetest";
const PASSWORD = process.env.TOUR_DEMO_PASSWORD;
if (!PASSWORD) throw new Error("set TOUR_DEMO_PASSWORD (a test workspace's password)");
const VIEW = { width: 1440, height: 900 };
const SCALE = 2;

const { chromium } = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: SCALE, colorScheme: "light" });
const host = new URL(BASE).hostname;
await ctx.addCookies([
  { name: "zensus-color-scheme", value: "light", domain: host, path: "/" },
  { name: "zensus_cookie_consent", value: "denied", domain: host, path: "/" },
]);
const page = await ctx.newPage();
const log = (s) => console.log(new Date().toISOString().slice(11, 19), s);

/** A hotspot in percent of the viewport, padded, kept inside the image. */
async function hotspot(locator, pad = 8) {
  const b = await locator.first().boundingBox();
  if (!b) throw new Error("hotspot element not found");
  const x = Math.max(0, b.x - pad);
  const y = Math.max(0, b.y - pad);
  const w = Math.min(VIEW.width - x, b.width + pad * 2);
  const h = Math.min(VIEW.height - y, b.height + pad * 2);
  const r = (n) => Math.round(n * 10) / 10;
  return { x: r((x / VIEW.width) * 100), y: r((y / VIEW.height) * 100), w: r((w / VIEW.width) * 100), h: r((h / VIEW.height) * 100) };
}

/** Wait until the page text stops changing (a streamed answer has finished). */
async function settle(maxMs = 120_000) {
  let prev = "";
  let still = 0;
  for (let t = 0; t < maxMs && still < 3; t += 3000) {
    await page.waitForTimeout(3000);
    const now = await page.locator("body").innerText();
    still = now === prev ? still + 1 : 0;
    prev = now;
  }
}

const shots = [];
async function capture(id, title, caption, spot) {
  const n = String(shots.length + 1).padStart(2, "0");
  const image = `${n}-${id}.webp`;
  const png = await page.screenshot();
  const out = await sharp(png).webp({ quality: 82 }).toBuffer();
  shots.push({ id, image, buf: out, width: VIEW.width * SCALE, height: VIEW.height * SCALE, title, caption, hotspot: spot });
  log(`captured ${id}`);
}

async function goRunway() {
  await page.goto(`${BASE}/runway`, { waitUntil: "networkidle", timeout: 240_000 }).catch(() => log("runway not idle"));
  await page.waitForTimeout(3000);
}

// ---- Sign in (waits through the demo waking up) -------------------------
await page.goto(`${BASE}/demo/sign-in`, { waitUntil: "networkidle" }).catch(() => undefined);
await page.locator('input[type="password"]').first().waitFor({ state: "visible", timeout: 60_000 });
await page.locator('input:not([type="password"])').first().fill(USERNAME);
await page.locator('input[type="password"]').first().fill(PASSWORD);
await page.locator('button[type="submit"]').first().click();
await page.waitForURL((u) => u.pathname.startsWith("/runway"), { timeout: 6 * 60_000 });
log("signed in");
await goRunway();
// Start clean: no scenario left on the chart from an earlier run.
const clear = page.getByRole("button", { name: "Clear", exact: true });
if (await clear.isVisible().catch(() => false)) {
  await clear.click();
  await page.waitForTimeout(2000);
}

// 1. Connected accounts
await page.locator('[data-testid="data-sources-button"]').click();
await page.waitForTimeout(2000);
const sources = page.locator('[role="dialog"], .mantine-Popover-dropdown').filter({ hasText: "Sample data" });
await capture(
  "connected-accounts",
  "Your accounts, connected",
  "Zensus reads your bank, QuickBooks and HubSpot, so every forecast starts from real balances and real customers.",
  await hotspot(sources),
);
await page.keyboard.press("Escape");
await page.waitForTimeout(1000);

// 2. Runway and the zero-cash date
await capture(
  "runway",
  "Your runway and zero-cash date",
  "The chart projects cash month by month and marks the month it would run out: here, November 2028.",
  await hotspot(page.locator('[data-testid="chart-zero-pill"]'), 12),
);

// 3. A month's detail
const plot = page.locator('[data-testid="chart-plot-area"]');
const pb = await plot.boundingBox();
const mx = pb.x + pb.width * 0.12;
const my = pb.y + pb.height * 0.5;
await page.mouse.move(mx - 5, my);
await page.mouse.move(mx, my);
await page.waitForTimeout(800);
await page.mouse.click(mx, my);
await page.waitForTimeout(6000);
await capture(
  "runway-day",
  "What moves cash in a month",
  "Click any month to see its days and the money in and out behind them, week by week.",
  await hotspot(page.locator("table").filter({ hasText: /money in/i })),
);

// 4. The 13-week view
await goRunway();
await page.locator('[data-testid="scale-thirteenWeek"]').click();
await page.waitForTimeout(6000);
await capture(
  "thirteen-week",
  "The next 13 weeks",
  "A week-by-week cash ledger for the next quarter, with every expected payment and receipt.",
  await hotspot(page.getByText("13-week cash ledger", { exact: true }).locator("xpath=ancestor::*[.//table][1]")),
);
await page.locator('[data-testid="scale-monthly"]').click();
await page.waitForTimeout(2000);

// 5. Ask a hiring question
await page.locator('[data-testid="ask-zensus-launcher"]').click();
await page.waitForTimeout(2500);
const newChat = page.getByText("New conversation", { exact: true });
if (!(await newChat.isVisible().catch(() => false))) {
  await page.getByRole("button", { name: /new conversation|new chat/i }).first().click().catch(() => undefined);
  await page.waitForTimeout(1500);
}
const hireQuestion = page.getByText("Can I afford to hire two engineers next quarter?", { exact: true });
await capture(
  "add-hire",
  "Ask what-if in plain English",
  "Ask Zensus about a plan, such as hiring two engineers, and it runs it against your live forecast.",
  await hotspot(hireQuestion),
);

// 6. Zensus asks what it needs
await hireQuestion.click();
await settle();
const input = page.getByPlaceholder("Ask a scenario about your cash");
await capture(
  "ask-zensus",
  "It asks what it needs",
  "If something is missing, like the salaries, Zensus asks before it models anything.",
  await hotspot(input),
);

// 7. The answer
await input.fill("$12,000 a month each, both starting February 1.");
await input.press("Enter");
await settle();
await capture(
  "ask-zensus-answer",
  "The answer, in numbers",
  "Zensus models the hires and shows what changes: payroll, burn, runway and the new zero-cash date.",
  await hotspot(page.getByText("Zero-cash date", { exact: true }).locator("xpath=ancestor::*[contains(., 'Monthly cash flow')][1]")),
);

// 8. The runway with the hires
await page.getByRole("button", { name: /collapse|minimi|hide|close/i }).last().click().catch(() => page.keyboard.press("Escape"));
await page.waitForTimeout(2500);
await capture(
  "runway-with-hire",
  "See the plan on your runway",
  "The scenario sits next to your base forecast, so you can see the year of runway the hires would cost.",
  await hotspot(page.getByText(/^Scenario: Hire/).first(), 10),
);

// Leave the workspace as it was: no scenario on the chart.
if (await clear.isVisible().catch(() => false)) await clear.click();
await browser.close();

// ---- Write the tour ------------------------------------------------------
mkdirSync(TOUR_DIR, { recursive: true });
for (const f of readdirSync(TOUR_DIR)) if (/\.(png|webp|jpe?g)$/.test(f)) rmSync(join(TOUR_DIR, f));
for (const s of shots) writeFileSync(join(TOUR_DIR, s.image), s.buf);
const manifest = {
  version: 1,
  steps: shots.map(({ id, image, width, height, title, caption, hotspot: h }) => ({ id, image, width, height, title, caption, hotspot: h })),
};
writeFileSync(join(TOUR_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
log(`wrote ${shots.length} steps to api/_tour/`);
