# Zensus Marketing Site Redesign (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Phase 1 marketing redesign approved in the 2026-04-17 spec. Swap the aesthetic to dark "Financial instrument" (Geist typography, signal-only accent), restructure the homepage around differentiators, add Security and Integrations pages, and land the "Talk to us" sales-led CTA across the site.

**Architecture:** React 18 plus TypeScript plus Vite plus Tailwind plus shadcn/ui plus React Router v6. Path alias `@` points at `src/`. Dark-mode palette drives Tailwind tokens via HSL CSS variables in `src/index.css`. A single `TalkToUsButton` component centralizes the primary CTA. Per-route meta tags use `react-helmet-async`. No test runner; verification is `npm run build`, `npm run lint` against a captured baseline, and manual browser walkthroughs on `http://localhost:8080`.

**Tech Stack:** React 18, TypeScript 5, Vite 5 (SWC), Tailwind CSS 3, shadcn/ui, React Router v6, Geist Sans plus Geist Mono (Google Fonts), `react-helmet-async` (new dependency), Lucide icons.

**Reference:** Design spec at `docs/superpowers/specs/2026-04-17-marketing-site-redesign-design.md`. Read it before starting any task; the spec owns rationale and design choices, this plan owns sequencing and exact file changes.

**CRITICAL project rules:**
- Never use em-dashes in any output. Use commas, periods, parentheses, or semicolons.
- Never `git push` without explicit user approval for that specific push. Local commits are fine.
- Keep commits small and focused per task.
- No test files are created; verify via `npm run build`, `npm run lint` against the baseline in `docs/lint-baseline.md`, and manual browser QA.

---

## Chunk 1: Foundation (typography, tokens, cleanup, shared CTA)

Lowest risk. Unblocks every downstream milestone.

### Task 1.1: Install `react-helmet-async`

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)

- [ ] **Step 1: Install the dependency**

Run: `npm install react-helmet-async`
Expected: installs without errors, `package.json` lists `react-helmet-async` in `dependencies`.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build completes.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add react-helmet-async for per-route meta tags"
```

### Task 1.2: Wrap app in `<HelmetProvider>`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add HelmetProvider wrapper**

Import `HelmetProvider` from `react-helmet-async` at the top. Wrap the existing `<QueryClientProvider>` with it:

```tsx
import { HelmetProvider } from "react-helmet-async";

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      {/* existing tree */}
    </QueryClientProvider>
  </HelmetProvider>
);
```

- [ ] **Step 2: Verify build plus lint**

Run: `npm run build && npm run lint`
Expected: build passes; lint shows 4 errors plus 7 warnings (unchanged baseline).

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "chore: wrap app in HelmetProvider for per-route meta"
```

### Task 1.3: Add Geist font loading to `index.html`

**Files:**
- Modify: `index.html`

Context: there is no Inter `<link>` in `index.html` today. Inter lives only in `tailwind.config.ts`. Geist needs fresh `<link>` tags.

- [ ] **Step 1: Add preconnect plus Google Fonts link**

In `index.html` `<head>`, before the Calendly widget link (around line 36), add:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: passes.

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`, open `http://localhost:8080`, check DevTools Network tab for two `.woff2` requests from `fonts.gstatic.com`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(fonts): load Geist Sans and Geist Mono from Google Fonts"
```

### Task 1.4: Update `tailwind.config.ts` fontFamily

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Swap Inter for Geist, add mono**

Replace the fontFamily block (around lines 16 to 19):

```ts
fontFamily: {
  sans: ["Geist", "system-ui", "sans-serif"],
  display: ["Geist", "system-ui", "sans-serif"],
  mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
},
```

- [ ] **Step 2: Build and visual check**

Run: `npm run build && npm run dev`. Confirm headlines and body render in Geist (rounder apex, tighter tracking than Inter).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(typography): switch from Inter to Geist, add Geist Mono family"
```

### Task 1.5: Update color tokens in `src/index.css`

**Files:**
- Modify: `src/index.css`

Spec Section 2 provides the HSL channel values.

- [ ] **Step 1: Update existing HSL variables in BOTH `:root` and `.dark` blocks**

`src/index.css` defines the same token names in both `:root` and `.dark`. Update both blocks so the palette stays consistent regardless of which class is active. Locate `:root { ... }` (usually near line 9) and `.dark { ... }` (usually near line 46) and update in each:

```css
--background: 240 7% 4%;     /* was 220 20% 4% */
--foreground: 36 27% 96%;    /* keep */
--primary: 142 71% 45%;      /* unchanged */
```

Add two new variables at the end of each token block:

```css
--surface-raised: 220 13% 9%;  /* #14161A, for bento tiles, scenario prompt */
--caution: 38 92% 50%;          /* amber, reserved for UI alerts */
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: passes, no visual regressions.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(tokens): Financial instrument palette with surface-raised and caution vars"
```

### Task 1.6: Remove `.text-gradient` from non-hero files

**Files:**
- Modify: `src/components/landing/Problem.tsx`
- Modify: `src/components/landing/HowItWorks.tsx`
- Modify: `src/components/landing/PricingPreview.tsx`
- Modify: `src/components/landing/FAQ.tsx`
- Modify: `src/components/landing/RunwayFeature.tsx` (template span around `{highlight}`)
- Modify: `src/pages/Pricing.tsx`
- Modify: `src/pages/Blog.tsx`

- [ ] **Step 1: Remove gradient spans**

In each file above, find `<span className="text-gradient">...</span>` inside a heading and remove the wrapping span, keeping the inner text. Example:

```diff
- You're making million-dollar decisions on{" "}
- <span className="text-gradient">gut feeling</span>
+ You're making million-dollar decisions on gut feeling
```

For `RunwayFeature.tsx`, the gradient is in the `RunwaySection` template around `{highlight}`. Remove the span but keep `{headline} {highlight}` rendering side by side. Panel headlines now render solid.

- [ ] **Step 2: Visual check**

Run: `npm run dev` and scroll the homepage plus visit `/pricing` and `/blog`. Every H2 should be solid foreground. Only the Hero H1 keeps the gradient on "about it."

- [ ] **Step 3: Build plus lint**

Run: `npm run build && npm run lint`
Expected: baseline unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Problem.tsx \
        src/components/landing/HowItWorks.tsx \
        src/components/landing/PricingPreview.tsx \
        src/components/landing/FAQ.tsx \
        src/components/landing/RunwayFeature.tsx \
        src/pages/Pricing.tsx \
        src/pages/Blog.tsx
git commit -m "refactor(landing): reserve gradient text for Hero H1 only"
```

### Task 1.7: Delete `Testimonials.tsx`

**Files:**
- Delete: `src/components/landing/Testimonials.tsx`

- [ ] **Step 1: Delete file**

Run: `rm src/components/landing/Testimonials.tsx`

- [ ] **Step 2: Confirm no references**

Run: `grep -r "Testimonials" src/ || echo "no references"`
Expected: "no references".

- [ ] **Step 3: Build plus lint**

Run: `npm run build && npm run lint`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/landing/
git commit -m "chore: remove unused Testimonials component with placeholder content"
```

### Task 1.8: Remove unused `runwayDashboard` import

**Files:**
- Modify: `src/components/landing/RunwayFeature.tsx`

- [ ] **Step 1: Remove the import line**

Delete `import runwayDashboard from "@/assets/runway-dashboard.png";` near line 3.

- [ ] **Step 2: Verify clean**

Run: `grep -n "runwayDashboard" src/components/landing/RunwayFeature.tsx || echo "clean"`
Expected: "clean".

- [ ] **Step 3: Build plus lint**

Run: `npm run build && npm run lint`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/RunwayFeature.tsx
git commit -m "chore: remove unused runwayDashboard import"
```

### Task 1.9: Build shared `TalkToUsButton` component

**Files:**
- Create: `src/lib/constants.ts`
- Create: `src/components/landing/TalkToUsButton.tsx`

- [ ] **Step 1: Create the constants file**

Write `src/lib/constants.ts`:

```ts
// Primary CTA destination. Update this one constant to change where "Talk to us" routes site-wide.
// Founder to confirm exact URL at implementation time.
export const TALK_TO_US_URL = "https://calendly.com/zensus-team";
export const SIGN_IN_URL = "https://app.zensus.app/login";
```

- [ ] **Step 2: Create the component**

Write `src/components/landing/TalkToUsButton.tsx`:

```tsx
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TALK_TO_US_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TalkToUsButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "ghost";
  className?: string;
  showArrow?: boolean;
}

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6",
  lg: "h-12 px-8",
};

