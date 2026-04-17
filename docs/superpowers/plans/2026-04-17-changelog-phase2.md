# Changelog Page (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public `/changelog` page with per-release entries, swap Changelog for Plans in the primary nav, and move Plans to the Footer.

**Architecture:** New route-level page `Changelog.tsx` mirrors the existing `Blog.tsx` pattern: Navbar and Footer shell, Helmet meta, inline TypeScript array of `ChangelogEntry` records rendered in authored order (newest first, no runtime sort). Category pill colors reuse the Phase 1 Direction 1 tokens (primary, muted, caution, destructive). Nav change is a one-line swap in `Navbar.tsx`; Footer change is a single array entry added to `legalLinks`.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind, shadcn/ui, React Router v6, react-helmet-async (already wired via `<HelmetProvider>` in Phase 1), Geist Sans + Geist Mono (already loaded in Phase 1).

**Reference:** Spec at `/Users/ajin/GitHub/zensus-marketing-migration/docs/superpowers/specs/2026-04-17-changelog-design.md`. The spec owns design rationale; this plan owns exact file changes and commit sequencing.

**CRITICAL project rules:**
- Never use em-dashes in code, copy, comments, or commit messages. Use commas, periods, parentheses, or semicolons.
- Never `git push` without explicit user approval for that specific push.
- Keep commits small and focused: one commit per task.
- No test runner is configured; verify with `npm run build` and `npm run lint` against the Phase 1 baseline (3 errors plus 7 warnings).

---

## Chunk 1: Changelog page, nav swap, footer update

### Task 1: Create `src/pages/Changelog.tsx`

**Files:**
- Create: `src/pages/Changelog.tsx`

- [ ] **Step 1: Write the page**

Write `src/pages/Changelog.tsx`:

```tsx
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { cn } from "@/lib/utils";

type ChangelogCategory = "New" | "Improved" | "Fixed" | "Security";

interface ChangelogEntry {
  date: string;
  category: ChangelogCategory;
  title: string;
  body: string;
}

const entries: ChangelogEntry[] = [
  {
    date: "2026-04-17",
    category: "New",
    title: "Slack cash-crunch alerts",
    body: "Set a dollar floor and Zensus fires a Slack alert the moment your 30-day projection crosses it. Re-alerts on material change: a week earlier breach or a 10% dip in minimum balance. Snooze or adjust your threshold directly from Slack.",
  },
  {
    date: "2026-04-14",
    category: "Improved",
    title: "Scenario drill-down with dual projection",
    body: "Scenarios now render side by side with the baseline at day level. Ask a question, see both numbers, decide. Works at month, week, and day granularity with stable scenario identity across levels.",
  },
  {
    date: "2026-04-10",
    category: "New",
    title: "Vendor normalization",
    body: "Stripe payouts, ACH transfers, and card purchases reconcile cleanly. Same-day internal transfers no longer show up as fake burn spikes. Your expense categories are meaningfully accurate now.",
  },
  {
    date: "2026-04-07",
    category: "Security",
    title: "External synthetic monitoring on api.zensus.app",
    body: "Route 53 health checks run against the API every minute from outside our infrastructure. If the API goes down, we get paged in Slack within one cycle. Built into the platform, no action required from you.",
  },
  {
    date: "2026-04-03",
    category: "Improved",
    title: "Subscription-aware projections for HubSpot deals",
    body: "Annual and quarterly contracts in HubSpot now flow into projections on their real billing dates, not smeared into monthly MRR. Your runway forecast respects contract cadence.",
  },
  {
    date: "2026-04-01",
    category: "Improved",
    title: "Real-time webhook sync across Plaid, QuickBooks, HubSpot",
    body: "When a transaction clears in Plaid, an invoice changes in QuickBooks, or a subscription updates in HubSpot, your runway recalculates. No more waiting for scheduled refreshes.",
  },
];

const CATEGORY_STYLES: Record<ChangelogCategory, string> = {
  New: "bg-primary/10 text-primary",
  Improved: "bg-muted text-muted-foreground",
  Fixed: "bg-[hsl(var(--caution))]/10 text-[hsl(var(--caution))]",
  Security: "bg-destructive/10 text-destructive",
};

const formatDate = (iso: string) => iso.replace(/-/g, " ");

const Changelog = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Changelog · Zensus</title>
      <meta
        name="description"
        content="What we have shipped on Zensus, most recent first. Per-release posts on new features, improvements, fixes, and security work."
      />
      <meta property="og:title" content="Changelog · Zensus" />
      <meta
        property="og:description"
        content="What we have shipped on Zensus, most recent first."
      />
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Changelog
          </h1>
          <p className="text-lg text-muted-foreground">
            What we have shipped, most recent first.
          </p>
        </header>

        <ol className="space-y-10 list-none p-0">
          {entries.map((entry) => (
            <li key={entry.date + entry.title}>
              <article className="grid grid-cols-1 sm:grid-cols-[8rem,1fr] gap-4 sm:gap-8">
                <time
                  dateTime={entry.date}
                  className="font-mono text-sm text-muted-foreground tabular-nums"
                >
                  {formatDate(entry.date)}
                </time>
                <div>
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider mb-2",
                      CATEGORY_STYLES[entry.category],
                    )}
                  >
                    {entry.category}
                  </span>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {entry.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {entry.body}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </main>
    <Footer />
  </div>
);

export default Changelog;
```

- [ ] **Step 2: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: build passes; lint shows 10 problems (3 errors, 7 warnings).

- [ ] **Step 3: Verify no em-dashes in the new file**

