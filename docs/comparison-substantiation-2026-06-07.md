# Comparison table substantiation, June 7, 2026

Evidence file for the named-competitor matrix in
`src/components/landing/Comparison.tsx`. Every cell in the table maps to a
vendor page below. Re-verify quarterly (next review: September 2026; an
automated routine fetches these pages and opens a PR if anything drifted).

House rules (FTC comparative advertising, Lanham Act substantiation,
nominative fair use):

- Competitor names as plain text only, never logos.
- A cross with the asterisk footnote means "not found on the vendor's
  public pages as of the date above", never an assertion of absence.
- Pricing figures come from the vendor's own pricing page only.
- The caption dates the comparison and disclaims affiliation.

## Float (floatapp.com)

- Pricing: Early $50/mo, Growing $85/mo, Scaling $115/mo, 14-day free
  trial, no credit card. Source: https://floatapp.com/pricing
- Data sources: accounting only (Xero, QuickBooks, FreeAgent). No bank
  feed (Plaid/Open Banking) and no CRM found on vendor pages.
  Source: https://floatapp.com/features
- Forecast granularity: daily, weekly, monthly views; 13-week rolling and
  up to 36-month forecasts. Source: https://floatapp.com/features
- Scenarios: form/toggle based ("Toggle different scenarios on and off").
  Natural-language AI scenario chat not found on vendor pages.
  Source: https://floatapp.com/features
- Alerts: cash-threshold early warning exists; delivery channel
  (Slack/email) not specified on vendor pages.
  Source: https://floatapp.com/features

Table cells: bank feed = no (footnoted), accounting sync = yes,
CRM = no (footnoted), built-in plain-English scenarios = no (footnoted),
Slack threshold alerts = no (footnoted), transparent pricing = yes
("from $50/mo").

## Cash Flow Frog (cashflowfrog.com)

- Pricing: Pro $55/mo (or $33/mo annual) up to $1M revenue / 10 users.
  Source: https://www.cashflowfrog.com/pricing/
- Data sources: QuickBooks Online and Desktop, Xero, Zoho Books,
  FreshBooks, and Plaid bank feed. CRM not found.
  Source: https://www.cashflowfrog.com/pricing/
- Scenarios: native form-based scenario planning, plus an external "AI
  Connector" that bridges Claude/ChatGPT to the account for plain-language
  questions. Not a built-in chat, hence the dagger footnote.
  Sources: https://www.cashflowfrog.com/pricing/ and
  https://help.cashflowfrog.com/en/articles/14464968-the-cash-flow-frog-ai-connector
- Alerts: Slack or email alerts not found on vendor pages.

Table cells: bank feed = yes, accounting sync = yes, CRM = no (footnoted),
built-in plain-English scenarios = yes with dagger (external connector),
Slack threshold alerts = no (footnoted), transparent pricing = yes
("from $55/mo").

## Forecastr (forecastr.co)

- Pricing: quote-only ("we can't recommend a package without first
  understanding your needs"); three tiers (Essentials, Growth, CFO
  Services), no public dollar amounts, no free trial mentioned.
  Source: https://www.forecastr.co/pricing
- Data sources: QuickBooks Online and Xero for historical data only. Bank
  feed and CRM not found on vendor pages.
  Source: https://www.forecastr.co/pricing
- Model maintenance: hybrid software plus a dedicated human analyst;
  scenarios are form-based and analyst-maintained (1 scenario on
  Essentials, multiple on Growth). AI natural-language chat not found.
  Source: https://www.forecastr.co/pricing
- Alerts: not found on vendor pages.

Table cells: bank feed = no (footnoted), accounting sync = yes,
CRM = no (footnoted), built-in plain-English scenarios = no (footnoted),
Slack threshold alerts = no (footnoted), transparent pricing = no
(unfootnoted deliberately: the absence of public self-serve pricing is
positively verified from their own pricing page, not merely "not found").

## Zensus column

All Zensus cells reflect the shipped product: Plaid bank feed, QuickBooks
accounting sync, HubSpot CRM-aware forecasting, built-in plain-English
scenario chat, Slack threshold alerts, $199/mo flat self-serve pricing
with a 14-day trial.

## Landscape notes from the same research pass

Considered and excluded from the matrix: Runway (runway.com) moved
upmarket to sales-led FP&A for $1M-$50M ARR finance teams (no public
pricing); Finmark was shut down April 1, 2026 after the BILL acquisition;
Causal was absorbed into Lucanet (enterprise) in October 2024; re:cap is
EU/euro and lending-first with a free AI tier; Lucid Financials is a
bookkeeping/tax/CFO services bundle rather than self-serve software;
Mosaic, Abacum, Aleph, and Concourse target mid-market finance teams.
Forecastr was included as the rising founder-targeted alternative
(G2 Leader Fall 2025, Series A August 2024, Forecastr 2.0 launched 2025).