export const TalkToUsButton = ({
  size = "md",
  variant = "primary",
  className,
  showArrow = true,
}: TalkToUsButtonProps) => (
  <Button
    asChild
    className={cn(
      "rounded-full font-semibold",
      variant === "primary"
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "bg-transparent hover:bg-primary/10 text-foreground",
      sizeClasses[size],
      className,
    )}
  >
    <a href={TALK_TO_US_URL} target="_blank" rel="noopener noreferrer">
      Talk to us
      {showArrow && <ArrowRight size={16} className="ml-2" />}
    </a>
  </Button>
);
```

- [ ] **Step 3: Build plus lint**

Run: `npm run build && npm run lint`
Expected: baseline unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants.ts src/components/landing/TalkToUsButton.tsx
git commit -m "feat(cta): add shared TalkToUsButton with centralized URL constant"
```

### Task 1.10: Capture lint baseline in repo

**Files:**
- Create: `docs/lint-baseline.md`

- [ ] **Step 1: Write the baseline doc**

Write `docs/lint-baseline.md` with:

```markdown
# Lint baseline

Captured 2026-04-17 during Chunk 1 of the marketing redesign.

**Expected:** 4 errors plus 7 warnings (11 problems).

Errors:
1. `src/components/landing/Navbar.tsx:8:14` no-explicit-any (drops after Milestone 4)
2. `src/components/ui/command.tsx:24:11` no-empty-object-type
3. `src/components/ui/textarea.tsx:5:18` no-empty-object-type
4. `tailwind.config.ts:111:13` no-require-imports

Warnings (7): react-refresh/only-export-components across shadcn UI files.

Milestone gate: `npm run lint` problem count must match this baseline on every PR through Milestone 3. After Milestone 4's Navbar rewrite the baseline drops to 3 errors plus 7 warnings.
```

- [ ] **Step 2: Commit**

```bash
git add docs/lint-baseline.md
git commit -m "docs: capture lint baseline for milestone gates"
```

### Task 1.11: Draft Milestone 7 QA checklist early

**Files:**
- Create: `docs/qa-checklist-phase1.md`

Per spec reviewer feedback, draft the QA checklist now so later milestones can validate against it as they ship.

- [ ] **Step 1: Write the checklist**

Write `docs/qa-checklist-phase1.md`:

```markdown
# Phase 1 QA checklist

Run before declaring any milestone complete.

## Every milestone
- [ ] `npm run build` passes
- [ ] `npm run lint` matches baseline in `docs/lint-baseline.md`
- [ ] No console errors on `/`, `/pricing`, `/blog`
- [ ] Existing redirects still work: `/privacy`, `/support`, `/features` redirect to `app.zensus.app`
- [ ] `/forecast` still redirects to `app.zensus.app/forecast`
- [ ] No em-dashes in any authored copy

## Homepage (after Milestone 3)
- [ ] Hero H1 reads as two sentences with gradient on "about it."
- [ ] Hero motion runs once on first visit, static on return (incognito for first-visit test)
- [ ] Rotating scenario prompt cycles through all four phrases
- [ ] Trust bar renders four logos plus four chip claims
- [ ] Problem section shows "Still pasting CSVs from three different tools" as pain point 2
- [ ] RunwayFeature section shows 3 panels (drill-down, scenarios, alerts) in order, alternating image sides
- [ ] Bento tile block renders 2x2 with 4 tiles
- [ ] HowItWorks shows 3 refreshed steps
- [ ] SecurityStrip renders with 3 columns, links to `/security`
- [ ] PricingPreview says "Pricing is tailored to your business", no dollar amount
- [ ] FinalCTABand renders between FAQ and Footer with Talk to us button

## Navigation (after Milestone 4)
- [ ] Desktop nav shows Product, Integrations, Plans, Security
- [ ] Sign in and Talk to us CTAs render on desktop
- [ ] Mobile hamburger opens sheet with same items plus sticky-bottom Talk to us
- [ ] "Book Demo" nav link removed
- [ ] Clicking Talk to us opens the destination URL in a new tab

## New pages (after Milestone 5)
- [ ] `/security` loads with all sections, no console errors
- [ ] `/integrations` loads with 4 integration cards
- [ ] `/integrations/plaid`, `/integrations/quickbooks`, `/integrations/hubspot`, `/integrations/slack` all load
- [ ] Each integration page renders all 7 content sections
- [ ] Talk to us CTA renders at bottom of every new page
- [ ] Each new page has correct `<title>` and meta description (DevTools, Elements tab)

## FAQ and Pricing (after Milestone 6)
- [ ] FAQ Pricing category has "How does pricing work?" instead of trial/cancel questions
- [ ] `/pricing` page shows "Pricing is tailored" messaging, no dollar amount
- [ ] No orphaned "trial" or "cancel anytime" language anywhere

## Reduced motion
- [ ] In DevTools, enable `prefers-reduced-motion: reduce`
- [ ] Hero skips typewriter and blur fade, renders final state immediately
- [ ] Rotating prompt still cycles but with opacity only, no translate

## Cross-device
- [ ] Desktop 1440 wide, 1024 wide
- [ ] Mobile 375 wide, 414 wide
- [ ] Every page renders without horizontal scroll on mobile
```

- [ ] **Step 2: Commit**

```bash
git add docs/qa-checklist-phase1.md
git commit -m "docs: draft Phase 1 QA checklist (used continuously through M7)"
```

---

## Chunk 2: Hero plus Trust bar

Highest-visibility change. Spec Section 7 and 8.

### Task 2.1: Create integration logo placeholder SVGs

**Files:**
- Create: `src/assets/integrations/plaid.svg`
- Create: `src/assets/integrations/quickbooks.svg`
- Create: `src/assets/integrations/hubspot.svg`
- Create: `src/assets/integrations/slack.svg`

Real brand marks come from media kits later. For now, simple placeholder squares with the letter.

- [ ] **Step 1: Create the directory and placeholders**

Run: `mkdir -p src/assets/integrations`

Write each SVG as a 40x40 rounded square with the first letter of the integration name. Example `plaid.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <rect width="40" height="40" rx="8" fill="#111827"/>
  <text x="20" y="26" text-anchor="middle" fill="#FFFFFF" font-family="Geist, system-ui" font-size="18" font-weight="700">P</text>
</svg>
```

Colors per integration: Plaid `#111827`, QuickBooks `#2CA01C`, HubSpot `#FF7A59`, Slack `#611f69` (or a gradient stand-in). Letters: P, Q, H, S.

- [ ] **Step 2: Commit**

```bash
git add src/assets/integrations/
git commit -m "feat(assets): placeholder SVG marks for Plaid, QuickBooks, HubSpot, Slack"
```

### Task 2.2: Extract `ScenarioPrompt` component

**Files:**
- Create: `src/components/landing/ScenarioPrompt.tsx`

- [ ] **Step 1: Create the component**

Write `src/components/landing/ScenarioPrompt.tsx`:

```tsx
import { cn } from "@/lib/utils";

const PHRASES = [
  "Can I afford to hire two engineers in Q3?",
  "When do we run out if our biggest client churns?",
  "What happens with 5% monthly churn?",
  "What if we raise prices 15% in January?",
];

interface ScenarioPromptProps {
  className?: string;
  visible?: boolean;
}

export const ScenarioPrompt = ({ className, visible = true }: ScenarioPromptProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-sm",
      "border-primary/30 bg-[hsl(var(--surface-raised))] text-foreground",
      "transition-all duration-500",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      className,
    )}
    aria-label="Example scenario prompts that Zensus can answer"
  >
    <span className="text-primary font-semibold text-base">&gt;</span>
    <div className="relative flex-1 h-5 overflow-hidden min-w-[20rem] max-w-[36rem]">
      {PHRASES.map((phrase, i) => (
        <span
          key={phrase}
          className="absolute inset-0 whitespace-nowrap"
          style={{
            animation: `scenario-rotate 20s infinite`,
            animationDelay: `${i * 5}s`,
          }}
        >
          {phrase}
        </span>
      ))}
    </div>
  </div>
);
```

