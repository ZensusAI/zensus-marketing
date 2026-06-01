import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { readConsent, writeConsent, requiresConsent } from "@/lib/consent";
import {
  grantCapturing,
  denyCapturing,
  capturePageview,
} from "@/lib/analytics/events";

function currentUrl(): string {
  return (
    window.location.origin +
    window.location.pathname +
    window.location.search
  );
}

/**
 * Geo-gated cookie-consent banner.
 *
 * PostHog initialises opted-OUT (opt_out_capturing_by_default in events.ts), so
 * nothing is captured and no analytics cookie is set until we decide here:
 *
 * - A decision is already stored (.zensus.app cookie): "granted" is applied
 *   synchronously in main.tsx; "denied" stays opted out — either way, no banner.
 * - No decision yet → ask /api/geo:
 *     • EEA / UK / CH → show this banner; stay opted out until the visitor chooses.
 *     • elsewhere     → implied consent: opt in immediately and record the entry pageview.
 *
 * Renders nothing by default, so the Puppeteer prerender never bakes a visible
 * banner into the static HTML — it only appears after the client-side check.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return;
    if (readConsent()) return; // already decided elsewhere

    let cancelled = false;
    requiresConsent().then((needsBanner) => {
      if (cancelled) return;
      if (needsBanner) {
        setVisible(true);
      } else {
        // Implied consent (outside the EEA/UK/CH): start capturing and record
        // the entry pageview the opted-out tracker dropped on first load.
        writeConsent("granted");
        grantCapturing();
        capturePageview(currentUrl());
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;

  const accept = () => {
    writeConsent("granted");
    grantCapturing();
    capturePageview(currentUrl());
    setVisible(false);
  };

  const decline = () => {
    writeConsent("denied");
    denyCapturing();
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xs rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:inset-x-auto sm:right-4 sm:mx-0"
    >
      <p className="text-xs leading-snug text-foreground/80">
        We use cookies for analytics to improve Zensus. See our{" "}
        <a href="/privacy" className="font-medium text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
      <div className="mt-2.5 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={decline}>
          Decline
        </Button>
        <Button size="sm" onClick={accept}>
          Accept
        </Button>
      </div>
    </div>
  );
}
