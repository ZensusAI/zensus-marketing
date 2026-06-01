import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics/events";

// Initialise PostHog before first render. No-ops if the key is unset or during
// the prerender crawl, so it is safe to call unconditionally here.
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
