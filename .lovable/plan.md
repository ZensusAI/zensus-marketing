

# Fix Favicon and SEO Audit

## Problem 1: Lovable Favicon Still Showing

The `public/favicon.ico` file still exists and is the **default Lovable favicon**. Browsers (and Google) request `/favicon.ico` by default, which overrides your custom `favicon.png` reference in `index.html`. This is why Google shows the Lovable icon.

**Fix:** Delete `public/favicon.ico`. The existing `index.html` already points to `/favicon.png`, which is your custom Zensus favicon.

## Problem 2: SEO — Outdated Meta Description

Your SEO setup is solid (structured data, OG tags, Twitter cards, canonical URL, robots meta). However, the meta description still says *"Upload your model. Run what-ifs."* — this references the deprecated CSV upload flow. It should reflect the current product positioning (integration-led, agentic scenario analysis).

**Fix:** Update the meta description and OG/Twitter descriptions to match current positioning.

### Proposed New Copy

| Tag | New Value |
|-----|-----------|
| **meta description** | "Connect your accounts, see your runway in real time, and run multi-turn scenarios with an AI agent. Cash flow forecasting built for founders with variable revenue." |
| **OG description** | "Connect your accounts, see your runway, and run scenarios with your AI agent. Cash flow forecasting for founders." |
| **Twitter description** | "Connect your accounts, see your runway, and run scenarios with your AI agent." |

## Files Changed

| File | Change |
|------|--------|
| `public/favicon.ico` | **Delete** |
| `index.html` | Update meta description, OG description, Twitter description |

