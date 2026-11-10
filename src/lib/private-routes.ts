// Routes that exist in App.tsx but are deliberately kept out of every public
// surface: not prerendered, not in the sitemap or robots.txt, no Open Graph
// card, not on the /sitemap page, and not linked from anywhere on the site.
// /tour is opened only through a signed per-person link (see src/pages/Tour.tsx).
//
// src/lib/route-coverage.test.ts exempts these from the "every route is
// public" checks, and src/lib/private-routes.test.ts asserts the opposite for
// them. Keep this list short; a route belongs here only if it must not be found.
export const PRIVATE_ROUTES = ["/tour"] as const;

export function isPrivateRoute(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (PRIVATE_ROUTES as readonly string[]).includes(path);
}
