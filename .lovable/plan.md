

# Fix Favicon for Google Search Results

## Problem

The current `favicon.png` is **1.3 MB and 968×967 px** — far too large for Google. Google requires favicons to be a multiple of 48px (e.g., 48×48, 96×96, 192×192) and reasonably small in file size. Google also looks for `/favicon.ico` by default.

## Plan

### 1. Generate optimized favicon files from the existing logo

Using the existing `public/favicon.png` as the source, create:
- `public/favicon.ico` — 48×48 ICO (Google's preferred format)
- `public/favicon-32x32.png` — 32×32 PNG
- `public/favicon-192x192.png` — 192×192 PNG (for Android/PWA)
- `public/apple-touch-icon.png` — 180×180 PNG

### 2. Update `index.html` with proper favicon references

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

Remove the old single `favicon.png` reference.

### 3. Keep the original `favicon.png` (no change)

It stays as the source file but won't be referenced directly.

## Why this fixes Google

Google specifically crawls `/favicon.ico` and small PNG favicons. The current 1.3 MB PNG is ignored by Google's favicon crawler. After this change, Google will pick up the properly sized ICO/PNG on its next crawl (can take days to weeks).

## Files Changed

| File | Change |
|------|--------|
| `public/favicon.ico` | **New** — 48×48 ICO generated from logo |
| `public/favicon-32x32.png` | **New** — 32×32 PNG |
| `public/favicon-192x192.png` | **New** — 192×192 PNG |
| `public/apple-touch-icon.png` | **New** — 180×180 PNG |
| `index.html` | Updated favicon `<link>` tags |

