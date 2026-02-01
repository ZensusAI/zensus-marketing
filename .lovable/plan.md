

# Zensus Landing Page Redesign Plan

## Overview

Redesign the landing page to reflect the evolved product with two core features (Forecast & Runway), QuickBooks integration, and add a dedicated pricing page with a single paid plan. Target audience: Small business owners.

---

## New Page Structure

### Landing Page Sections

1. **Hero** - New headline focusing on cash flow clarity for small businesses
2. **Integration Banner** - Prominent QuickBooks integration highlight
3. **Feature Section: Forecast** - Full-width section with visual mockup
4. **Feature Section: Runway** - Full-width section with visual mockup
5. **How It Works** - Simple 3-step process
6. **Pricing Preview** - Single plan highlight with CTA to pricing page
7. **FAQ** - Updated questions for new product
8. **Footer** - Updated with pricing link

### New Pricing Page

Dedicated `/pricing` route with single plan details and feature list.

---

## Detailed Changes

### 1. Update Navigation (`Navbar.tsx`)

**Changes:**
- Add "Pricing" link to navigation
- Update nav links to reflect new sections

```
Nav Links:
- Features (links to #features)
- Pricing (links to /pricing)
- FAQ (links to #faq)
```

---

### 2. Redesign Hero Section (`Hero.tsx`)

**New Copy:**
- Headline: "Know Your Runway. Plan Your Future."
- Subheadline: "Connect QuickBooks or upload your cash flow statement. Get AI-powered forecasts and ask questions about your business runway."
- CTA: Keep "Try it Now" pill button with shine border

---

### 3. New QuickBooks Integration Banner (New Component)

**Create:** `src/components/landing/IntegrationBanner.tsx`

**Content:**
- QuickBooks logo badge
- Text: "Seamlessly connects with QuickBooks"
- Subtle green accent styling
- Positioned after Hero section

---

### 4. Redesign Features Section

**Replace current Features.tsx with two dedicated feature sections:**

#### Feature Section: Forecast (`ForecastFeature.tsx`)

| Element | Content |
|---------|---------|
| Title | "Forecast: Scenario Planning Made Simple" |
| Description | "Upload your cash flow statement and explore unlimited what-if scenarios. Ask questions like 'What if revenue drops 20%?' and see instant projections." |
| Bullets | - Upload Excel/CSV cash flow statements |
|         | - AI-powered scenario modeling |
|         | - Ask natural language questions |
|         | - 8-week forward projections |
| Visual | Placeholder for dashboard mockup (left side) |
| Layout | Image left, text right |

#### Feature Section: Runway (`RunwayFeature.tsx`)

| Element | Content |
|---------|---------|
| Title | "Runway: Your QuickBooks Financial Copilot" |
| Description | "Connect QuickBooks in one click. We pull your financial data automatically and calculate your runway. Then ask questions to see how decisions impact your future." |
| Bullets | - One-click QuickBooks connection |
|         | - Automatic data sync |
|         | - Real-time runway calculation |
|         | - Conversational Q&A about your finances |
| Visual | Placeholder for QuickBooks integration mockup (right side) |
| Layout | Text left, image right |

---

### 5. New "How It Works" Section (`HowItWorks.tsx`)

**Three-step process:**

| Step | Title | Description |
|------|-------|-------------|
| 1 | Connect or Upload | "Link QuickBooks or upload your cash flow spreadsheet" |
| 2 | See Your Runway | "Get instant visibility into your financial future" |
| 3 | Ask Questions | "Explore scenarios with natural language queries" |

**Design:** Horizontal cards with step numbers, icons, and brief text.

---

### 6. Pricing Preview Section (`PricingPreview.tsx`)

**Content:**
- Headline: "Simple, Transparent Pricing"
- Single plan card preview
- Price placeholder (to be filled in)
- "View Full Pricing" CTA button linking to /pricing

---

### 7. Update FAQ Section (`FAQ.tsx`)

**New Questions:**

