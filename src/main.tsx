import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics, grantCapturing } from "./lib/analytics/events";
import { readConsent } from "./lib/consent";

// Initialise PostHog (opted OUT by default, no cookie/capture yet). No-ops if
// the key is unset or during the prerender crawl, so it is safe unconditionally.
initAnalytics();

// Returning visitor who already consented: opt in synchronously, before render,
// so PostHogPageview captures the entry pageview. New/undecided visitors are
// handled asynchronously by <ConsentBanner /> (geo check + banner or implied
// consent). A "denied" decision simply stays opted out.
if (readConsent() === "granted") grantCapturing();

createRoot(document.getElementById("root")!).render(<App />);
