import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics 4 Measurement ID. Matches the inline gtag snippet
// in index.html. Kept in code (rather than env) because it is public
// and the inline snippet already has it baked in.
export const GA_MEASUREMENT_ID = "G-T8W39D59R9";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * RouteTracker: fires a GA4 pageview on client-side route changes.
 *
 * The initial pageview is already sent by the inline `gtag('config', ...)`
 * call in index.html when the page first loads (or when a prerendered
 * HTML file is served for a direct URL hit). This component only
 * reports subsequent navigations that React Router handles in-app.
 */
export const RouteTracker = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
};
