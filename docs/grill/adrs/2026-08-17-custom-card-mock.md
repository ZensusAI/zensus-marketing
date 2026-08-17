# ADR: Standalone Custom card mock

- **Status:** Accepted
- **Date:** 2026-08-17
- **Deciders:** Ashwin
- **Tags:** mock, pricing-card, visual-design

## Context

A reference image shows a dark pricing card labeled "Enterprise," with a custom price, CTA, and feature list. The requested artifact should explore a similar visual composition for Zensus but must not use the word "Enterprise."

The live site currently states "One price. Everything included. $199/mo." Adding a custom-priced plan to production would contradict that promise. The card is therefore a standalone visual exercise and is not assigned to the homepage or pricing page.

## Decision

Produce a standalone static image mock with this content:

- **Label:** Custom
- **Subtitle:** Tailored setup for complex cash flow operations
- **Large price text:** Custom
- **CTA:** Talk to us
- **Service bullets:**
  - Tailored forecast setup
  - Custom integrations
  - Dedicated onboarding
  - Priority support
  - Team training

Match the reference card's hierarchy and dark visual treatment while applying Zensus typography, colors, spacing, borders, and checkmark styling. The artifact will remain outside production UI. No concept label or disclaimer is required.

## Alternatives considered

| Option | Pros | Cons | Why not |
|--------|------|------|---------|
| Add the card to `/pricing` | Creates a real conversion path for larger customers | Contradicts the current one-price promise and implies an approved offer | Rejected because this is only a visual exercise |
| Build a reusable React component | Easy to place in production later | Creates implementation and maintenance before the offer is approved | Rejected because the requested deliverable is a static mock |
| Use existing product features as bullets | Avoids unsupported claims | Makes the card look like another product tier rather than tailored service | Rejected in favor of conceptual custom services |
| Create a standalone static mock | Fast to review and does not alter production | Can still be mistaken for approved pricing if shared without context | Chosen; that communication risk is consciously accepted |

## Consequences

- **Positive:** Stakeholders can evaluate the card direction without changing pricing architecture or production UI.
- **Negative / trade-offs:** The mock describes services that are not confirmed live offerings and has no visible concept disclaimer. Repeating "Custom" as both label and price is intentional but may feel redundant.
- **Follow-ups:** If the concept is approved for production, separately define eligibility, pricing, service ownership, support commitments, legal terms, CTA destination, and how it coexists with the $199 plan.

## Open questions

- None for the standalone image mock.
