# ADR: Homepage outcome-first positioning

- **Status:** Accepted
- **Date:** 2026-08-17
- **Deciders:** Ashwin
- **Tags:** homepage, positioning, SEO

## Context

The homepage currently identifies Zensus as a 13-week cash flow forecasting product in the H1 and introductory paragraph. This makes the forecasting window the primary message before explaining the user problem. The desired positioning leads with cash visibility for businesses with unpredictable revenue, then presents the 13-week view as a concrete way Zensus resolves that problem.

The existing homepage order is Hero, Product showcase, Trust bar, Problem, Runway features. The existing drill-down, scenarios, alerts, comparison, how-it-works, FAQ, and pricing sections already translate features into benefits and are outside this change.

## Decision

Use the H1 **"Your cash flow, mapped as far ahead as you need."** Keep the subhead **"Built for businesses with unpredictable revenue."**

Replace the hero introduction with:

> Zensus gives you a live, always-current picture of your cash position, so you can make payroll, hiring, and spending decisions with confidence.

The absolute nature of "always-current" is an accepted messaging risk.

Reorder the opening sequence to:

1. Hero
2. Pain section
3. Product showcase
4. Trust bar

Add a short heading and paragraph above the product showcase to introduce the rolling 13-week forecast as the flagship response to the pain. Zensus has no fixed maximum forecast horizon, so the broader H1 is considered supported.

The showcase bridge copy is:

- **Heading:** "See the next 13 weeks before they hit your bank."
- **Paragraph:** "Zensus combines your bank, QuickBooks, and HubSpot data into a weekly forecast that reflects when cash actually moves."

Update the HTML title, meta description, Open Graph title and description, Twitter title and description, and homepage OG card to match the new positioning. Also update the fallback title in `index.html`.

Instrument the hero's **Start free trial** button before release. A conversion is the click that opens the signup modal, recorded with a hero-specific location. The measurement population is visitors whose consent state allows PostHog capture.

## Alternatives considered

| Option | Pros | Cons | Why not |
|--------|------|------|---------|
| Keep 13 weeks in the H1 | Specific and easy to understand | Defines the company by a mechanic rather than an outcome | Rejected because the product supports longer horizons and the message should lead with user value |
| "Stop guessing if you'll make payroll" | Sharp pain-led message | Narrows the audience and product value to payroll | Rejected because the product addresses broader runway and cash timing decisions |
| "Your cash flow, mapped as far ahead as you need." | Outcome-led, broad, and compatible with an unbounded horizon | Less concrete than a fixed forecast window | Chosen |
| Keep product showcase and trust bar before pain | Preserves the current visual rhythm | Delays the problem statement | Rejected because the pain should immediately establish why the product matters |

## Consequences

- **Positive:** The homepage leads with the desired outcome, establishes pain earlier, and uses the 13-week mechanic as evidence rather than identity.
- **Negative / trade-offs:** "Always-current" is an absolute claim that may be inaccurate during source outages or delayed synchronization. Reordering the showcase and trust bar may affect scroll behavior and section engagement.
- **Follow-ups:** Add and test hero-specific CTA instrumentation. Verify responsive spacing after section reordering. Regenerate the homepage OG image. Check all instances of the old headline. Measure hero-to-trial CTR for 28 days after release against the preceding 28-day baseline. Ashwin owns the review. Revert if CTR falls by 5% or more.

## Open questions

- Whether the 10% relative CTR target is met after 28 days. The before-and-after comparison is directional and cannot isolate seasonality or traffic-mix effects.