| Question | Answer |
|----------|--------|
| "How does QuickBooks integration work?" | "Connect with one click using OAuth. We securely pull your financial data and keep it synced automatically. Your credentials are never stored." |
| "What's the difference between Forecast and Runway?" | "Forecast lets you upload any cash flow statement for scenario planning. Runway connects directly to QuickBooks for automatic, real-time financial tracking and Q&A." |
| "What questions can I ask about my runway?" | "Ask anything like 'When will I run out of cash?', 'Can I afford to hire in 3 months?', or 'What if I lose my biggest client?'" |
| "Is my financial data secure?" | "Yes. We use bank-level encryption, never store your QuickBooks credentials, and all data is processed in your isolated environment." |
| "What file formats does Forecast support?" | "We support Excel (.xlsx, .xls) and CSV files. Our AI automatically extracts and structures your cash flow data." |

---

### 8. Update Problem Section (`Problem.tsx`)

**New Pain Points (focused on small business owners):**

| Icon | Title | Description |
|------|-------|-------------|
| Clock | "Guessing your runway" | "Not knowing exactly how many months of cash you have left" |
| HelpCircle | "Scattered financial data" | "Jumping between QuickBooks, spreadsheets, and bank statements" |
| AlertTriangle | "Blind decision-making" | "Making hiring or spending decisions without seeing the impact" |
| TrendingDown | "Late cash warnings" | "Finding out about cash problems when it's too late to act" |

---

### 9. New Pricing Page (`src/pages/Pricing.tsx`)

**Structure:**
- Navbar (reused)
- Hero section with pricing headline
- Single plan card (large, centered)
- Feature list with checkmarks
- FAQ specific to pricing (optional)
- Footer (reused)

**Plan Card Content:**
- Plan name: "Zensus Pro" (or user's choice)
- Price: Placeholder for user to specify
- Billing: Monthly/Annual toggle (optional)
- Features list:
  - Unlimited forecasts
  - QuickBooks integration
  - Runway calculations
  - Conversational Q&A
  - Data export
  - Priority support

**CTA:** "Start Free Trial" or "Get Started"

---

### 10. Update Routes (`App.tsx`)

Add new route:
```tsx
<Route path="/pricing" element={<Pricing />} />
```

---

### 11. Update/Remove Components

| Component | Action |
|-----------|--------|
| `ProductShowcase.tsx` | Remove or repurpose - visuals will be in feature sections |
| `FounderQuote.tsx` | Keep or update with new quote about QuickBooks/runway |
| `Features.tsx` | Replace with `ForecastFeature.tsx` and `RunwayFeature.tsx` |

---

## File Summary

| Action | File |
|--------|------|
| Edit | `src/App.tsx` - Add pricing route |
| Edit | `src/pages/Index.tsx` - Update section order |
| Edit | `src/components/landing/Navbar.tsx` - Add pricing link |
| Edit | `src/components/landing/Hero.tsx` - New copy |
| Edit | `src/components/landing/Problem.tsx` - New pain points |
| Edit | `src/components/landing/FAQ.tsx` - New questions |
| Create | `src/components/landing/IntegrationBanner.tsx` |
| Create | `src/components/landing/ForecastFeature.tsx` |
| Create | `src/components/landing/RunwayFeature.tsx` |
| Create | `src/components/landing/HowItWorks.tsx` |
| Create | `src/components/landing/PricingPreview.tsx` |
| Create | `src/pages/Pricing.tsx` |
| Delete | `src/components/landing/Features.tsx` (replaced) |
| Optionally Edit | `src/components/landing/FounderQuote.tsx` |

---

## Visual Design Notes

- Maintain dark theme with green accents
- QuickBooks logo/badge should use official colors where possible
- Feature sections alternate layout (image left/right) for visual rhythm
- Use placeholder images for dashboard mockups (can be updated later)
- Pricing card should be prominent with subtle glow effect

---

## Questions for You

Before implementation, please confirm:

1. **What price point** should be shown on the pricing page? (e.g., $49/month)
2. **Should there be a free trial** mentioned? If so, how many days?
3. **Do you have new dashboard screenshots** for the Forecast and Runway features, or should I use placeholders?

