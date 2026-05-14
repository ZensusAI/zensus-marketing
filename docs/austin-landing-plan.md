# Austin / location SEO — current scope (downscoped)

**Status (now):** No dedicated `/austin` landing page and **no** customer testimonial until permission exists. Local / entity signals are handled via **footer + site-wide Organization schema + city-level map embed**.

**Later:** When a real Austin customer quote is approved, ship a **Case Study** page (separate ticket) so SEO/GEO can pick up Experience signals from that URL; revisit a fuller **location page** playbook only after traction (see [Semrush: location page SEO](https://www.semrush.com/blog/location-page-seo/) for when a dedicated local URL is worth the investment).

---

## What shipped in this strategy

| Surface | Purpose |
|---------|---------|
| **`Footer.tsx`** | Copy: **“Zensus operates from Austin, TX”** + helper line that the map is city-level only. **Google Maps iframe** centered on `Austin, TX` (query embed, **no street address**). `loading="lazy"` for performance. |
| **`index.html` JSON-LD** | `Organization` gains **`address`** (`PostalAddress`: locality Austin, region TX, country US — no `streetAddress`) and **`geo`** (`GeoCoordinates` ~ city centroid for Austin) so crawlers and knowledge panels can tie the brand to a real geography without implying a public office door. |

---

## Explicitly deferred

- **`/austin` route** — Not required for “enough to start”; avoids thin duplicate vs homepage until there is unique case-study copy.
- **Testimonial on marketing site** — Wait for written permission; then prefer a **Case Study** URL (not necessarily `/austin`) for E-E-A-T.
- **Programmatic city pages** — Still off the table until Austin (or a Case Study) proves value over 60+ days.

---

## Follow-up checklist (when testimonial exists)

1. Draft Case Study page with quote + attribution + permission doc on ticket.
2. Add route to `App.tsx`, `prerender.mjs`, `sitemap.xml`, optional `llms.txt` link.
3. Run `/geo content`, `/geo schema`, `/geo citability`; Lighthouse SEO.
4. Consider a **dedicated** location page only if it adds ≥600 words of **non-overlapping** value vs `/` (Semrush guidance).

---

## Verification (current scope)

- [ ] Footer shows Austin, TX + map on mobile and desktop.
- [ ] [Schema.org Validator](https://validator.schema.org/) on homepage JSON-LD — `Organization` parses with `address` + `geo`.
- [ ] `/geo audit https://zensus.app` — no regressions (manual / skill).
- [ ] Map iframe loads (Google may require cookies in some regions; if embed fails, replace with OpenStreetMap embed in a small follow-up).
