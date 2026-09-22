# Comparison substantiation, September 21, 2026

Evidence file for every named-competitor claim on the site: the homepage
matrix in `src/components/landing/Comparison.tsx` and the three pages driven
by `src/lib/compare-pages.ts` (`/compare/zensus-vs-float`,
`/compare/zensus-vs-pulse`, `/compare/float-alternatives`). It supersedes
`comparison-substantiation-2026-06-07.md`, which is kept as the record of what
was true in June. Re-verify quarterly (next review: December 2026) or when a
competitor ships changes.

Every fact below was read from the vendor's own public page on 2026-09-21,
from the raw HTML of the URL given, and the quoted words appear on that page.
Nothing here comes from review sites, search snippets or memory.

House rules (FTC comparative advertising, Lanham Act substantiation,
nominative fair use):

- Competitor names as plain text only, never logos.
- A cross with the asterisk means "not found on the vendor's public pages as
  of the date above", never an assertion of absence.
- A cross with the double dagger means the vendor's own page says it does not
  offer the capability. That is a stronger claim and needs its own quote.
- Pricing figures come from the vendor's own pricing page only, with the
  billing period stated.
- Where Zensus's own terms are compared (price, trial), state them in full.
  The June copy said the Zensus trial was "on the same terms" as Float's
  no-card trial. It is not: Zensus collects a card at signup and does not
  charge it until the trial ends. That line is corrected in this review.
- The caption dates the comparison and disclaims affiliation.

## What changed since June

| Claim on the site in June | What the vendor's page says now |
|---|---|
| Float "from $31/mo", "$105/mo and $154/mo at higher bands", "annual from $25/mo" | Essentials $130/mo monthly or $105/mo annual; Growth $265 or $215; Scale $389 or $315 |
| Float: "All plans include Float's full feature set" | Essentials forecasts 12 months, Growth and Scale 36; consolidation is on Scale only |
| Float integrates with "Xero, QuickBooks, FreeAgent" | "Currently, Float integrates with Xero and QuickBooks Online." |
| Float views: "daily, weekly, monthly" | "Primary forecast views: Rolling 13-week (weekly) and monthly" |
| Float bank feed: "not on Float public pages" | Float says it does not connect directly to banks (quote below) |
| Float: "multi-company dashboard" as a general strength | Multi-entity is the Scale plan: up to 5 entities, more at extra cost |
| Zensus trial "on the same terms" as Float's | Wrong in June too; corrected (see house rules) |
| Pulse: QuickBooks sync implied at $29 | QuickBooks Online sync starts on the $59 Small Business Plan |
| Pulse: no $59 plan listed | Basics $29, Small Business Plan $59, Premium $89 |
| Pulse trial: "30 days (new accounts)" | 30 days, and the card used at signup is charged when it ends |
| Cash Flow Frog CRM: "not found" | Vendor says "no CRM connection"; HubSpot appears only as a Zapier pairing |
| Cash Flow Frog AI connector: "ChatGPT or Claude" | "Claude, ChatGPT, Copilot, Gemini, and any MCP-compatible assistant" |
| Forecastr CRM: "not found" | Growth plan lists "Advanced integrations: CRM, Billing systems" |
| Forecastr plain-English scenarios: "not found" | Essentials plan lists "Built-in AI Chatbot" (scope not described) |
| Forecastr domain forecastr.co | Redirects to forecastr.com |

## Float (floatapp.com)

- Pricing (USD tab): Essentials "$130/mo" billed monthly, "$105/mo" billed
  annually, "For companies below £2m in revenue". Growth "$265/mo" and
  "$215/mo", "For companies over £2m+ in revenue". Scale "$389/mo" and
  "$315/mo", "Up to 5 entities", then "$78/mo" or "$63/mo" per entity beyond.
  Source: https://floatapp.com/pricing
- Trial: "14-day free trial. No credit card required."
  Source: https://floatapp.com/pricing
