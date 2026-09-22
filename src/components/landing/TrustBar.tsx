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

// The section band is Cream Warm (secondary): bg-background/40 was the same
// cream as the canvas, so the strip read as two floating hairlines instead of
// a section.
export const TrustBar = () => (
  <section className="border-y border-border bg-secondary/50 py-10">
    <div className="section-container flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
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
              className={`h-7 w-auto ${logo.className ?? ""}`}
            />
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
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
