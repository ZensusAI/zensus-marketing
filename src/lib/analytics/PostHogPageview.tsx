import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capturePageview } from "./events";

/**
 * Fires a PostHog `$pageview` on the initial load and on every client-side
 * route change. Must be rendered inside <BrowserRouter> (it uses useLocation).
 *
 * `capture_pageview` is disabled in initAnalytics(), so this is the single
 * source of pageviews, giving an accurate pathname for each react-router
 * navigation (the SPA never does a full document load between pages).
 */
export function PostHogPageview() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    capturePageview(window.location.origin + pathname + search);
  }, [pathname, search]);

  return null;
}