- Inclusions: "Unlimited users", "8 scenarios", "13-week cash flow" on
  Essentials and Growth; "12-months forecasts" on Essentials, "36-month
  forecasts" on Growth. Source: https://floatapp.com/pricing
- Integrations: "Currently, Float integrates with Xero and QuickBooks
  Online." A Sage Intacct connection is described as being built.
  Source: https://floatapp.com/pricing (FAQ)
- Bank feed: "Float doesn't connect directly to your bank. It retrieves your
  bank transaction data through your accounting platform instead." and
  "Float syncs with your accounting platform every 24 hours."
  Source: https://floatapp.com/product
- Forecast views: "Primary forecast views: Rolling 13-week (weekly) and
  monthly". No daily view found. Source: https://floatapp.com/ai-info-page
- Scenarios: "Float has two scenario tools." (line toggles and what-if
  scenarios); "New hire modelling is a dedicated tool within scenario
  planning." Source: https://floatapp.com/ai-info-page
- Alerts: the homepage says "Early warning system to stop crisis. See payment
  timing risks and liquidity gaps before they become urgent". No threshold
  alert, and no Slack or email delivery, found on vendor pages.
  Source: https://floatapp.com/
- CRM, Slack, natural-language scenarios: not found on any Float page read.
- Audience: "Cash visibility for scaling finance teams" (pricing page);
  "Typical customer revenue: £2.5M to £10M (UK) / $5M to $10M (USA)" (AI info
  page; the vendor's text uses a dash in the ranges).

Matrix cells: bank feed = no (double dagger, vendor-stated), accounting sync =
yes, CRM = no (asterisk), built-in plain-English scenarios = no (asterisk),
Slack threshold alerts = no (asterisk).

## Pulse (pulseapp.com)

- Pricing: Basics "for $29 per month"; "Small Business Plan" "$59 per month",
  marked "Recommended"; "Unlock Extra Features" "$89 per month". No annual
  pricing shown. Source: https://pulseapp.com/pricing
- What the $59 plan adds: "Manage cash flow across multiple financial
  accounts", "Invite your investors, book keeper, or management team to see
  reports or manage cash flow", "Integrate with QuickBooks Online for more
  accurate cash flow". Source: https://pulseapp.com/pricing
- What the $89 plan adds: "Manage cash flow across unlimited financial
  accounts", "Convert to any currency for localized cash flow reporting and
  projections". Source: https://pulseapp.com/pricing
- Trial: "You can use Pulse absolutely free for 30 days. After 30 days, we
  will charge the credit card you used when you sign up. If you choose to
  cancel your account before your trial ends, your card will not be charged."
  Source: https://pulseapp.com/pricing
- Basics: "Manage cash flow on a daily, weekly, monthly, or yearly basis",
  "Works with any currency", scenario toggles.
  Source: https://pulseapp.com/pricing
- Bank feed, CRM, Slack, alerts: not found on vendor pages.

Pulse is not in the homepage matrix.

## Cash Flow Frog (cashflowfrog.com)

- Pricing: revenue-tiered single Pro plan. The pricing page opens on the
  Yearly tab, where Tier 1 ("Up to $1M" revenue) shows "$55.00 /mo 20%
  yearly" beside "$33.00 /mo Early bird 40%" and "You save $432/year". The
  $432 only reconciles with a monthly list price of $69 (12 x 69 minus
  12 x 33), and the page's pricing script holds the monthly list
  `[69, 89, 129, 179, 249]` by revenue band. The June file's "Pro $55/mo (or
  $33/mo annual)" misread the tab: $55 is a yearly price, not the monthly
  one. The monthly figures were read from the script, not as rendered text,
  so a person should move the slider and confirm before any page quotes them.
  Source: https://cashflowfrog.com/pricing/
- Trial: "No credit card required" and "30-day money-back guarantee".
  Source: https://cashflowfrog.com/pricing/
- Data sources: "QuickBooks Online, QuickBooks Desktop, Xero, Sage Intacct,
  Odoo, Zoho Books, FreshBooks, bank connections via Plaid, and an Excel
  import path". Source: https://cashflowfrog.com/ai/
