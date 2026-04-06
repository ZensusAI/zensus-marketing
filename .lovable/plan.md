

# SEO & Performance Optimization Plan

## Overview

Four improvements to boost search ranking and online presence: sitemap generation, FAQPage structured data, image optimization, and a blog foundation.

---

## Step 1 — Sitemap & Robots.txt

**Create `public/sitemap.xml`** listing all public routes with `lastmod` dates:
- `/` (homepage)
- `/pricing`
- `/forecast`

**Update `public/robots.txt`** to add a `Sitemap:` directive pointing to `https://zensus.ai/sitemap.xml`.

---

## Step 2 — FAQPage JSON-LD Structured Data

**Update `src/components/landing/FAQ.tsx`** to inject a `<script type="application/ld+json">` block containing all 8 FAQ items in Google's `FAQPage` schema format. This enables rich snippets (expandable Q&A) directly in Google search results.

The structured data will be generated from the existing `faqGroups` array so it stays in sync automatically.

---

## Step 3 — Image Optimization

**Update `src/components/landing/RunwayFeature.tsx`:**
- Add `loading="lazy"` to all product screenshot `<img>` tags (these are below the fold)
- Add descriptive `alt` text per section instead of the generic "Zensus dashboard"
- Add `width` and `height` attributes to prevent layout shift (CLS)

**Update `src/components/landing/IntegrationBanner.tsx`:**
- Add `loading="lazy"`, descriptive `alt` (already decent), and dimensions

**Update `src/components/landing/Navbar.tsx`:**
- Logo is above the fold — keep eager loading but add `width`/`height`

---

## Step 4 — Blog Route Foundation

**Create `src/pages/Blog.tsx`** — a simple blog listing page with:
- SEO-friendly heading structure
- Placeholder card layout for future posts
- A few sample post cards with titles like "How to Calculate Startup Runway" and "Cash Flow Forecasting for Variable Revenue Businesses"
- Links back to the homepage

**Update `src/App.tsx`** — add `/blog` route.

**Update `index.html` JSON-LD** — fix the outdated description in the existing `SoftwareApplication` structured data (still says "Upload your model, run what-ifs").

---

## Files Changed

| File | Change |
|------|--------|
| `public/sitemap.xml` | **New** — sitemap with 4 routes |
| `public/robots.txt` | Add `Sitemap:` directive |
| `src/components/landing/FAQ.tsx` | Add `FAQPage` JSON-LD structured data |
| `src/components/landing/RunwayFeature.tsx` | `loading="lazy"`, descriptive `alt`, `width`/`height` |
| `src/components/landing/IntegrationBanner.tsx` | `loading="lazy"`, dimensions |
| `src/components/landing/Navbar.tsx` | Add `width`/`height` to logo |
| `src/pages/Blog.tsx` | **New** — blog listing page |
| `src/App.tsx` | Add `/blog` route |
| `index.html` | Fix JSON-LD description |

