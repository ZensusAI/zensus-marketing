# Problem Section Custom Glyphs Design (Phase 2)

**Date:** 2026-04-17
**Status:** Design approved by founder.
**Branch:** `feat/phase1-redesign` (stacks on Phase 1 + Phase 2 Changelog).

## Overview

Replace the four lucide-react icons in the Problem section with custom data-viz SVG glyphs drawn specifically for Zensus. Each glyph uses the three signal colors (green, amber, red) to tell the pain point's three-act story (stable, drifting, critical). Each glyph sits on a chart-native container (thin axes, dashed gridline, subtle radial glow) so the set reads as a row of miniature cash-flow charts rather than generic SaaS icons.

Source of truth for the SVG drawings is the approved mockup at `.superpowers/brainstorm/39639-1776423039/glyph-iconic.html` (A3 column). This spec describes where that content lands in code.

## Goals

**In scope:**
1. Four custom SVG glyphs for the Problem section pain points, drawn in the A3 (weighted chart icons) style.
2. New container treatment: 52x52 rounded square with a subtle grid texture and radial green glow, replacing the current red-tinted square icon wrapper.
3. `Problem.tsx` updated to use the new glyphs and container.
4. Drop the `lucide-react` icon imports in `Problem.tsx` (not the dependency; other files still use it).

**Out of scope:**
1. Any other section of the site. Only `Problem.tsx` changes.
2. Animation on the glyphs.
3. Hover states beyond what currently exists on the card border.
4. Swapping the same pattern into `Bento.tsx`, `HowItWorks.tsx`, `SecurityStrip.tsx`, or any other icon-using component.

## Design decisions

### 1. File structure

Create one new file: `src/components/landing/ProblemGlyphs.tsx`. It exports four named React components (`GlyphRunway`, `GlyphFragmented`, `GlyphFork`, `GlyphCliff`). Each renders a self-contained 32x32 SVG matching the A3 mockup.

Rationale: grouping the four glyphs in a single file keeps them visible as a coherent set. Separate files would fragment what is really one design system decision. The file is small (~120 lines).

### 2. Container

The current icon wrapper uses `bg-destructive/10` (red tint). Replace with a chart-native container matching the mockup:
- 52x52 rounded square (`w-13 h-13 rounded-xl`)
- Background: subtle grid texture (8x8 linear gradient for the grid) plus radial glow (primary color at 10% opacity, fading to background)
- Border: 1px `rgba(247,245,242,0.08)` (hairline)
- No color change on hover (the card border still highlights on hover)

Implementation detail: the background is multi-layered CSS (`linear-gradient + radial-gradient + solid color`). Rendered inline via Tailwind arbitrary values, or extracted to a single `glyph-frame` utility class in `src/index.css` if cleaner.

### 3. Color tokens

All three signal colors used per A3 mockup:
- Green: `#21C55C` (currently `--primary`)
- Amber: `#F59E0B` (currently `--caution`, added in Phase 1)
- Red: `#EF4444` (currently `--destructive`)
- Muted grid lines: `rgba(247,245,242,0.08)` to `0.22`

Glyphs use these colors directly as hex in the SVG source (simpler and more portable than CSS variables in inline SVG). The colors match the CSS variables; if any variable value changes in the future, update the inline hex to match.

### 4. Glyph specifications

Each glyph is a 32x32 viewBox SVG with no fill on the root. Structure: axis lines, optional dashed gridline, then the glyph content (bars, dots, paths, etc.).

**GlyphRunway** ("How many months do I have left?")
- 6 vertical rounded rects (bars) at x = 5, 9, 13, 17, 21, 25
- Decreasing heights: 16, 15, 13, 10, 6, 3 (bar y = 26 minus height)
- Colors: bars 1-2 green, bars 3-4 amber (bar 4 opacity 0.85), bars 5-6 red (bar 5 opacity 0.85)
- Plus x-axis line, y-axis line, one dashed gridline at y=16

**GlyphFragmented** ("Still pasting CSVs")
- 6 filled circles at irregular positions, radius 2.1, each with 0.8 stroke in background color
- Colors and opacity matching mockup: green (full), amber (0.9), amber (0.7), red (0.85), muted (0.4), red (full)
- Plus x-axis, y-axis, two dashed gridlines at y=12 and y=20
- Thin dashed lines between first-second and second-third dots showing broken handoffs

**GlyphFork** ("Can I afford to hire?")
- Muted incoming path M5 22 L15 16
- Green branch M15 16 L25 7 at stroke-width 2.6
- Red branch M15 16 L25 25 at stroke-width 2.6
- Amber diamond at pivot (M15 12.8 L18 16 L15 19.2 L12 16 Z) with 0.6 stroke in background
- Green and red discs at endpoints (r=2.4, stroke in background)

**GlyphCliff** ("Surprises at the end of the month")
- Linear gradient defs: green 0.45, amber 0.35, red 0.3, red 0.15
- Filled area path from M4 12 L18 12 L21 23 L28 23 L28 26 L4 26 Z
- Three stroke segments on top: green (flat), amber (drop), red (floor), each stroke-width 2.2
- Amber marker at pivot (18,12) r=2, red marker at bottom (21,23) r=2
- Plus axes and one dashed gridline

### 5. Problem.tsx changes

- Remove `import { Clock, HelpCircle, AlertTriangle, TrendingDown } from "lucide-react"`.
- Add `import { GlyphRunway, GlyphFragmented, GlyphFork, GlyphCliff } from "./ProblemGlyphs"`.
- Update the `painPoints` array: `icon` property now references the new glyph components. Order preserved.
- Update the icon wrapper `<div>`: drop `bg-destructive/10` and `group-hover:bg-destructive/20`; replace with the chart-native container classes.
- Remove `size={24}` and `text-destructive` from the icon render; the glyph component is self-sized.

### 6. Accessibility

Each glyph is decorative. Add `aria-hidden="true"` on the outer `<svg>` so screen readers skip. The text label next to the glyph carries the meaning.

## Success criteria

- `npm run build` passes.
- `npm run lint` stays at 10 problems (3 errors + 7 warnings).
- Problem section on the homepage renders four new glyph designs matching the A3 mockup visually.
- No remaining lucide imports in `Problem.tsx`.
- No em-dashes anywhere in new code or comments.
- Visual check: glyphs are recognizable as miniature charts, use all three signal colors as mockup specifies.

## Open items

- None. All design decisions locked by the A3 approval.
