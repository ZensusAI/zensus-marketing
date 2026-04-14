

# Redirect Legacy Routes to app.zensus.app

The problem: when Google (or anyone) visits `zensus.app/privacy`, `zensus.app/support`, or `zensus.app/features`, the SPA serves `index.html` and React Router shows the NotFound page (with a 200 status). Google sees this as duplicate thin content. Instead, these should redirect to `app.zensus.app`.

## Changes

### 1. Create a `RedirectToApp` component
A small component that redirects to `app.zensus.app` + the current path using `window.location.replace()`. It also sets a `noindex` meta tag during the brief render.

### 2. Add redirect routes in `src/App.tsx`
Add explicit routes for `/privacy`, `/support`, and `/features` that use the `RedirectToApp` component:

```
<Route path="/privacy" element={<RedirectToApp />} />
<Route path="/support" element={<RedirectToApp />} />
<Route path="/features" element={<RedirectToApp />} />
```

This way, visitors and Google are immediately redirected to `app.zensus.app/privacy`, etc., instead of seeing the homepage or a soft 404.

### 3. Add `noindex` to `NotFound.tsx`
For any other unknown routes, add a `<meta name="robots" content="noindex">` tag so Google doesn't index random SPA catch-all pages as duplicate content.

