# ZEN-378: Payroll Calendar Calculator — Implementation Plan

**Linear:** [ZEN-378](https://linear.app/zensus/issue/ZEN-378/free-tool-payroll-calendar-calculator-at-toolspayroll-calendar)  
**Branch:** `feature/zen-378-payroll-calendar-tool`  
**Assignee:** Ashwin Menon  
**Priority:** High  
**Related:** [ZEN-377](https://linear.app/zensus/issue/ZEN-377) (missed-payroll blog post — not shipped yet; link when available)

---

## 1. Problem & opportunity

ADP/Paychex own the head term **"how many pay periods in 2026"**, but they answer a calendar question, not a **cash flow forecast distortion** question:

- Even in a normal **26-period** biweekly year, **two months contain three paychecks**.
- **2026 is a rare 27-pay-period year** for biweekly schedules with an early-January first payday (next occurrence ~2037).
- Founders who budget payroll as `annual payroll ÷ 12` misstate cash outflows in three-paycheck months and in 27-period years.

**Zensus angle:** Ship a free tool that answers the calendar question *and* shows monthly cash impact, with bidirectional links to payroll cash-flow content (`will-i-make-payroll`, ZEN-377 when live).

**Time sensitivity:** Ship while "2026 pay periods" is the live search query.

---

## 2. Deliverable

| Item | Detail |
|------|--------|
| **Route** | `/tools/payroll-calendar` |
| **Page** | `src/pages/tools/PayrollCalendar.tsx` |
| **Logic** | `src/lib/payroll-calendar.ts` (pure functions, unit-tested) |
| **OG** | `public/og/tools-payroll-calendar.png` via `scripts/generate-og.mjs` |

### Inputs

1. **First pay date** (date picker or month/day/year fields; default sensible 2026 example)
2. **Frequency:** weekly \| biweekly \| semimonthly \| monthly
3. **Amount per payroll run** (optional but recommended for cash-impact column; default e.g. $21,000)

### Outputs (crawlable HTML table, not canvas)

1. **Pay period count** for calendar years **2026** and **2027**
2. **Full pay-date list** grouped by month (or month summary table)
3. **Three-paycheck months** highlighted (weekly/biweekly; semimonthly always 2; monthly always 1)
4. **27th-period flag** when biweekly year count = 27, with short explainer + primary source citation
5. **Monthly cash impact table:** per month, paycheck count × amount; highlight months above the "normal" two-paycheck baseline

### SEO / GEO targets (work into H1, meta, FAQs, body copy)

**Primary:** `default alive` adjacent terms — `how many pay periods in 2026`, `three paycheck months 2026`, `biweekly payroll calendar 2027`, `27 pay periods 2026`

**FAQ questions (verbatim in visible FAQ + FAQPage JSON-LD):**

- How many pay periods are in 2026?
- Which months have three paychecks in 2026?
- Why does 2026 have 27 pay periods for biweekly payroll?
- How does payroll timing affect cash flow forecasting?
- How do I plan for three-paycheck months?

---

## 3. Reference implementation

Copy patterns from `src/pages/tools/RunwayCalculator.tsx`:

| Pattern | Apply to payroll calendar |
|---------|----------------------------|
| `Helmet` | title, description, canonical, OG/Twitter |
| JSON-LD | `WebApplication` + `FAQPage` + `BreadcrumbList` via `@/lib/structured-data` |
| Layout | `Navbar` → `main` (pt-24) → inputs card → results → how-it-works → FAQ → `FinalCTABand` → `Footer` |
| Results | Real `<table>` with `<caption>` (sr-only ok), semantic `<thead>`/`<tbody>` |
| FAQs | 5 items in page + `faqPageSchema(FAQS)` |
| Cross-links | `linkCls` + `Link` to blog posts and Zensus product |
| Styling | `section-container max-w-3xl`, `rounded-2xl border`, existing `Input`/`Label`/`Select` |

**No em-dashes** anywhere (build fails `scripts/check-em-dashes.mjs`).

---

## 4. Payroll calendar logic (`src/lib/payroll-calendar.ts`)

### Frequency rules

| Frequency | Advance rule | Periods/year (typical) |
|-----------|--------------|------------------------|
| Weekly | +7 days | 52 or 53 |
| Biweekly | +14 days | 26 or **27** |
| Semimonthly | 1st and 15th (or 15th and last day) from anchor | 24 |
| Monthly | same day-of-month each month | 12 |

### Algorithm (biweekly/weekly)

```
1. Normalize firstPayDate to UTC date (avoid TZ drift).
2. Generate pay dates from firstPayDate forward through end of target year + 1 (for 2027 view).
3. Filter dates into calendar year buckets (2026, 2027).
4. Group by (year, month) → count paychecks per month.
5. threePaycheckMonths = months where count === 3.
6. is27PeriodYear = (yearCount === 27) for biweekly.
7. monthlyCashImpact[month] = count × amountPerRun.
8. normalMonthlyBaseline = 2 × amountPerRun (biweekly) | 4 × amountPerRun (weekly) | etc.
```

### Semimonthly

- Anchor on first pay date: if day ≤ 15, treat as 1st/15th pattern; else 15th/last-day pattern (document in UI helper text).
- Always 24 periods/year; no three-paycheck months.

### Monthly

- Same calendar day each month; handle month-end clamping (Jan 31 → Feb 28).
- 12 periods/year.

### 27-period year (cite in UI)

- Biweekly payroll: 365 ÷ 14 ≈ 26.07 → some years accumulate an extra pay period.
- **2026 with first payday in early January** yields **27** pay dates in that calendar year.
- **Primary source to cite:** ADP or Paychex 2026 payroll calendar documentation, or IRS Publication 15 (employer tax deposit context). Pick one authoritative payroll vendor page in implementation.

### Tests (`src/lib/payroll-calendar.test.ts`)

- Biweekly, first pay Jan 2 2026 → 27 periods in 2026 (regression for ticket claim)
- Biweekly, first pay Jan 16 2026 → 26 periods in 2026
- Identifies exactly two three-paycheck months in a 26-period biweekly year (spot-check known month names)
- Semimonthly → 24 periods
- Monthly → 12 periods
- Monthly cash: $21,000/run, 3 paychecks in month → $63,000

---

## 5. Files to create

| File | Purpose |
|------|---------|
| `src/pages/tools/PayrollCalendar.tsx` | Page component |
| `src/lib/payroll-calendar.ts` | Date generation + aggregation |
| `src/lib/payroll-calendar.test.ts` | Vitest unit tests |
| `public/og/tools-payroll-calendar.png` | Generated at build via `npm run og` |

---

## 6. Files to modify

| File | Change |
|------|--------|
| `src/App.tsx` | Lazy import + route `/tools/payroll-calendar` **above** `*` catch-all |
| `scripts/prerender.mjs` | Add `/tools/payroll-calendar` to `STATIC_ROUTES` |
| `scripts/generate-sitemap.mjs` | Add URL to `STATIC_URLS` (priority `0.8`, changefreq `monthly`) |
| `scripts/generate-og.mjs` | Add `tools-payroll-calendar` card to `CARDS` |
| `src/components/landing/Footer.tsx` | Add **Payroll Calendar** link in Product column (next to Runway Calculator; ticket says "resources column" but site uses Product column for free tools today) |
| `src/pages/tools/RunwayCalculator.tsx` | Cross-link to payroll calendar in "How it works" |
| `src/content/blog/will-i-make-payroll.mdx` | Link to `/tools/payroll-calendar` (pay period timing / three-paycheck months) |
| `public/llms.txt` | Add tool link |
| `public/llms-full.txt` | Add tool section + links list |
| `public/sitemap.xml` | Regenerate via `node scripts/generate-sitemap.mjs` |

### ZEN-377 (when shipped)

- Add reciprocal link from missed-payroll post → `/tools/payroll-calendar`
- Add link from payroll calendar → that post

---

## 7. Page content outline

### Hero

- Eyebrow: `Free tool`
- H1: `Payroll calendar calculator` (or `How many pay periods in 2026?`)
- Lead: explains calendar vs cash-flow distortion in one paragraph

### Input card

- First pay date
- Frequency select
- Amount per run (with helper: "Used to show monthly cash impact")

### Summary cards (3-up like runway calculator)

- Pay periods in 2026
- Pay periods in 2027
- Three-paycheck months (count + names, or "N/A" for semimonthly/monthly)

### Alert callout (conditional)

- When `is27PeriodYear`: prominent note + citation link

### Results tables

1. **2026 month-by-month:** Month | Pay dates (or count) | Paychecks | Cash outflow | Highlight if 3 paychecks
2. **2027 month-by-month:** same structure
3. Optional: expandable full date list for crawlers (all dates in `<table>` rows)

### How it works

- Explain 26 vs 27 periods, three-paycheck months, why ÷12 budgeting fails
- Link to `will-i-make-payroll`, cash flow forecasting guides, Zensus

### FAQ (5 visible)

Aligned to target queries above.

### CTA

- `FinalCTABand` (same as runway calculator)

---

## 8. Implementation order

1. **`payroll-calendar.ts` + tests** — logic first, verify 27-period and three-paycheck cases
2. **`PayrollCalendar.tsx`** — UI wired to lib, default inputs show compelling 2026 example
3. **Route + prerender + sitemap + OG** — discoverability
4. **Footer + cross-links** — internal linking
5. **llms.txt / llms-full.txt** — GEO
6. **Build verification:** `npm test`, `node scripts/check-em-dashes.mjs`, `npx vite build`, `npm run og` (OG PNG), spot-check prerender output

---

## 9. Acceptance criteria

- [ ] `/tools/payroll-calendar` loads with interactive inputs
- [ ] Correct pay period counts for all four frequencies
- [ ] Three-paycheck months visually distinct in table
- [ ] 27-period biweekly year flagged with external citation
- [ ] Monthly cash impact column matches `count × amount`
- [ ] Helmet + canonical + OG tags present
- [ ] WebApplication + FAQPage + BreadcrumbList JSON-LD in page source
- [ ] Route in App, prerender, sitemap, OG script, footer
- [ ] Bidirectional link with `will-i-make-payroll`
- [ ] No em-dashes; `npm test` passes
- [ ] Prerendered HTML contains results table (not empty shell)

---

## 10. Out of scope (this ticket)

- ZEN-377 blog post content (link placeholder ok)
- Employer tax deposit schedule calculator (IRS semiweekly vs monthly)
- Multi-year view beyond 2026–2027
- PDF/ICS export of pay dates
- HubSpot/Plaid integration on the tool page

---

## 11. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Date/timezone off-by-one | Use UTC date parts or local noon normalization; test on CI |
| Semimonthly edge cases | Document anchor behavior; keep v1 simple (1st/15th from anchor) |
| 27-period claim disputed | Unit test + cite ADP/Paychex; show first pay date in output |
| ZEN-377 not live | Link only to `will-i-make-payroll` now; add ZEN-377 link in follow-up |
