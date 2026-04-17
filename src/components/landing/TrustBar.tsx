import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";

const LOGOS = [
  { src: plaidLogo, alt: "Plaid", label: "Plaid" },
  { src: quickbooksLogo, alt: "QuickBooks", label: "QuickBooks" },
  { src: hubspotLogo, alt: "HubSpot", label: "HubSpot" },
  { src: slackLogo, alt: "Slack", label: "Slack" },
];

const CHIPS = [
  "Bank-level OAuth",
  "AES-256-GCM at rest",
  "Account-level isolation",
  "Credentials never stored",
];

export const TrustBar = () => (
  <section className="border-y border-border bg-background/40 py-10">
    <div className="section-container flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
        {LOGOS.map((logo) => (
          <div key={logo.label} className="flex items-center gap-3 text-foreground/85">
            <img src={logo.src} alt={logo.alt} width={28} height={28} />
            <span className="font-medium tracking-tight">{logo.label}</span>
          </div>
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
