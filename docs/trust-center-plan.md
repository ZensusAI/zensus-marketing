# Trust center plan (decided 12 Nov 2026)

Decision: the security page stays at `/security` on the main site for now. We looked at moving it to a `trust.` subdomain and chose not to, because the cost is real and the gain today is nothing visible.

## Why not now

Serving the same single-page app on a second host would cost:

- Host-aware routing (otherwise `trust.<host>/pricing` serves a duplicate of the pricing page), plus host-conditional rules in `vercel.json`.
- A second sitemap and robots.txt, and a new constant declared in all three places that hold the site address (`src/lib/constants.ts`, `scripts/site.mjs`, `api/_lib/site.ts`), with test updates.
- Origin allowlist changes in `isAllowedOrigin` and the Turnstile hostname list, or forms on the new host are rejected.
- A separate browser cache and connection for visitors coming from the main site.
- SEO churn for a page that is well cited today, on top of the 13 Sep 2026 domain move, which the apex is still consolidating.
- Every external link to `/security` (questionnaires, Plaid, Intuit, Slack, HubSpot, G2, `security.txt`) becomes a redirect that has to be kept for good.

## Trigger to revisit

Start SOC 2. A trust-center product earns its place once there is a report to gate behind an NDA or an access request, live control status, or buyers asking for a `trust.` link.

## Plan when the trigger fires

1. Pick the vendor, usually the one running the SOC 2 audit (Vanta, Drata, SafeBase and Secureframe all offer a trust center).
2. In Cloudflare, add a CNAME `trust` to the target the vendor gives, DNS only. Do this only once the vendor is ready; a record pointing nowhere is a subdomain takeover risk. Remove the record whenever the vendor domain is removed.
3. Redirect `/security` to the trust center at the edge in `vercel.json`: permanent, single hop, and never a `#fragment` in the target (Search Console reports those as "Redirect error"). Keep it indefinitely.
4. Decide what stays on the marketing site (a short summary or just links from the footer and navbar). Remove `/security` from `src/App.tsx`, `scripts/prerender.mjs`, `scripts/generate-sitemap.mjs` and `scripts/generate-og.mjs` together, because `route-coverage.test.ts` requires them to agree.
5. Update the roughly 34 references in `src` (navbar, footer, proof strip, FAQ, pricing, use cases, one blog post, structured data), `public/llms.txt`, `public/llms-full.txt` and `public/.well-known/security.txt` (its `Canonical` and `Policy` lines).
6. Add the new host as a Search Console and Bing property, and update external listings and email signatures the same day.

## Until then

- Keep `/security` accurate. The 11 Nov 2026 pass (#209) matched every claim to the product.
- Wording during the audit: "in progress" or "audit window", never "compliant", until the report exists.
- Do not rename `/security`, so the future redirect stays one hop.
- Do not create a `trust.` DNS record yet.
- If a vanity alias is wanted sooner, a host redirect from the trust subdomain to `/security` is a small PR (DNS CNAME, Vercel domain, one host rule in `vercel.json`) with no SEO risk.
