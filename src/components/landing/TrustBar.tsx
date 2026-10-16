import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";
import { Link } from "react-router-dom";

const LOGOS: { src: string; alt: string; to: string; className?: string }[] = [
  // The Plaid mark is a white SVG (tuned for dark canvases); logo-on-light
  // lets the cream theme repaint it ink via a scoped filter in index.css.
  { src: plaidLogo, alt: "Plaid", to: "/integrations/plaid", className: "logo-on-light" },
  { src: quickbooksLogo, alt: "QuickBooks", to: "/integrations/quickbooks" },
  { src: hubspotLogo, alt: "HubSpot", to: "/integrations/hubspot" },
  { src: slackLogo, alt: "Slack", to: "/integrations/slack" },
];

const CHIPS = [
  "Bank-level OAuth",
  "AES-256-GCM at rest",
  "Account-level isolation",
  "Credentials never stored",
];

// The proof strip between the hero and the product: one ruled band, Cream
// Warm (secondary), logos and security facts on a single line from xl up and
// two lines below that. It was two stacked rows with generous padding
// (142px tall), which on a 1280x720 laptop pushed the product frame out of
// the first screen.
export const TrustBar = () => (
  <section className="border-y border-border bg-secondary/50 py-4 md:py-5">
    <div className="section-container flex flex-col items-center gap-4 xl:flex-row xl:justify-center xl:gap-10">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Works with
        </span>
        {/* Each mark links to its integration page. The homepage is where
            outside links land, and before this its content passed nothing on
            to those four pages (they were reachable from the footer only). */}
        {LOGOS.map((logo) => (
          <Link
            key={logo.alt}
            to={logo.to}
            aria-label={`${logo.alt} integration`}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <img
              src={logo.src}
              alt={`${logo.alt} integration`}
              className={`h-6 w-auto sm:h-7 ${logo.className ?? ""}`}
            />
          </Link>
        ))}
      </div>
      <span aria-hidden className="hidden h-6 w-px bg-border xl:block" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground sm:flex sm:flex-wrap sm:justify-center sm:gap-x-5">
        {CHIPS.map((chip) => (
          <span key={chip} className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {chip}
          </span>
        ))}
      </div>
    </div>
  </section>
);