Add the keyframe to `src/index.css` under the existing `@keyframes` block or in the `@layer components` section:

```css
@keyframes scenario-rotate {
  0%, 2% { opacity: 0; transform: translateY(4px); }
  5%, 23% { opacity: 1; transform: translateY(0); }
  25%, 28% { opacity: 0; transform: translateY(-4px); }
  100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes scenario-rotate {
    0%, 2% { opacity: 0; }
    5%, 23% { opacity: 1; }
    25%, 28% { opacity: 0; }
    100% { opacity: 0; }
  }
}
```

- [ ] **Step 2: Build plus lint**

Run: `npm run build && npm run lint`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/ScenarioPrompt.tsx src/index.css
git commit -m "feat(hero): extract ScenarioPrompt with 20s rotating phrase animation"
```

### Task 2.3: Rewrite `Hero.tsx` with hybrid motion

**Files:**
- Modify: `src/components/landing/Hero.tsx`

Context: the existing `Hero.tsx` imports `ShineBorder` from `@/components/ui/shine-border` and `ArrowRight` from `lucide-react`. The rewrite drops both (new hero uses `TalkToUsButton`, which brings its own arrow icon).

- [ ] **Step 1: Rewrite the component**

Replace the contents of `src/components/landing/Hero.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import { ScenarioPrompt } from "./ScenarioPrompt";
import { TalkToUsButton } from "./TalkToUsButton";

const H1_SENTENCE_1 = "Know exactly when your cash runs out.";
const H1_SENTENCE_2_PLAIN = "And exactly what to do ";
const H1_SENTENCE_2_ACCENT = "about it.";
const LOCAL_STORAGE_KEY = "zensus-hero-seen-v1";
const TYPE_SPEED_MS = 40;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Hero = () => {
  const [typedLength, setTypedLength] = useState(0);
  const [fadeInSentence2, setFadeInSentence2] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [animateOnMount] = useState(() => {
    if (typeof window === "undefined") return false;
    if (prefersReducedMotion()) return false;
    return !localStorage.getItem(LOCAL_STORAGE_KEY);
  });
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    if (!animateOnMount) {
      setTypedLength(H1_SENTENCE_1.length);
      setFadeInSentence2(true);
      setPromptVisible(true);
      return;
    }

    let i = 0;
    const type = () => {
      if (i <= H1_SENTENCE_1.length) {
        setTypedLength(i);
        i++;
        timeoutRefs.current.push(window.setTimeout(type, TYPE_SPEED_MS));
      } else {
        timeoutRefs.current.push(
          window.setTimeout(() => setFadeInSentence2(true), 50),
        );
        timeoutRefs.current.push(
          window.setTimeout(() => {
            setPromptVisible(true);
            localStorage.setItem(LOCAL_STORAGE_KEY, "1");
          }, 550),
        );
      }
    };
    type();

    return () => {
      timeoutRefs.current.forEach((t) => window.clearTimeout(t));
      timeoutRefs.current = [];
    };
  }, [animateOnMount]);

  const typedText = H1_SENTENCE_1.slice(0, typedLength);
  const showCaret = animateOnMount && typedLength < H1_SENTENCE_1.length;

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span>{typedText}</span>
            {showCaret && (
              <span
                aria-hidden="true"
                className="inline-block w-[2px] h-[0.9em] bg-primary ml-1 align-text-bottom animate-pulse"
              />
            )}
            <span
              className={`block transition-all duration-500 ${
                fadeInSentence2
                  ? "opacity-100 blur-0"
                  : "opacity-0 blur-md"
              }`}
              aria-hidden={!fadeInSentence2}
            >
              {H1_SENTENCE_2_PLAIN}
              <span className="text-gradient">{H1_SENTENCE_2_ACCENT}</span>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Connect your bank, QuickBooks, and HubSpot. Runway that matches the
            calendar, not a rough monthly average.
          </p>

          <div className="flex flex-col items-center gap-8">
            <TalkToUsButton size="lg" />
            <ScenarioPrompt visible={promptVisible} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Build plus lint**

Run: `npm run build && npm run lint`
Expected: baseline unchanged.

- [ ] **Step 3: Browser verify**

Run: `npm run dev`. Hard reload (Cmd-Shift-R) to clear localStorage. Watch the hero:
- Sentence 1 types in about 1.5s
- Sentence 2 fades in with blur
- Scenario prompt appears below
- Reload without clearing: no animation, final state immediately

- [ ] **Step 4: Reduced motion verify**

DevTools → Rendering → emulate CSS media `prefers-reduced-motion: reduce`. Reload. Hero renders static.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/Hero.tsx
git commit -m "feat(hero): hybrid typewriter plus blur-fade motion, Talk to us CTA, localStorage gate"
```

### Task 2.4: Build `TrustBar` component

**Files:**
- Create: `src/components/landing/TrustBar.tsx`

- [ ] **Step 1: Create component**

Write `src/components/landing/TrustBar.tsx`:

```tsx
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";

const LOGOS = [
  { src: plaidLogo, alt: "Plaid", label: "Plaid" },
  { src: quickbooksLogo, alt: "QuickBooks", label: "QuickBooks" },
  { src: hubspotLogo, alt: "HubSpot", label: "HubSpot" },
  { src: slackLogo, alt: "Slack", label: "Slack" },
];

const CHIPS = [
  "Bank-level OAuth",
  "AES-256-GCM at rest",
  "Account-level isolation",
  "Credentials never stored",
];

