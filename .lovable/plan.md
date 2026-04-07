

# Fix Broken Navigation Links

## Problems Found

1. **`#features` link has no target.** The navbar links to `#features`, but no section on the page has `id="features"`. The RunwayFeature component (which showcases features) has no `id` attribute at all. Clicking "Features" does nothing.

2. **Hash links don't work from `/pricing` or `/blog`.** The navbar uses plain `<a href="#faq">` and `<a href="#features">`. These only work when already on the homepage. From `/pricing` or `/blog`, clicking "Features" or "FAQ" navigates to `/pricing#features` — which doesn't exist on that page.

3. **Logo link uses `<a href="#">`** instead of linking to `/`. From any sub-page, clicking the logo doesn't navigate home.

4. **Footer "Security" link points to `#`** — a dead link.

## Plan

### 1. Add `id="features"` to RunwayFeature section

In `src/components/landing/RunwayFeature.tsx`, add `id="features"` to the wrapping `<section>` element so the anchor target exists.

### 2. Convert hash links to absolute paths with hashes

In `src/components/landing/Navbar.tsx`:
- Change `#features` → `/#features` and `#faq` → `/#faq`
- Use React Router `Link` for these instead of plain `<a>` tags, OR use `<a href="/#features">` which works cross-page
- Change logo from `<a href="#">` → `<Link to="/">`

### 3. Handle scroll-to-hash on homepage load

Add a small `useEffect` in `Index.tsx` that checks `window.location.hash` after the loading skeleton clears and scrolls to the target element. This ensures navigating from `/pricing` to `/#features` actually scrolls.

### 4. Fix footer dead link

In `src/components/landing/Footer.tsx`, either remove the "Security" link or point it to a real destination.

## Files Changed

| File | Change |
|------|--------|
| `src/components/landing/RunwayFeature.tsx` | Add `id="features"` to section |
| `src/components/landing/Navbar.tsx` | Logo → `<Link to="/">`, hash links → `/#features`, `/#faq` |
| `src/pages/Index.tsx` | Add `useEffect` to scroll to hash after skeleton clears |
| `src/components/landing/Footer.tsx` | Fix or remove dead "Security" `#` link |

