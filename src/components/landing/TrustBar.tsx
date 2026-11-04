import { Link } from "react-router-dom";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks-logo-black.png";
import g2Logo from "@/assets/g2-logo-circle.png";

const G2_REVIEW_URL = "https://www.g2.com/products/zensus/reviews";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";
const logoFocus =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8EFD8]";

// The two linked cells mirror each other: 44px circular mark, 16px gap, a
// 16px/600 title over a 13px muted line.
const cell =
  "flex min-h-[84px] items-center gap-4 px-5 py-[18px] text-foreground transition-colors hover:bg-[#F4E9CE] min-[760px]:min-h-[108px] min-[760px]:px-8 min-[760px]:py-0";
const title = "whitespace-nowrap text-base font-semibold leading-[1.25] tracking-[-0.01em]";
const subline = "text-[13px] leading-[1.35] text-muted-foreground";
const wordmark = "text-[15px] font-semibold leading-none tracking-[-0.01em] text-foreground";

/*
 * Proof strip from handoff 18-hero-v2 ("Proof strip layout", revised 4 Nov
 * 2026), below the hero's first screen. Three cells on a ruled band: the G2
 * review, the integrations, and the security statement. Phones stack them;
 * 760 to 1023px puts review | trust on one row with Works with full width
 * below; from 1024px they sit in one row at 1fr / 1.4fr / 1fr.
 *
 * Third-party marks follow the handoff's brand compliance review: the
 * official G2 and QuickBooks files, resized only; the Plaid mark as published
 * (white) on a forest pill; HubSpot and Slack as plain text. G2 lists one
 * review, so the copy never says "rated" or gives an average. The logos stay
 * linked to their integration pages, which the homepage must link to
 * (internal-links.test.ts); the handoff reference has no links there. The
 * two linked cells take their accessible name from their visible text, with
 * extra words in sr-only spans at the end, so the name always contains what
 * is on screen (WCAG 2.5.3).
 */
export const TrustBar = () => (
  <section aria-label="Customer review, integrations and security" className="relative z-10 border-y border-border bg-[#F8EFD8]">
    <div className="mx-auto grid max-w-[1280px] grid-cols-1 min-[760px]:grid-cols-2 min-[1024px]:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] min-[1024px]:px-8">
      <a
        href={G2_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cell} ${focusRing} order-1 border-b border-border min-[760px]:border-b-0 min-[760px]:border-r`}
      >
        <img src={g2Logo} alt="" width={44} height={44} className="h-11 w-11 shrink-0" />
        <span className="flex min-w-0 flex-col gap-1">
          <span className={title}>5/5 on G2</span>
          <span className={`${subline} underline underline-offset-2`}>
            Read the review<span className="sr-only"> (1 review, opens in a new tab)</span>
          </span>
        </span>
      </a>

      <div className="order-2 flex min-h-[84px] flex-col items-start justify-center gap-2.5 border-b border-border px-5 py-[18px] min-[760px]:order-3 min-[760px]:col-span-2 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-start min-[760px]:gap-6 min-[760px]:border-b-0 min-[760px]:border-t min-[760px]:px-8 min-[1024px]:order-2 min-[1024px]:col-span-1 min-[1024px]:min-h-[108px] min-[1024px]:flex-col min-[1024px]:items-start min-[1024px]:justify-center min-[1024px]:gap-2.5 min-[1024px]:border-r min-[1024px]:border-t-0 min-[1024px]:py-0">
        <span className={`${subline} whitespace-nowrap`}>Works with</span>
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-3 min-[760px]:gap-x-[22px]">
          <Link
            to="/integrations/plaid"
            aria-label="Plaid integration"
            className={`inline-flex h-8 shrink-0 items-center rounded-full bg-forest px-3.5 ${logoFocus}`}
          >
            <img src={plaidLogo} alt="" width={53} height={20} className="block h-5 w-auto" />
          </Link>
          <Link to="/integrations/quickbooks" aria-label="Intuit QuickBooks integration" className={`mx-1.5 shrink-0 ${logoFocus}`}>
            <img src={quickbooksLogo} alt="" width={102} height={26} className="block h-[26px] w-auto" />
          </Link>
          <Link to="/integrations/hubspot" aria-label="HubSpot integration" className={`${wordmark} ${logoFocus}`}>
            HubSpot
          </Link>
          <Link to="/integrations/slack" aria-label="Slack integration" className={`${wordmark} ${logoFocus}`}>
            Slack
          </Link>
        </div>
      </div>

      {/* "tokens" kept from the live line: AES-256-GCM covers bank tokens and
          secrets, not all data (security audit, Nov 2026; chosen with the
          user, 4 Nov 2026, over the handoff's shorter line). */}
      <Link
        to="/security"
        className={`${cell} ${focusRing} order-3 min-[760px]:order-2 min-[1024px]:order-3`}
      >
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest">
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M7.5 10.5V7.75a4.5 4.5 0 0 1 9 0v2.75" fill="none" stroke="#48D88A" strokeWidth="2.2" strokeLinecap="round" />
            <rect x="4.5" y="10" width="15" height="11.5" rx="3" fill="#48D88A" />
            <circle cx="12" cy="14.9" r="1.7" fill="#0F1C16" />
            <rect x="11.15" y="15.6" width="1.7" height="3.2" rx=".85" fill="#0F1C16" />
          </svg>
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className={title}>Encrypted, US-hosted</span>
          <span className={subline}>
            AES-256-GCM tokens · TLS in transit<span className="sr-only">. How we protect your data</span>
          </span>
        </span>
      </Link>
    </div>
  </section>
);