Run: `grep -n "—" src/pages/Changelog.tsx || echo "clean"`
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Changelog.tsx
git commit -m "feat(changelog): add /changelog page with six seed entries"
```

### Task 2: Add `/changelog` route in `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import and route**

Add import near the other page imports:

```tsx
import Changelog from "./pages/Changelog";
```

Add the route above the catch-all `*` route. Place it between the existing `/integrations/...` routes and the redirect-to-app routes, so the route list stays grouped by concern:

```tsx
<Route path="/changelog" element={<Changelog />} />
```

- [ ] **Step 2: Verify route placement**

Run: `grep -n "Route path" src/App.tsx`
Expected: the new `/changelog` route line appears before the line matching `path="\*"`.

- [ ] **Step 3: Browser verify**

If you have the dev server running, visit `http://localhost:8080/changelog`. The page should render with Navbar, the six seed entries in order, and Footer.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(changelog): wire /changelog route into App.tsx"
```

### Task 3: Swap Plans for Changelog in Navbar

**Files:**
- Modify: `src/components/landing/Navbar.tsx`

- [ ] **Step 1: Update NAV_LINKS array**

Find the `NAV_LINKS` array near the top of the file (set in Phase 1's Navbar rewrite). It currently reads:

```tsx
const NAV_LINKS: NavLink[] = [
  { href: "/#features", label: "Product", isRoute: false },
  { href: "/integrations", label: "Integrations", isRoute: true },
  { href: "/pricing", label: "Plans", isRoute: true },
  { href: "/security", label: "Security", isRoute: true },
];
```

Replace the third entry so the array reads:

```tsx
const NAV_LINKS: NavLink[] = [
  { href: "/#features", label: "Product", isRoute: false },
  { href: "/integrations", label: "Integrations", isRoute: true },
  { href: "/changelog", label: "Changelog", isRoute: true },
  { href: "/security", label: "Security", isRoute: true },
];
```

Both desktop and mobile lists iterate the same `NAV_LINKS` array, so one edit handles both surfaces.

- [ ] **Step 2: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: passes; baseline unchanged.

- [ ] **Step 3: Browser verify**

Desktop: nav reads `Product | Integrations | Changelog | Security`.
Mobile (DevTools device emulator at 375 wide): hamburger sheet lists the same four items in the same order.
Clicking Changelog routes to `/changelog`.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Navbar.tsx
git commit -m "feat(nav): swap Plans for Changelog in primary nav"
```

### Task 4: Add Plans to the Footer

**Files:**
- Modify: `src/components/landing/Footer.tsx`

- [ ] **Step 1: Add Plans entry to legalLinks**

Find the `legalLinks` array at the top of the component. It currently reads:

```tsx
const legalLinks = [
  { label: "Book a call", href: "https://calendly.com/hello-zensus/introcall" },
  { label: "Privacy", href: "https://app.zensus.app/privacy" },
  { label: "Terms", href: "https://app.zensus.app/terms" },
];
```

Insert a Plans entry after Book a call and before Privacy:

```tsx
const legalLinks = [
  { label: "Book a call", href: "https://calendly.com/hello-zensus/introcall" },
  { label: "Plans", href: "/pricing" },
  { label: "Privacy", href: "https://app.zensus.app/privacy" },
  { label: "Terms", href: "https://app.zensus.app/terms" },
];
```

The existing `<a>` renderer opens `https://...` links in a new tab via the `startsWith("http")` guard. The Plans entry uses a relative path so it renders as a same-tab link, which is correct.

- [ ] **Step 2: Verify build and browser**

Run: `npm run build`. Visit the footer on any page; `Book a call | Plans | Privacy | Terms` appear in that order. Clicking Plans routes to `/pricing`.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Footer.tsx
git commit -m "feat(footer): add Plans link after Book a call"
```

### Task 5: Update `public/sitemap.xml`

**Files:**
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Add Changelog entry**

Add a new `<url>` block for `/changelog`. Match the format of existing entries (each has `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`):

```xml
<url>
  <loc>https://zensus.app/changelog</loc>
  <lastmod>2026-04-17</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
```

Place it near the top of the URL list, adjacent to the Blog entry if one exists (they serve similar purposes). Order within the sitemap does not affect crawl behavior but keeping related entries together helps reviewers.

- [ ] **Step 2: Verify the file is valid XML**

Run: `xmllint --noout public/sitemap.xml && echo "valid"`
Expected: `valid`. If `xmllint` is not installed, open the file in any XML-aware editor or inspect the structure visually.

- [ ] **Step 3: Commit**

```bash
git add public/sitemap.xml
git commit -m "chore(seo): add /changelog entry to sitemap"
```

---

## Phase 2 completion criteria

- `npm run build` passes.
- `npm run lint` stays at 10 problems (3 errors, 7 warnings).
- `/changelog` renders the six seed entries in reverse-chronological order on both desktop and mobile.
- Primary nav reads `Product | Integrations | Changelog | Security`.
- Footer reads `Book a call | Plans | Privacy | Terms` in that order.
- Clicking Plans from the footer lands on `/pricing` unchanged.
- No em-dashes anywhere in the Changelog page or the diff.
- `public/sitemap.xml` lists the Changelog and still validates as XML.

## Open items for founder review (not blocking)

- Seed entry dates are approximate. Founder edits to real ship dates before merging to main.
- Seed entry 4 (Route 53 synthetic monitoring) references infrastructure the product team ships but the marketing site has not yet publicly claimed. Founder verifies the wording before merging.
- No `git push` until founder explicitly authorizes (per memory rule).