export const TrustBar = () => (
  <section className="border-y border-border bg-background/40 py-10">
    <div className="section-container flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
        {LOGOS.map((logo) => (
          <div key={logo.label} className="flex items-center gap-3 text-foreground/85">
            <img src={logo.src} alt={logo.alt} width={28} height={28} />
            <span className="font-medium tracking-tight">{logo.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
        {CHIPS.map((chip) => (
          <span key={chip} className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {chip}
          </span>
        ))}
      </div>
    </div>
  </section>
);
```

- [ ] **Step 2: Build plus lint**

Run: `npm run build && npm run lint`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/TrustBar.tsx
git commit -m "feat(trust-bar): logos and claim chips under the hero"
```

### Task 2.5: Wire Hero and TrustBar into `Index.tsx`

**Files:**
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Add import plus render**

`TrustBar` is a named export (see Task 2.4), so import it with curly braces. Add the import and render it between `<Hero />` and `<Problem />`:

```tsx
import { TrustBar } from "@/components/landing/TrustBar";
// other imports stay

<main>
  <Hero />
  <TrustBar />
  <Problem />
  {/* existing sections */}
</main>
```

- [ ] **Step 2: Build plus browser verify**

Run: `npm run dev`. Trust bar renders directly under the hero with four logos and four chips.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "feat(homepage): insert TrustBar under Hero"
```

---

## Chunk 3: Homepage rearchitecture

Spec sections 9 through 16.

### Task 3.1: Rewrite Problem pain point index 1

**Files:**
- Modify: `src/components/landing/Problem.tsx`

- [ ] **Step 1: Update the second pain point**

In the `painPoints` array (around line 3), replace index 1:

```tsx
{
  icon: HelpCircle,
  title: "Still pasting CSVs from three different tools",
  description: "Every export is stale the moment it downloads. Zensus pulls live from every source, no manual imports ever",
},
```

- [ ] **Step 2: Build plus lint plus browser verify**

Run: `npm run dev`. The second pain point card should now show "Still pasting CSVs...".

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Problem.tsx
git commit -m "refactor(landing): surface CSV-paste anti-pattern in Problem block"
```

### Task 3.2: Reorder and prune `RunwayFeature` sections, scrub em-dashes

**Files:**
- Modify: `src/components/landing/RunwayFeature.tsx`

The current array (after prior session edits) has 5 entries. Prune to 3 (Drill-down, Scenarios, Alerts) and scrub every em-dash in retained content. Project rule: no em-dashes anywhere.

**Note on em-dashes in this task:** the "before" snippets below contain literal em-dash characters because they quote text currently present in `RunwayFeature.tsx`. Those characters must match exactly so the executing subagent can find and replace them. The "after" snippets contain no em-dashes. This is the only task in the plan where em-dash characters appear verbatim.

- [ ] **Step 1: Reorder, prune, and drop unused imports**

Target final sections array (index 0 through 2) in order: Drill down, Run scenarios, Get alerted.

Remove the Connect (index 0) and Zero-cash (index 1) entries entirely. Swap the remaining order so Scenarios comes before Alerts. Drop the now-unused `runwayConnect` and `runwayZerocash` imports at the top of the file.

- [ ] **Step 2: Rewrite retained content to remove em-dashes**

Four em-dashes survive on retained panels and the shared alt text. Apply these exact rewrites:

Line 61 (alt text inside `RunwaySection` template): replace

```tsx
alt={headline + " " + highlight + " — Zensus cash flow forecasting"}
```

with

```tsx
alt={`${headline} ${highlight}. Zensus cash flow forecasting.`}
```

Alerts panel (now index 2) description: replace

```
Set your cash floor. Zensus watches your 30-day projection and pings Slack the moment it crosses the line — then re-alerts if the breach moves earlier or your minimum balance drops 10%.
```

with

```
Set your cash floor. Zensus watches your 30-day projection and pings Slack the moment it crosses the line. If the breach moves earlier or your minimum balance drops 10%, you get re-alerted.
```

Alerts panel bullet 2: replace

```
Re-alerts on material change — a week earlier or a 10% dip in minimum balance
```

with

```
Re-alerts on material change (a week earlier or a 10% dip in minimum balance)
```

Scenarios panel (now index 1) bullet 1: replace

```
Stack multiple assumptions — hiring, churn, pricing — in a single conversation
```

with

```
Stack multiple assumptions (hiring, churn, pricing) in a single conversation
```

- [ ] **Step 3: Verify no em-dashes remain**

Run: `grep -n "—" src/components/landing/RunwayFeature.tsx || echo "clean"`
Expected: "clean".

- [ ] **Step 4: Build plus browser verify**

Run: `npm run dev`. Homepage now shows 3 feature panels: drill-down, scenarios, alerts. No connect or zero-cash panels. Alt text on images reads without em-dashes.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/RunwayFeature.tsx
git commit -m "refactor(landing): prune RunwayFeature to 3 panels, scrub em-dashes from retained copy"
```

### Task 3.3: Create `Bento` component

**Files:**
- Create: `src/components/landing/Bento.tsx`

- [ ] **Step 1: Create component**

Write `src/components/landing/Bento.tsx`:

```tsx
import { Link2, Zap, Target, Shuffle, LucideIcon } from "lucide-react";

interface Tile {
  icon: LucideIcon;
  title: string;
  body: string;
}

const TILES: Tile[] = [
  {
    icon: Link2,
    title: "Connect in 60s",
    body: "OAuth to Plaid, QuickBooks, HubSpot. No spreadsheets, no CSV uploads.",
  },
  {
    icon: Zap,
    title: "Real-time webhook sync",
    body: "The moment a transaction clears, your runway updates.",
  },
  {
    icon: Target,
    title: "Zero-cash date",
    body: "The exact day you run out, recalculated live.",
  },
  {
    icon: Shuffle,
    title: "Vendor normalization",
    body: "Stripe payouts, ACH transfers, and card purchases all reconcile cleanly.",
  },
];

const Bento = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {TILES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl p-6 bg-[hsl(var(--surface-raised))] border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Bento;
```

- [ ] **Step 2: Build plus lint**

Run: `npm run build && npm run lint`

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Bento.tsx
git commit -m "feat(landing): Bento block with 4 table-stakes tiles"
```

### Task 3.4: Refresh `HowItWorks` copy

**Files:**
- Modify: `src/components/landing/HowItWorks.tsx`

- [ ] **Step 1: Update the `steps` array**

Replace the three step objects with:

```tsx
{
  number: "1",
  icon: Link,
  title: "Connect your data",
  description: "OAuth to Plaid, QuickBooks, or HubSpot. All three if you want. No uploads."
},
{
  number: "2",
  icon: BarChart3,
  title: "See your runway live",
  description: "Zero-cash date, day-by-day drill-down, and scenario chat ready in 60 seconds."
},
{
  number: "3",
  icon: SlidersHorizontal,
  title: "Set your alert threshold",
  description: "Slack pings you the moment your 30-day projection crosses the line."
}
```

- [ ] **Step 2: Build plus visual verify**

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/HowItWorks.tsx
git commit -m "refactor(landing): refresh HowItWorks copy for sales-led flow"
```

### Task 3.5: Create `SecurityStrip` component

**Files:**
- Create: `src/components/landing/SecurityStrip.tsx`

- [ ] **Step 1: Create component**

Write `src/components/landing/SecurityStrip.tsx`:

```tsx
import { Link } from "react-router-dom";
import { Lock, Shield, KeyRound, LucideIcon } from "lucide-react";

interface Column {
  icon: LucideIcon;
  title: string;
  body: string;
}

const COLUMNS: Column[] = [
  {
    icon: Lock,
    title: "Encryption",
    body: "AES-256-GCM at rest. TLS in transit across every data path.",
  },
  {
    icon: Shield,
    title: "Isolation",
    body: "Every database query is filtered by account. No cross-account access, ever.",
  },
  {
    icon: KeyRound,
    title: "Never stored",
    body: "Bank and QuickBooks credentials live in Plaid and Intuit OAuth. Zensus holds tokens, not passwords.",
  },
];

const SecurityStrip = () => (
  <section className="section-padding bg-background border-t border-border">
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
        {COLUMNS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link to="/security" className="text-sm text-primary hover:underline">
          See our full security posture
        </Link>
      </div>
    </div>
  </section>
);

export default SecurityStrip;
```

- [ ] **Step 2: Build plus lint**

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/SecurityStrip.tsx
git commit -m "feat(landing): SecurityStrip block with 3 columns and link to /security"
```

### Task 3.6: Rewrite `PricingPreview` to hidden-amount

**Files:**
- Modify: `src/components/landing/PricingPreview.tsx`

- [ ] **Step 1: Replace component body**

Replace the file contents:

```tsx
import { TalkToUsButton } from "./TalkToUsButton";

const PricingPreview = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          Pricing is tailored to your business
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Every Zensus account is configured around your data sources and your
          team shape. We will walk you through what it looks like for you on a
          call.
        </p>
        <TalkToUsButton size="lg" />
      </div>
    </div>
  </section>
);

export default PricingPreview;
```

- [ ] **Step 2: Build plus browser verify**

Confirm no $199 or "Get Started" appears on the homepage.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/PricingPreview.tsx
git commit -m "refactor(pricing): homepage preview becomes Talk-to-us block, no dollar amount"
```

### Task 3.7: Build `FinalCTABand`

**Files:**
- Create: `src/components/landing/FinalCTABand.tsx`

- [ ] **Step 1: Create component**

Write `src/components/landing/FinalCTABand.tsx`:

```tsx
import { TalkToUsButton } from "./TalkToUsButton";

const FinalCTABand = () => (
  <section className="section-padding bg-secondary/30">
    <div className="section-container text-center max-w-2xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        Ready to see your real runway?
      </h2>
      <p className="text-lg text-muted-foreground mb-8">
        Connect your data in 60 seconds. We will walk you through it on the call.
      </p>
      <TalkToUsButton size="lg" />
    </div>
  </section>
);

export default FinalCTABand;
```

- [ ] **Step 2: Build plus lint**

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/FinalCTABand.tsx
git commit -m "feat(landing): FinalCTABand between FAQ and Footer"
```

### Task 3.8: Update `Index.tsx` composition

**Files:**
- Modify: `src/pages/Index.tsx`

**Important:** keep the existing `PageSkeleton` loading gate (300ms timer) and the hash-scroll `useEffect` (scrolls to `#section` from URL on mount) intact. Only the `<main>` children change. Do not overwrite the full file.

- [ ] **Step 1: Reorder the main children**

Inside the existing `<main>` body, replace the section children with:

```tsx
import TrustBar from "@/components/landing/TrustBar";
import Bento from "@/components/landing/Bento";
import SecurityStrip from "@/components/landing/SecurityStrip";
import FinalCTABand from "@/components/landing/FinalCTABand";
// existing imports

<main>
  <Hero />
  <TrustBar />
  <Problem />
  <RunwayFeature />
  <Bento />
  <HowItWorks />
  <SecurityStrip />
  <PricingPreview />
  <FAQ />
  <FinalCTABand />
</main>
```

`TrustBar` is a named export; import accordingly (`import { TrustBar } from "@/components/landing/TrustBar"`).

- [ ] **Step 2: Build plus walkthrough**

Run: `npm run dev`. Scroll the homepage and confirm the order matches the spec table in Section 9.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "feat(homepage): full reorder per Phase 1 flow"
```

---

## Chunk 4: Navigation restructure

Spec Section 5 and 19.

### Task 4.1: Rewrite `Navbar.tsx`

**Files:**
- Modify: `src/components/landing/Navbar.tsx`

Full rewrite. Replace the entire file contents with the component below. This drops the `openCalendly` helper, the `Calendar` icon import, the `any` cast (which resolves the `no-explicit-any` lint error), and the old nav links array. The logo mark and scroll-aware transparent nav background both stay.

- [ ] **Step 1: Replace file contents**

Write `src/components/landing/Navbar.tsx`:

```tsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TalkToUsButton } from "./TalkToUsButton";
import { SIGN_IN_URL } from "@/lib/constants";
import zensusLogo from "@/assets/zensus-logo.png";

interface NavLink {
  href: string;
  label: string;
  isRoute: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/#features", label: "Product", isRoute: false },
  { href: "/integrations", label: "Integrations", isRoute: true },
  { href: "/pricing", label: "Plans", isRoute: true },
  { href: "/security", label: "Security", isRoute: true },
];

const linkClass =
  "text-sm text-muted-foreground hover:text-foreground transition-colors";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={zensusLogo}
              alt="Zensus logo"
              className="h-8 w-8 rounded-lg"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold text-foreground">Zensus</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) =>
              link.isRoute ? (
                <Link key={link.href} to={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ),
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <a href={SIGN_IN_URL} target="_blank" rel="noopener noreferrer">
                Sign in
              </a>
            </Button>
            <TalkToUsButton size="sm" />
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="flex flex-col gap-4 py-5 pb-24">
              {NAV_LINKS.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={linkClass}
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className={linkClass}
                    onClick={close}
                  >
                    {link.label}
                  </a>
                ),
              )}
              <Button asChild variant="ghost" className="justify-start px-0">
                <a
                  href={SIGN_IN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                >
                  Sign in
                </a>
              </Button>
            </div>
            <div className="fixed left-0 right-0 bottom-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border">
              <TalkToUsButton size="lg" className="w-full justify-center" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

- [ ] **Step 2: Build plus lint**

Run: `npm run build && npm run lint`
Expected: 3 errors plus 7 warnings. The Navbar `no-explicit-any` error is gone because `openCalendly` and its `(window as any)` cast were removed.

- [ ] **Step 3: Browser verify on desktop plus mobile**

Run: `npm run dev`. Desktop: confirm 4 primary links (Product, Integrations, Plans, Security), Sign in ghost button, and Talk to us pill. Mobile (DevTools device emulator at 375 wide): hamburger opens sheet, list scrolls with sticky Talk to us button pinned to the bottom of the viewport.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Navbar.tsx
git commit -m "feat(nav): Integrations-led nav, Talk to us CTA, mobile sticky button, drop Book Demo"
```

### Task 4.2: Update lint baseline doc

**Files:**
- Modify: `docs/lint-baseline.md`

- [ ] **Step 1: Bump to new baseline**

After Task 4.1 drops the Navbar error, update the doc to say expected is 3 errors plus 7 warnings, and remove the Navbar entry from the errors list.

- [ ] **Step 2: Commit**

```bash
git add docs/lint-baseline.md
git commit -m "docs: lint baseline drops to 3 errors after Navbar rewrite"
```

### Task 4.3: Add Calendly link to Footer

**Files:**
- Modify: `src/components/landing/Footer.tsx`

The old `openCalendly` helper in Navbar is gone (see Task 4.1). The Calendly link relocates to the Footer as a small "Book a call with the team" entry alongside Privacy and Terms.

- [ ] **Step 1: Add the entry**

Update the `legalLinks` array in `src/components/landing/Footer.tsx` (top of the component) to include the Calendly entry first, so the order reads "Book a call, Privacy, Terms":

```tsx
const legalLinks = [
  { label: "Book a call", href: "https://calendly.com/hello-zensus/introcall" },
  { label: "Privacy", href: "https://app.zensus.app/privacy" },
  { label: "Terms", href: "https://app.zensus.app/terms" },
];
```

The existing `<a>` rendering logic already opens external links in a new tab, so no JSX changes are needed.

- [ ] **Step 2: Browser verify**

Run: `npm run dev`. Scroll to footer. Confirm "Book a call" renders before Privacy and Terms, opens Calendly in a new tab.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Footer.tsx
git commit -m "feat(footer): add Book a call with the team entry"
```

---

## Chunk 5: New pages (Security, Integrations hub, 4 integration detail pages)

Spec Section 20. Content authoring is the dominant cost here (28 content blocks).

### Task 5.1: Create `IntegrationPage` shared component

**Files:**
- Create: `src/components/integrations/IntegrationPage.tsx`

- [ ] **Step 1: Create directory plus component**

Run: `mkdir -p src/components/integrations`

Write `src/components/integrations/IntegrationPage.tsx`:

```tsx
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";

export interface IntegrationSection {
  heading: string;
  body: React.ReactNode;
}

interface IntegrationPageProps {
  slug: string;
  displayName: string;
  tagline: string;
  logoSrc: string;
  metaTitle: string;
  metaDescription: string;
  sections: IntegrationSection[];
}

export const IntegrationPage = ({
  displayName,
  tagline,
  logoSrc,
  metaTitle,
  metaDescription,
  sections,
}: IntegrationPageProps) => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <img src={logoSrc} alt={displayName} width={56} height={56} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Connect your {displayName} with Zensus
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-12">{tagline}</p>

        {sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              {section.body}
            </div>
          </section>
        ))}

        <div className="mt-12 text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);
```

- [ ] **Step 2: Build plus lint**

- [ ] **Step 3: Commit**

```bash
git add src/components/integrations/IntegrationPage.tsx
git commit -m "feat(integrations): shared IntegrationPage layout component"
```

### Task 5.2: Create `/security` page

**Files:**
- Create: `src/pages/Security.tsx`

Copy is written inline below. Do not fabricate additional claims beyond what the audit verified. Synthetic API monitoring is NOT asserted here per spec guidance (verify before publishing).

- [ ] **Step 1: Write the page**

Write `src/pages/Security.tsx`:

```tsx
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const Security = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Security at Zensus</title>
      <meta
        name="description"
        content="How Zensus protects your financial data. AES-256-GCM at rest, bank-level OAuth via Plaid and Intuit, account-level isolation, and zero AI training on your data."
      />
      <meta property="og:title" content="Security at Zensus" />
      <meta
        property="og:description"
        content="How Zensus protects your financial data. Bank-level OAuth, encryption at rest, account-level isolation."
      />
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          How Zensus handles your financial data
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Zensus is built for founders who need real-time cash forecasting
          across multiple financial tools. That access is serious. Here is
          exactly what we hold, what we do not, and how it is protected.
        </p>

        <Section title="Data flow at a glance">
          <p>
            You connect Plaid, QuickBooks, or HubSpot through OAuth. Those
            providers hold the credentials. Zensus receives scoped OAuth tokens,
            pulls the data we are authorized to read, and stores only what we
            need to compute your runway. Data moves over TLS. At rest, it
            lives on encrypted AWS infrastructure.
          </p>
        </Section>

        <Section title="What Zensus stores">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              OAuth tokens for each connected provider, encrypted at rest with
              AES-256-GCM.
            </li>
            <li>
              Transactions and balances within the sync window required to
              project your runway.
            </li>
            <li>Scenario chat history for your account only.</li>
            <li>Derived runway projections and alert state.</li>
          </ul>
        </Section>

        <Section title="What Zensus never stores">
          <ul className="list-disc pl-5 space-y-2">
            <li>Bank or QuickBooks passwords. Plaid and Intuit hold those.</li>
            <li>Payment card details.</li>
            <li>
              Raw transactions outside the sync window needed for projections.
            </li>
          </ul>
        </Section>

        <Section title="Account-level isolation">
          <p>
            Every database query is filtered by user ID. Zensus staff cannot
            access your data without an explicit authorization path that is
            audited. Cross-account access is not possible by design, not just
            by policy.
          </p>
        </Section>

        <Section title="CI security">
          <p>
            Our backend repository runs Semgrep static analysis on every
            commit. Gitleaks scans for accidentally committed credentials and
            blocks PRs that introduce them. Dependencies are kept current
            through automated vulnerability alerts.
          </p>
        </Section>

        <Section title="AI and your data">
          <p>
            Your data never trains any AI model. When you run a scenario, your
            data is sent per request to Claude, analyzed, and the conversation
            returns to you. No fine-tuning, no memory, no training, no data
            crossing into other customer accounts.
          </p>
        </Section>

        <Section title="Compliance posture">
          <p>
            Zensus is not yet SOC 2 certified. We are working toward it. In
            the meantime, our data protection and access control practices are
            documented and reviewable on request. If your procurement process
            needs specific evidence, talk to us and we will share what we
            have.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Security questions, disclosures, or procurement inquiries go to{" "}
            <a
              href="mailto:security@zensus.app"
              className="text-primary hover:underline"
            >
              security@zensus.app
            </a>
            . Response time is typically within one business day.
          </p>
        </Section>

        <div className="mt-12 text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Security;
```

- [ ] **Step 2: Add route in `src/App.tsx`**

Import `Security` and add above the catch-all route:

```tsx
<Route path="/security" element={<Security />} />
```

- [ ] **Step 3: Build plus browser verify**

Run: `npm run dev`. Visit `http://localhost:8080/security`. Confirm all sections render, title reads "Security at Zensus" in the browser tab, Talk to us button at the bottom works.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Security.tsx src/App.tsx
git commit -m "feat(security): add /security page with 9 detailed sections"
```

### Task 5.3: Create `/integrations` index page

**Files:**
- Create: `src/pages/Integrations.tsx`

- [ ] **Step 1: Write the page**

Write `src/pages/Integrations.tsx`:

```tsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";

interface Card {
  slug: string;
  name: string;
  blurb: string;
  logo: string;
}

const CARDS: Card[] = [
  {
    slug: "plaid",
    name: "Plaid",
    blurb: "Live bank transactions and balances through bank-level OAuth. Real-time sync, no CSVs.",
    logo: plaidLogo,
  },
  {
    slug: "quickbooks",
    name: "QuickBooks",
    blurb: "Expenses, invoices, and AR/AP straight from your books. Real-time sync via Intuit OAuth.",
    logo: quickbooksLogo,
  },
  {
    slug: "hubspot",
    name: "HubSpot",
    blurb: "Deals and subscriptions feed your runway. Annual and quarterly contracts hit on real dates.",
    logo: hubspotLogo,
  },
  {
    slug: "slack",
    name: "Slack",
    blurb: "Cash-crunch alerts, snooze, and threshold adjustments from Slack. No dashboard trip required.",
    logo: slackLogo,
  },
];

const CHIPS = [
  "Bank-level OAuth",
  "AES-256-GCM at rest",
  "Account-level isolation",
  "Credentials never stored",
];

const Integrations = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Integrations · Zensus</title>
      <meta
        name="description"
        content="Every number on Zensus comes from a live integration. Plaid, QuickBooks, HubSpot, Slack. No CSV uploads, no manual data entry."
      />
      <meta property="og:title" content="Integrations · Zensus" />
      <meta
        property="og:description"
        content="Live integrations to Plaid, QuickBooks, HubSpot, and Slack. No manual data entry."
      />
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="section-container max-w-4xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Every number on Zensus comes from a live integration
        </h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
          No CSV uploads, no spreadsheets, no manual data entry. Every dollar
          you see on Zensus was pulled live through OAuth from the tools you
          already use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {CARDS.map((card) => (
            <Link
              key={card.slug}
              to={`/integrations/${card.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={card.logo} alt="" width={36} height={36} />
                <h2 className="text-lg font-semibold text-foreground">
                  {card.name}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {card.blurb}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-primary">
                Learn more
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground mb-12">
          {CHIPS.map((chip) => (
            <span key={chip} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {chip}
            </span>
          ))}
        </div>

        <div className="text-center">
          <TalkToUsButton size="lg" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Integrations;
```

- [ ] **Step 2: Add route in `src/App.tsx`**

```tsx
<Route path="/integrations" element={<Integrations />} />
```

- [ ] **Step 3: Browser verify**

Visit `http://localhost:8080/integrations`. Four cards render with integration logos and blurbs; each clicks through to its detail page (detail pages land in Tasks 5.4 through 5.7). Chips render below.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Integrations.tsx src/App.tsx
git commit -m "feat(integrations): /integrations index with 4 integration cards and trust chips"
```

### Task 5.4: Create `/integrations/plaid` detail page

**Files:**
- Create: `src/pages/integrations/Plaid.tsx`

- [ ] **Step 1: Create the thin wrapper**

Run: `mkdir -p src/pages/integrations`

Write `src/pages/integrations/Plaid.tsx`:

```tsx
import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import plaidLogo from "@/assets/integrations/plaid.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: <p>Bank transactions, account balances, and account names across every institution you connect through Plaid.</p>,
  },
  {
    heading: "What Zensus never reads",
    body: <p>Personal identifying information, routing numbers, or your bank password. Plaid holds those; Zensus only sees the data you authorize.</p>,
  },
  {
    heading: "How it works",
    body: <p>Open Plaid Link from your Zensus settings. Authenticate with your bank. Plaid returns an OAuth token that Zensus stores encrypted with AES-256-GCM. Webhooks keep transactions fresh in real time.</p>,
  },
  {
    heading: "How to disconnect",
    body: <p>Visit Settings -&gt; Integrations inside the Zensus app and click Disconnect Plaid. This revokes the OAuth token on Plaid's side and removes all synced data from Zensus within 24 hours.</p>,
  },
  {
    heading: "Security specifics",
    body: <p>Plaid OAuth tokens are encrypted at rest. Zensus never stores your bank credentials. Disconnecting is one click and honored immediately.</p>,
  },
];

const PlaidIntegration = () => (
  <IntegrationPage
    slug="plaid"
    displayName="bank via Plaid"
    tagline="Live bank transactions, account balances, and real-time sync. No CSV uploads, no brittle scrapers."
    logoSrc={plaidLogo}
    metaTitle="Plaid integration · Zensus"
    metaDescription="Connect your bank to Zensus via Plaid. Real-time transaction sync, bank-level OAuth, no credentials stored."
    sections={sections}
  />
);

export default PlaidIntegration;
```

- [ ] **Step 2: Add route in `App.tsx`**

```tsx
<Route path="/integrations/plaid" element={<PlaidIntegration />} />
```

- [ ] **Step 3: Browser verify**

- [ ] **Step 4: Commit**

```bash
git add src/pages/integrations/Plaid.tsx src/App.tsx
git commit -m "feat(integrations): /integrations/plaid detail page"
```

### Task 5.5: Create `/integrations/quickbooks` detail page

**Files:**
- Create: `src/pages/integrations/QuickBooks.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the page**

Write `src/pages/integrations/QuickBooks.tsx`:

```tsx
import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <p>
        Expenses, invoices, company info, and your accounts payable and
        receivable. We pull the same data your bookkeeper sees inside
        QuickBooks.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Your QuickBooks password, your credit card details, or any user data
        outside the QuickBooks Online scopes you authorize during OAuth.
      </p>
    ),
  },
  {
    heading: "How it works",
    body: (
      <p>
        You authorize QuickBooks through Intuit OAuth 2.0. Access tokens are
        short-lived (one hour). Refresh tokens live 100 days. Zensus encrypts
        both at rest with AES-256-GCM and refreshes transparently.
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Inside the Zensus app go to Settings, Integrations, and disconnect
        QuickBooks. Zensus revokes the refresh token with Intuit immediately
        and removes synced data within 24 hours. You can also revoke directly
        from your Intuit account.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        OAuth tokens are encrypted at rest. Your QuickBooks credentials
        remain with Intuit; Zensus never sees them. Token rotation happens
        automatically without interrupting sync.
      </p>
    ),
  },
];

const QuickBooksIntegration = () => (
  <IntegrationPage
    slug="quickbooks"
    displayName="QuickBooks"
    tagline="Live expenses, invoices, and AR/AP from your books. Real-time through Intuit OAuth."
    logoSrc={quickbooksLogo}
    metaTitle="QuickBooks integration · Zensus"
    metaDescription="Connect QuickBooks to Zensus via Intuit OAuth. Live expense and AR/AP sync, AES-256-GCM encrypted tokens, credentials never stored."
    sections={sections}
  />
);

export default QuickBooksIntegration;
```

- [ ] **Step 2: Add route in `src/App.tsx`**

```tsx
<Route path="/integrations/quickbooks" element={<QuickBooksIntegration />} />
```

- [ ] **Step 3: Browser verify**

- [ ] **Step 4: Commit**

```bash
git add src/pages/integrations/QuickBooks.tsx src/App.tsx
git commit -m "feat(integrations): /integrations/quickbooks detail page"
```

### Task 5.6: Create `/integrations/hubspot` detail page

**Files:**
- Create: `src/pages/integrations/HubSpot.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the page**

Write `src/pages/integrations/HubSpot.tsx`:

```tsx
import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import hubspotLogo from "@/assets/integrations/hubspot.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads",
    body: (
      <p>
        Deals and subscriptions from your HubSpot pipeline. Zensus maps each
        deal to a projected billing record so your runway reflects when
        revenue actually lands, including annual and quarterly contract
        terms.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Contact or company data outside the deals you authorize. Emails,
        chat logs, and marketing data stay in HubSpot.
      </p>
    ),
  },
  {
    heading: "How it works",
    body: (
      <p>
        You authorize HubSpot through OAuth 2.0. Zensus pulls deal data on
        connection and stays current via HubSpot webhooks. Multi-currency
        deals are stored with their native currency; no conversion is
        applied, so your runway respects the currency you signed the deal
        in.
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Inside the Zensus app go to Settings, Integrations, and disconnect
        HubSpot. Zensus revokes the OAuth token and removes synced deal data
        within 24 hours. You can also revoke from your HubSpot developer
        account.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        OAuth tokens are encrypted at rest with AES-256-GCM. HubSpot
        credentials stay with HubSpot; Zensus never sees them.
      </p>
    ),
  },
];

const HubSpotIntegration = () => (
  <IntegrationPage
    slug="hubspot"
    displayName="HubSpot"
    tagline="Deals and subscriptions feed your runway. Annual and quarterly contracts hit on their real dates, not smeared into MRR."
    logoSrc={hubspotLogo}
    metaTitle="HubSpot integration · Zensus"
    metaDescription="Connect HubSpot to Zensus via OAuth. Deals and subscriptions feed real-time runway projections that respect contract terms and currency."
    sections={sections}
  />
);

export default HubSpotIntegration;
```

- [ ] **Step 2: Add route in `src/App.tsx`**

```tsx
<Route path="/integrations/hubspot" element={<HubSpotIntegration />} />
```

- [ ] **Step 3: Browser verify**

- [ ] **Step 4: Commit**

```bash
git add src/pages/integrations/HubSpot.tsx src/App.tsx
git commit -m "feat(integrations): /integrations/hubspot detail page"
```

### Task 5.7: Create `/integrations/slack` detail page

**Files:**
- Create: `src/pages/integrations/Slack.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the page**

Write `src/pages/integrations/Slack.tsx`:

```tsx
import { IntegrationPage, IntegrationSection } from "@/components/integrations/IntegrationPage";
import slackLogo from "@/assets/integrations/slack.svg";

const sections: IntegrationSection[] = [
  {
    heading: "What Zensus reads and writes",
    body: (
      <p>
        Zensus reads the list of channels you authorize so it can post cash
        alerts into them. Zensus writes interactive Block Kit messages with
        buttons to snooze the alert or adjust your threshold.
      </p>
    ),
  },
  {
    heading: "What Zensus never reads",
    body: (
      <p>
        Channel message contents, direct messages, user presence, or any
        other workspace data. Slack scopes are restricted to the minimum
        needed to post alerts.
      </p>
    ),
  },
  {
    heading: "How it works",
    body: (
      <p>
        You install the Zensus Slack app into your workspace through OAuth.
        Pick a channel for alerts and set a cash threshold. Zensus watches
        your 30-day projection and posts to that channel when the line is
        crossed. Re-alerts fire on material change (a week earlier or a 10%
        dip in minimum balance).
      </p>
    ),
  },
  {
    heading: "How to disconnect",
    body: (
      <p>
        Uninstall the Zensus app from your Slack workspace, or disconnect
        Slack from Settings, Integrations inside the Zensus app. Either path
        revokes the OAuth token and stops alerts immediately.
      </p>
    ),
  },
  {
    heading: "Security specifics",
    body: (
      <p>
        OAuth tokens and signing secrets are encrypted at rest with
        AES-256-GCM. Slack credentials stay with Slack. Workspace
        administrators retain full control and can revoke at any time.
      </p>
    ),
  },
];

const SlackIntegration = () => (
  <IntegrationPage
    slug="slack"
    displayName="Slack"
    tagline="Cash-crunch alerts with snooze and threshold controls, delivered where your team already works."
    logoSrc={slackLogo}
    metaTitle="Slack integration · Zensus"
    metaDescription="Post Zensus cash-crunch alerts into Slack. Interactive Block Kit messages with snooze and threshold controls, OAuth-based, revocable anytime."
    sections={sections}
  />
);

export default SlackIntegration;
```

- [ ] **Step 2: Add route in `src/App.tsx`**

```tsx
<Route path="/integrations/slack" element={<SlackIntegration />} />
```

- [ ] **Step 3: Browser verify all four detail pages plus index**

Visit all four URLs (`/integrations`, `/integrations/plaid`, `/integrations/quickbooks`, `/integrations/hubspot`, `/integrations/slack`). Each renders its content, page titles are distinct, Talk to us button appears at the bottom of each detail page.

- [ ] **Step 4: Commit**

```bash
git add src/pages/integrations/Slack.tsx src/App.tsx
git commit -m "feat(integrations): /integrations/slack detail page"
```

---

## Chunk 6: FAQ plus Pricing page rewrites

Spec Section 17 and 18.

### Task 6.1: Update FAQ Pricing category

**Files:**
- Modify: `src/components/landing/FAQ.tsx`

- [ ] **Step 1: Swap the "Can I cancel anytime?" question**

Find the `category: "Pricing"` group in `faqGroups`. Replace the single item with:

```tsx
{
  question: "How does pricing work?",
  answer: "Zensus pricing is tailored to your business size and data volume. We will walk you through what it looks like for you on the call."
}
```

- [ ] **Step 2: Verify the Alerts FAQ survives**

The Alerts FAQ entry added in a prior session lives under the Product category. Grep to confirm it is still there:

```bash
grep -n "Can I get notified when I'm running low on cash" src/components/landing/FAQ.tsx
```

Expected: one match. If missing, the previous edit was lost; restore it from the earlier commit (`git log --all -p -- src/components/landing/FAQ.tsx`).

- [ ] **Step 3: Build plus browser verify**

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/FAQ.tsx
git commit -m "refactor(faq): replace cancellation question with sales-led pricing answer"
```

### Task 6.2: Rewrite `/pricing` page

**Files:**
- Modify: `src/pages/Pricing.tsx`

Full rewrite. Replace the entire file with the content below. The new page keeps the Navbar/Footer layout wrappers, drops the $199 card and all inline FAQ entries, and lists the feature bullets as value reinforcement without any dollar amounts.

- [ ] **Step 1: Replace file contents**

Write `src/pages/Pricing.tsx`:

```tsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, Database, TrendingUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";

const dataFeatures = [
  "Bank account connection (Plaid)",
  "QuickBooks auto-sync",
  "HubSpot subscription sync",
  "Real-time webhook sync across all sources",
];

const runwayFeatures = [
  "Real-time runway calculation with zero-cash date",
  "Cash flow projections and burn rate tracking",
  "AI scenario modeling with persistent chat history",
  "Slack alerts when your runway crosses a threshold you set",
  "Expense categorization across 8 business categories",
  "Subscription-aware revenue projections",
  "Weekly and daily cash flow drill-down",
  "CSV export at monthly, weekly, or daily granularity",
];

const FeatureList = ({
  icon: Icon,
  title,
  features,
}: {
  icon: typeof Database;
  title: string;
  features: string[];
}) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className="text-primary" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Check size={12} className="text-primary" />
          </div>
          <span className="text-foreground text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Plans · Zensus</title>
      <meta
        name="description"
        content="Zensus pricing is tailored to your business size and data volume. Schedule a 20-minute call with the team to walk through what it looks like for you."
      />
      <meta property="og:title" content="Plans · Zensus" />
      <meta
        property="og:description"
        content="Zensus pricing is tailored to your business. Talk to us for a walkthrough."
      />
    </Helmet>
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Pricing is tailored to your business
            </h1>
            <p className="text-lg text-muted-foreground">
              Every Zensus account is configured around your data sources and
              your team shape. We will walk you through what it looks like for
              you on a 20-minute call.
            </p>
          </div>

          <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-10 mb-10">
            <div className="space-y-8">
              <FeatureList
                icon={Database}
                title="Data and integrations"
                features={dataFeatures}
              />
              <FeatureList
                icon={TrendingUp}
                title="Runway and forecasting"
                features={runwayFeatures}
              />
            </div>
            <div className="mt-10 flex justify-center">
              <TalkToUsButton size="lg" />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Have a specific question? Visit the{" "}
            <Link to="/#faq" className="text-primary hover:underline">
              homepage FAQ
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Pricing;
```

- [ ] **Step 2: Legal-copy orphan scan**

Run:

```bash
grep -rni "trial\|cancel anytime\|billed monthly\|after 7 days\|money-back" src/pages/Pricing.tsx src/components/landing/
```

Expected: no matches in `Pricing.tsx` (new version has none). If any FAQ entries still mention trial or cancel, they are handled in Task 6.1.

- [ ] **Step 3: Build plus browser verify**

Run: `npm run dev`. Visit `/pricing`. Confirm the "Pricing is tailored" block, no dollar amount, no inline FAQ, feature lists visible, Talk to us button routes to the CTA URL.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Pricing.tsx
git commit -m "refactor(pricing): page becomes Talk-to-us block with value bullets, no dollar amount"
```

---

## Chunk 7: SEO, polish, QA

Spec Section 23 (SEO) and Milestone 7.

### Task 7.1: Add `<Helmet>` meta to every page

**Files:**
- Verify: `src/pages/Security.tsx`, `src/pages/Integrations.tsx`, all 4 `src/pages/integrations/*.tsx`, `src/pages/Pricing.tsx`
- Modify: `src/pages/Blog.tsx`, `src/pages/Index.tsx`

Every page needs `<title>`, `<meta name="description">`, and OpenGraph tags (`og:title`, `og:description`). Pages built through `IntegrationPage` (Task 5.1) already include all three via props. Security, Integrations, and Pricing include them in their inline Helmet blocks (Tasks 5.2, 5.3, 6.2). The homepage (`Index.tsx`) and blog page (`Blog.tsx`) currently have no Helmet.

- [ ] **Step 1: Add Helmet to `src/pages/Index.tsx`**

At the top of the Index component (before the `PageSkeleton` gate), add:

```tsx
import { Helmet } from "react-helmet-async";

// inside the Index component return, before <Navbar />:
<Helmet>
  <title>Zensus · Cash flow forecasting for founders with variable revenue</title>
  <meta name="description" content="Know exactly when your cash runs out and what to do about it. Connect your bank, QuickBooks, and HubSpot for runway projections that match the calendar." />
  <meta property="og:title" content="Zensus · Cash flow forecasting for founders" />
  <meta property="og:description" content="Runway that matches the calendar. Built for founders with annual and quarterly contracts." />
</Helmet>
```

Note: `PageSkeleton` returns early before the main render. The Helmet should live in the main-render branch so the meta renders when the page is ready. Helmet inside the loading skeleton is unnecessary since the initial HTML meta in `index.html` covers the first paint.

- [ ] **Step 2: Add Helmet to `src/pages/Blog.tsx`**

Add near the top of the Blog component:

```tsx
import { Helmet } from "react-helmet-async";

// inside the Blog component return, before <Navbar />:
<Helmet>
  <title>Blog · Zensus</title>
  <meta name="description" content="Case studies and practical guides on cash flow forecasting, runway planning, and financial decision-making for founders with variable revenue." />
  <meta property="og:title" content="Blog · Zensus" />
  <meta property="og:description" content="Case studies on cash flow forecasting for founders with variable revenue." />
</Helmet>
```

- [ ] **Step 3: Verify all pages**

Open each page in the browser and inspect DevTools Elements → `<head>` for the correct `<title>` and meta tags. Pages to check: `/`, `/pricing`, `/blog`, `/security`, `/integrations`, `/integrations/plaid`, `/integrations/quickbooks`, `/integrations/hubspot`, `/integrations/slack`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Index.tsx src/pages/Blog.tsx
git commit -m "feat(seo): per-route title, description, and OG meta via react-helmet-async"
```

### Task 7.2: Update `public/sitemap.xml`

**Files:**
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Add new routes**

Append entries for:
- `/security`
- `/integrations`
- `/integrations/plaid`
- `/integrations/quickbooks`
- `/integrations/hubspot`
- `/integrations/slack`

Keep existing entries for `/`, `/pricing`, `/blog`, `/forecast`. Use today's date (ISO format) in `<lastmod>`.

Do NOT add entries for `/privacy`, `/support`, or `/features`. Those routes redirect to `app.zensus.app` via `RedirectToApp.tsx` and inject `noindex`; indexing them would serve search engines a redirect loop.

- [ ] **Step 2: Commit**

```bash
git add public/sitemap.xml
git commit -m "chore(seo): add new routes to sitemap (redirects excluded)"
```

### Task 7.3: Run the QA checklist

- [ ] **Step 1: Walk through `docs/qa-checklist-phase1.md` end to end**

Desktop 1440 wide, mobile 375 wide. Tick every box. Fix anything that does not pass.

- [ ] **Step 2: Full build plus lint run**

Run: `npm run build && npm run lint`
Expected: build passes; lint shows 3 errors plus 7 warnings (Navbar error gone per Milestone 4).

- [ ] **Step 3: Verify redirects still work**

- `http://localhost:8080/privacy` redirects to `app.zensus.app/privacy`.
- `http://localhost:8080/support` redirects to `app.zensus.app/support`.
- `http://localhost:8080/features` redirects to `app.zensus.app/features`.
- `http://localhost:8080/forecast` redirects to `app.zensus.app/forecast`.

- [ ] **Step 4: First-visit hero motion check**

Open `/` in a private window. Hero should run hybrid motion. Reload: static. Open again in a second private window: motion runs again (new localStorage).

- [ ] **Step 5: Reduced motion check**

DevTools Rendering → emulate `prefers-reduced-motion: reduce`. Reload `/`. Hero renders final state, no typewriter, no blur. Scenario prompt still cycles.

- [ ] **Step 6: Commit the QA sign-off**

If fixes were needed, commit them individually. Otherwise record sign-off in the checklist doc:

```bash
git add docs/qa-checklist-phase1.md
git commit -m "docs(qa): Phase 1 QA sign-off"
```

---

## Phase 1 completion

When every task above is checked and merged into `main`, Phase 1 is done. Do NOT push to `main` without explicit user approval (see memory `feedback-no-push-without-approval`).

Typical sequence for final merge:
1. Feature branch for the entire Phase 1 work, one milestone at a time.
2. Ask user to review locally, push feature branch to GitHub for a Vercel preview deployment.
3. Wait for user approval.
4. Merge to `main` (still waits for user approval).
5. User pushes to origin when ready (or asks this plan's executor to do it).

Open items (documented in spec Open Implementation Questions and Maintenance Notes):
- Real brand logo files to replace placeholder SVGs.
- `TALK_TO_US_URL` final value.
- Alerts panel screenshot (currently `/placeholder.svg`).
- Blog page nav decision. The Integrations-led nav (Task 4.1) does not include Blog. The Blog page still exists at `/blog` and is reachable via Footer. Whether to promote it into primary nav is deferred to Phase 2 once real case-study content lands.