- CRM: "There are no opportunity stages, no quotas, no rep performance
  tracking, and no CRM connection." HubSpot appears in a list of common
  Zapier pairings on the same page. Source: https://cashflowfrog.com/ai/
- AI: "MCP server for Claude, ChatGPT, Copilot, Gemini, and any
  MCP-compatible assistant". An external assistant, not a built-in chat,
  hence the dagger. Source: https://cashflowfrog.com/ai/
- Views and horizon: "daily, weekly, monthly, quarterly", "up to 36 months,
  rolling". Source: https://cashflowfrog.com/ai/
- Alerts: Slack or email alerts not found on vendor pages. Slack appears only
  as a Zapier pairing.

Matrix cells: bank feed = yes, accounting sync = yes, CRM = no (double
dagger, vendor-stated), built-in plain-English scenarios = yes (dagger,
external assistant), Slack threshold alerts = no (asterisk).

## Forecastr (forecastr.com; forecastr.co redirects here)

- Pricing: Essentials "$5,000/year", Growth "$10,000/year", CFO Services
  custom. Demo-led ("Schedule a Demo"); no self-serve trial shown.
  Source: https://forecastr.com/pricing
- Essentials includes: "Dedicated financial analyst", "Custom-designed
  financial model", "Built-in AI Chatbot", "Basic integrations: Accounting
  systems, LLMs, Google Sheets & CSV". Source: https://forecastr.com/pricing
- Growth adds: "Custom scenario creation, comparison, and analysis",
  "Advanced integrations: CRM, Billing systems".
  Source: https://forecastr.com/pricing
- Alerts: the page mentions "financial alerts" as part of what the dedicated
  analyst provides. Slack delivery or thresholds not found.
- Bank feed (Plaid or otherwise): not found on the pricing page.

Matrix cells: bank feed = no (asterisk), accounting sync = yes, CRM = yes
with caveat (section sign: Growth plan, $10,000/year), built-in plain-English
scenarios = yes with caveat (section sign: a built-in AI chatbot is listed;
its scope is not described), Slack threshold alerts = no (asterisk).

In June both of those Forecastr cells were crosses. Leaving them as crosses
would now understate a competitor, which is the failure this file exists to
prevent.

## Float alternatives page (`/compare/float-alternatives`)

Added 2026-09-21, driven by `FLOAT_ALTERNATIVES` in
`src/lib/compare-pages.ts`. Float, Pulse and Cash Flow Frog facts on that
page come from the sections above, with these additions and limits:

- The page lists tools by starting price, lowest first, with Float as a
  reference row. Zensus is listed last because it is the most expensive, and
  the page says that Float Essentials ($130/mo) costs less than Zensus Pro
  ($199/mo).
- Cash Flow Frog's price is quoted only as "from $33/mo billed yearly, set by
  revenue", which matches the vendor's own meta description ("revenue-based
  plans from $33/month") and the rendered Yearly tab. The monthly prices read
  from the pricing script are not quoted anywhere on the site.
