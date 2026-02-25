

# FAQ Section Redesign

## What Changes

Replace the 5 generic FAQs in `src/components/landing/FAQ.tsx` with 8 questions organized into 4 buyer-objection categories, each with a category label.

## Changes to `src/components/landing/FAQ.tsx`

### Structure

Group FAQs into 4 labeled sections, each rendered with a small category heading above its accordion items:

**Getting Started**
1. "Do I need QuickBooks to use Zensus?" — No, Plaid/QuickBooks/spreadsheet options.
2. "How long does setup take?" — Under 2 minutes, one-click connect.

**Product**
3. "What's the difference between Runway and Forecast?" — Live tracking vs one-time upload analysis.
4. "What kind of questions can I ask?" — Examples with voice assistant mention.
5. "How often does my data update?" — Daily sync, real-time runway updates.

**Trust & Security**
6. "Is my financial data secure?" — AES-256, OAuth, AWS.
7. "Who can see my data?" — Only you, never shared or used for training.

**Pricing**
8. "What happens after the free trial?" — $199/mo, cancel anytime, keep access through billing period.

### Layout approach

Map over an array of `{ category, items[] }` objects. Each category gets a small uppercase/semibold label, followed by its accordion items using the same card styling as current.

### No other changes

Same section ID (`#faq`), background, headline, and accordion component usage.

## Files Changed

| File | Change |
|------|--------|
| `src/components/landing/FAQ.tsx` | Replace 5 FAQs with 8 grouped by category |

