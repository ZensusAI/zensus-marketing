import { Link } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";

const G2_REVIEW_URL = "https://www.g2.com/products/zensus/reviews";
// From the customer's video captions, not his G2 review (which leans on
// "AI-powered", off the site's positioning). So the attribution credits G2
// with the rating ("5.0 on G2"), not the quote. Chosen with the user, 21 Oct.
const QUOTE = "One of my favorite features of Zensus is the HubSpot integration.";

const LOGOS: { src: string; alt: string; to: string; className?: string }[] = [
  // The Plaid mark is a white SVG (tuned for dark canvases); logo-on-light
  // repaints it ink on cream, the handoff's brightness(0) opacity(.82).
  { src: plaidLogo, alt: "Plaid", to: "/integrations/plaid", className: "logo-on-light" },
  { src: quickbooksLogo, alt: "QuickBooks", to: "/integrations/quickbooks" },
  { src: hubspotLogo, alt: "HubSpot", to: "/integrations/hubspot" },
  { src: slackLogo, alt: "Slack", to: "/integrations/slack" },
];

const FACTS = ["Bank-level OAuth", "AES-256-GCM at rest", "Account-level isolation", "Credentials never stored"];

const STAR =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/*
 * Proof strip from handoff 03-proof-strip (locked 6c). The handoff's 56px
 * band that carries the hero's waves and ruled column down is part of the
 * hero (Hero.tsx bottom padding), so the waves never seam. Then three cells
 * on a ruled Cream Warm band: the G2 rating with the customer quote, the four
 * integrations (each links to its page), and "Bank-level security" (links to
 * /security; hover or focus shows the four security facts). The facts are
 * always in the HTML, only hidden visually, so crawlers read them. Cells stack
 * below the handoff's 820px switch.
 */
export const TrustBar = () => (
    <section aria-label="Customer rating, integrations and security" className="relative z-10 border-y border-border bg-secondary/50">
      <div className="mx-auto grid max-w-[1280px] px-5 min-[820px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.95fr)] min-[820px]:px-8">
        {/* Rating and quote */}
        <div className="flex items-center gap-3.5 border-b border-border py-[22px] min-[820px]:border-b-0 min-[820px]:border-r min-[820px]:pr-7">
          <div className="flex shrink-0 flex-col items-start gap-1">
            <span className="text-[26px] font-bold leading-none tracking-[-0.03em] text-foreground">5.0</span>
            <span className="flex gap-0.5 text-primary" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="hsl(var(--primary))">
                  <path d={STAR} />
                </svg>
              ))}
            </span>
          </div>
          <p className="m-0 text-[13.5px] leading-[1.45] text-muted-foreground">
            <span className="italic text-foreground">{`"${QUOTE}"`}</span>
            <br />
            <span className="whitespace-nowrap">Jameson Pitts,</span>{" "}
            <span className="whitespace-nowrap">CEO of Sangfroid! Studios</span> ·{" "}
            <a
              href={G2_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zensus 5.0 star rating on G2, verified review (opens in a new tab)"
              className={`whitespace-nowrap hover:text-primary hover:underline ${focusRing}`}
            >
              5.0 on G2
            </a>
          </p>
        </div>

        {/* Works with */}
        <div className="flex flex-col justify-center gap-3 border-b border-border py-[22px] min-[820px]:border-b-0 min-[820px]:border-r min-[820px]:px-7">
          <span className="text-[13px] font-semibold text-muted-foreground">Works with</span>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3.5">
            {LOGOS.map((logo) => (
              <Link key={logo.alt} to={logo.to} aria-label={`${logo.alt} integration`} className={focusRing}>
                <img src={logo.src} alt={`${logo.alt} integration`} height={24} className={`h-6 w-auto ${logo.className ?? ""}`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Bank-level security */}
        <div className="group relative flex items-center py-[22px] min-[820px]:pl-7">
          <div className="flex items-center gap-3">
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.12] text-sage-dark">
              <ShieldCheck size={18} strokeWidth={2} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-foreground">Bank-level security</span>
              <span className="mt-0.5 block text-[13px] text-muted-foreground">
                Credentials never stored ·{" "}
                <Link to="/security" className={`whitespace-nowrap text-primary hover:underline ${focusRing}`}>
                  How we protect your data
                </Link>
              </span>
            </span>
          </div>
          <ul
            className={[
              "absolute right-0 top-[calc(100%-10px)] z-20 flex w-[300px] max-w-full flex-col gap-[9px] rounded-[14px] bg-forest px-4 py-3.5 text-forest-foreground",
              "shadow-[0_24px_48px_-20px_rgba(15,28,22,.6)]",
              "invisible translate-y-1 opacity-0 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
              "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
            ].join(" ")}
          >
            {FACTS.map((fact) => (
              <li key={fact} className="flex items-center gap-[9px] font-mono text-xs">
                <Check aria-hidden size={13} strokeWidth={2.5} className="text-sage-light" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
);