- Cash Flow Frog's trial: "14-day free trial, no credit card required"
  (https://cashflowfrog.com/ai/) and "30-day money-back guarantee"
  (https://cashflowfrog.com/pricing/).
- Cash Flow Frog's target: "small and mid-sized businesses and for the
  accountants and bookkeepers who advise them" (https://cashflowfrog.com/ai/).
- Pulse's audience: "specifically designed for small businesses"
  (https://pulseapp.com/pricing).
- Pulse scenarios: "Toggle entries and accounts on and off to game out
  different scenarios" (https://pulseapp.com/pricing).
- "Not found" in the table means not found on the vendor's public pages, as
  with the asterisk in the homepage matrix.
- Cash Flow Frog's "14-day free trial" wording is on https://cashflowfrog.com/ai/;
  the pricing page itself says only "No credit card required" and "30-day
  money-back guarantee". The $33 is labelled "Early bird 40%" on the Yearly
  tab and carries `"billingDuration":"P1Y"` in the page's JSON-LD, so the site
  calls it an early-bird rate billed yearly.
- The page makes no comparative claim about Slack alerts: Helm and Futrli
  were not checked for them, so the Slack line names only what Zensus does.

### Futrli (futrli.com)

- Price: "Single For 1-5 licenses Perfect for sole traders. Your quote $40
  per month / excl. VAT". Next plans: Starter $250 ("For 6-18 licenses"),
  Professional $350, Practice $550. Source: https://www.futrli.com/pricing
- Currency: the default block shows a bare "$". The page's JSON-LD gives
  `"price": "40", "priceCurrency": "USD"` (its `priceValidUntil` of
  2025-12-31 is stale). The page swaps in regional blocks by visitor location
  (GBP, CAD, AUD, NZD, EUR, ZAR), each labelled, so the unlabelled $ block is
  taken as USD. Source-only; re-check from a US connection at the next review.
- Trial: "Start My 14-Day Free Trial"; "No credit card up front."; FAQ: "No,
  you just need to provide your full name and an email address."
- All plans: "Unlimited users", "Daily cash flow forecasting", "Budgets and
  scenario modelling", "3-way forecasting".
- Integrations (site navigation): Sage, Xero, QuickBooks Online, Excel.
- Audience: separate "For Businesses" and "For Accountants" tabs.
- Ownership: the footer reads "© Sage Group plc 2025", but no page states
  the relationship, so the site does not describe Futrli's owner.
- Bank feed, CRM, alerts: not found on the pages read.

### Helm (takethehelm.app)

- Price: "*Per Business Connected/Month. First connection costs $50/month."
  Source: https://takethehelm.app/pricing/
- Currency: not stated anywhere (no label, no `priceCurrency`, no switcher).
  The page is `lang="en-CA"` and the terms of service name "Slick, Iterative
  Design Corp., which is doing business as Helm", governed by the laws of
  Alberta and Canada (https://takethehelm.app/terms-of-service/). The site
  therefore writes "currency not stated" and never "USD".
- The price counter's source animates from 50 to 32
  (`data-from-value="50" data-to-value="32"`), which likely means $32 for each
  further connection. Not quoted; only the rendered $50 sentence is used.
- Trial: "Start a free 14-day trial ... Cancel or pause your subscription
  anytime." Whether a card is needed is not stated.
- Inclusions: "Fully Automated and Customizable 12-Month Cash Flow
  Forecasts", "Unlimited Scenario Planning", "Unlimited Users".
- Integrations: "Integrates with QBO, Xero, and Sage"; "Helm syncs with Xero,
  QuickBooks Online, and Sage Accounting"
  (https://takethehelm.app/for-businesses/).
- Audience: "manage cash for your business, a few handpicked clients (or
  hundreds)"; "Loved by Small Businesses and their advisors".
- Bank feed, CRM, alerts: not found on the pages read.

### Considered and left out

- Fathom: its served HTML shows "$59/ month" next to a "Prices shown in $AUD"
  label, while its pricing script shows US visitors a USD Starter price of 59.
  More to the point, Fathom presents itself as "Reporting Forecasting and
  Consolidation Software", reporting first, so it is not a like-for-like
  Float alternative. Revisit if the page is broadened.
- Dryrun: no public pricing. Forecastr: analyst-led at $5,000 a year and up,
  a different category.

## Not verified in this review

- Cash Flow Frog's monthly prices as rendered text (read from the pricing
  script only).
- Whether Forecastr's AI chatbot answers scenario questions.
- Float's FreeAgent status: gone from the pricing and integrations pages, but
  one sentence on the AI info page still names it. The site now says "Xero,
  QuickBooks Online", which is what Float's pricing FAQ says.
- Zensus's own facts ($199/month, 14-day trial with a card collected at
  signup, integrations) come from the site's pricing page, not from this
  review.
