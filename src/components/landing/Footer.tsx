import { type ComponentType, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";
import {
  COMPANY_ADDRESSES,
  COMPANY_PROFILES,
  LEGAL_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
  TALK_TO_US_URL,
} from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import zensusLogo from "@/assets/zensus-logo.png";
import chatgptLogo from "@/assets/ai/chatgpt.svg";
import claudeLogo from "@/assets/ai/claude.svg";
import geminiLogo from "@/assets/ai/gemini.svg";
import grokLogo from "@/assets/ai/grok.png";
import perplexityLogo from "@/assets/ai/perplexity.svg";
import { HERO_MESH } from "./hero-mesh";

// Full names for the state codes in COMPANY_ADDRESSES (the footer's <abbr>).
const REGION_NAMES: Record<string, string> = { DE: "Delaware", TX: "Texas" };

// A line break in an address: a new line on screen, a comma in the text.
const LineBreak = () => (
  <>
    <span className="sr-only">, </span>
    <br />
  </>
);

// The footer is the one block that appears on every page, so it carries the
// facts search and AI engines use to pin down the entity: the legal name, the
// registered addresses, the support mailbox, the public profiles, and the
// same one-sentence description as the Organization schema in index.html.
// Every link is a plain anchor in the HTML (no collapsed groups), so the
// prerendered page hands crawlers the full map.
//
// Layout from handoff 13-footer (cream split, mesh waves): brand, mailbox,
// address and profiles on the left; five link columns and an "Ask AI about
// Zensus" card on the right. It is built on theme tokens, so it is cream on
// the landing page and follows the dark theme elsewhere; the waves only show
// on cream, where they continue the hero's.

const ENTITY_SENTENCE =
  "Cash flow forecasting software for businesses with unpredictable revenue.";

type Icon = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

// lucide has no X logo, so the mark is drawn inline.
const XIcon: Icon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_LINKS: { label: string; href: string; Icon: Icon }[] = [
  { label: "LinkedIn", href: COMPANY_PROFILES.linkedin, Icon: Linkedin },
  { label: "X", href: COMPANY_PROFILES.x, Icon: XIcon },
  { label: "Instagram", href: COMPANY_PROFILES.instagram, Icon: Instagram },
];

// "Ask AI about Zensus": each assistant opens with the same prompt filled in.
// The prompt points the assistant at the site (llm-info first, the page written
// for AI assistants), asks for what Zensus does, who it is for, how it works,
// pricing, security, and ends with every way to reach the team, so the answer
// a visitor gets back closes with a trial link, the mailbox and a booking link.
// Gemini has no prefill URL, so it opens in Google AI Mode, which runs Gemini.
// Logos are the brands' own marks (supplied 21 Oct 2026); Perplexity keeps its
// simple-icons mark.
const AI_PROMPT = [
  `Read ${SITE_URL} (start with ${SITE_URL}/llm-info) and give me a clear overview of Zensus:`,
  "1. What Zensus does and the cash flow problem it solves.",
  "2. Who it is for, and which kinds of businesses get the most from it.",
  "3. How it builds the forecast: which tools it connects to (Plaid, QuickBooks, HubSpot, Slack) and how often data syncs.",
  "4. The key features: the 13-week forecast, the zero-cash date, plain-English scenarios and Slack alerts.",
  `5. Pricing and the free trial (${SITE_URL}/pricing).`,
  `6. How it keeps financial data secure (${SITE_URL}/security).`,
  `7. How to get in touch: email ${SUPPORT_EMAIL}, book a call with the team at ${TALK_TO_US_URL}, or start a free trial from ${SITE_URL}/pricing.`,
  "Finish with a short answer on whether Zensus fits a business like mine, and the links to contact the team or book a call.",
].join("\n");
const AI_ENGINES = [
  { name: "ChatGPT", base: "https://chatgpt.com/?q=", logo: chatgptLogo },
  { name: "Claude", base: "https://claude.ai/new?q=", logo: claudeLogo },
  { name: "Perplexity", base: "https://www.perplexity.ai/search?q=", logo: perplexityLogo },
  { name: "Gemini", label: "Gemini in Google AI Mode", base: "https://www.google.com/search?udm=50&q=", logo: geminiLogo },
  { name: "Grok", base: "https://grok.com/?q=", logo: grokLogo },
];

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Use cases", href: "/use-cases" },
      { label: "For QuickBooks Online", href: "/quickbooks-cash-flow-forecasting" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Book a call", href: TALK_TO_US_URL, external: true },
    ],
  },
  {
    title: "Free tools",
    links: [
      { label: "Runway calculator", href: "/tools/runway-calculator" },
      { label: "Payroll calendar", href: "/tools/payroll-calendar" },
      { label: "13-week cash flow template", href: "/tools/13-week-cash-flow-template" },
    ],
  },
  {
    // "X vs Y" is one of the most-cited query shapes, so the comparison pages
    // get a column of their own rather than a collapsed group.
    title: "Compare",
    links: [
      { label: "Zensus vs Float", href: "/compare/zensus-vs-float" },
      { label: "Zensus vs Pulse", href: "/compare/zensus-vs-pulse" },
      { label: "Zensus vs Cash Flow Frog", href: "/compare/zensus-vs-cash-flow-frog" },
      { label: "Float alternatives", href: "/compare/float-alternatives" },
    ],
  },
  {
    title: "Integrations",
    links: [
      { label: "Overview", href: "/integrations" },
      { label: "Plaid", href: "/integrations/plaid" },
      { label: "QuickBooks", href: "/integrations/quickbooks" },
      { label: "HubSpot", href: "/integrations/hubspot" },
      { label: "Slack", href: "/integrations/slack" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
      { label: "Security", href: "/security" },
      { label: "Support", href: "/support" },
      { label: "LLM info", href: "/llm-info" },
    ],
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Subprocessors", href: "/subprocessors" },
  { label: "Security", href: "/security" },
];

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const linkClass = cn("inline-flex items-center gap-1.5 text-sm leading-[1.4] text-muted-foreground transition-colors hover:text-foreground", focusRing);
const roundButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-sage-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {link.label}
        <span aria-hidden className="text-[11px]">↗</span>
      </a>
    );
  }
  if (link.href.startsWith("/#")) {
    return (
      <a href={link.href} className={linkClass}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.href} className={linkClass}>
      {link.label}
    </Link>
  );
}

// The card sits in the link grid's sixth cell, beside Company. It is a forest
// panel on the cream footer (the site's dark surface, as in the final CTA), so
// it reads as its own object rather than another column, and the assistants'
// marks sit full colour on white discs: the colour and the disc say "button".
// Hover or focus lifts the disc, rings it, and names the assistant above.
function AskAiCard() {
  const [active, setActive] = useState(-1);
  const open = active >= 0;
  return (
    <div
      onMouseLeave={() => setActive(-1)}
      onBlur={(ev) => {
        if (!ev.currentTarget.contains(ev.relatedTarget as Node | null)) setActive(-1);
      }}
      className="col-span-full min-w-0 self-start rounded-2xl bg-forest p-4 text-forest-foreground min-[760px]:p-3.5 min-[1280px]:p-4 shadow-[0_22px_44px_-26px_rgba(15,28,22,.7)] min-[760px]:col-span-1"
    >
      <p className="text-sm font-semibold text-forest-foreground">Ask AI about Zensus</p>
      <p aria-live="polite" className="mt-1 min-h-[2.9em] text-pretty text-[12.5px] leading-[1.45] text-forest-muted-strong">
        {open
          ? `Ask ${AI_ENGINES[active].label ?? AI_ENGINES[active].name} about Zensus ↗`
          : "What Zensus does, and how to reach us."}
      </p>
      <ul className="mt-3 flex flex-wrap items-center gap-2 min-[760px]:gap-1 min-[1280px]:gap-2">
        {AI_ENGINES.map((ai, i) => {
          const on = active === i;
          return (
            <li key={ai.name}>
              <a
                href={ai.base + encodeURIComponent(AI_PROMPT)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask ${ai.label ?? ai.name} about Zensus (opens in a new tab)`}
                title={ai.label ?? ai.name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-white min-[760px]:h-[30px] min-[760px]:w-[30px] min-[1280px]:h-9 min-[1280px]:w-9 shadow-[0_2px_6px_rgba(0,0,0,.35)] transition-[transform,box-shadow] duration-200 ease-ui motion-reduce:transition-none",
                  "focus-visible:outline-none",
                  on && "-translate-y-0.5 shadow-[0_0_0_2px_hsl(var(--sage-light)),0_6px_14px_rgba(0,0,0,.4)] motion-reduce:translate-y-0",
                )}
              >
                <img src={ai.logo} alt="" width={20} height={20} loading="lazy" decoding="async" className="h-5 w-5 object-contain min-[760px]:h-[17px] min-[760px]:w-[17px] min-[1280px]:h-5 min-[1280px]:w-5" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const Footer = () => {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [arrived, setArrived] = useState(false);

  // The waves drift up a little the first time the footer comes into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setArrived(true);
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        setArrived(true);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer ref={ref} className="relative overflow-hidden border-border bg-background px-5 [:root:not(.theme-cream)_&]:border-t pt-14 text-foreground min-[760px]:px-8 min-[760px]:pt-[88px]">
      <picture>
        <source media={`(min-width: ${HERO_MESH.switchPx}px)`} srcSet={HERO_MESH.wide} />
        <img
          src={HERO_MESH.narrow}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className={cn(
            "pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-bottom opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,black_70%)] [.theme-cream_&]:block",
            !reduced && "transition-transform duration-[1200ms] ease-ui",
            !reduced && !arrived && "translate-y-[60px]",
          )}
        />
      </picture>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 min-[1024px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[1024px]:gap-16">
          <div className="min-w-0">
            {/* Brand sign-off: same lockup drawing as the navbar and OG cards
                (32px tile, 22px name, -0.02em tracking, 9px gap). */}
            <Link to="/" aria-label="Zensus home" className={cn("inline-flex w-fit items-center gap-[9px]", focusRing)}>
              <img src={zensusLogo} alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
              <span className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">Zensus</span>
            </Link>
            <p className="mt-[22px] max-w-[640px] text-balance text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-foreground min-[760px]:text-[34px]">
              {ENTITY_SENTENCE}
            </p>

            <div className="mt-8 flex flex-col gap-2.5">
              <span className="text-[13.5px] text-muted-foreground">Questions? Write to us</span>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className={cn(
                  "group inline-flex w-fit items-center gap-2.5 text-[19px] font-semibold tracking-[-0.015em] text-foreground transition-colors hover:text-sage-dark min-[760px]:text-[23px]",
                  focusRing,
                )}
              >
                {SUPPORT_EMAIL}
                <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                </span>
              </a>
            </div>

            {/* The legal entity and its two addresses, as postal blocks: the
                street, the suite, then city, state and ZIP, then the
                country, each on its own line, under a label naming the
                state. Laid out side by side from 480px, stacked below. Each
                visual line break also carries a hidden ", " (LineBreak), so
                text read without layout (tag-stripping extractors, AI
                crawlers, screen readers) gets "254 Chapman Rd, Ste 208
                #23940, Newark, DE 19702, United States" rather than
                "Rd" running into "Ste". Microdata ties the visible
                text to the same Organization @id as the JSON-LD in
                index.html, so engines read one entity with these addresses
                rather than a second one. The abbreviations expand for
                screen readers and machines (<abbr title>). */}
            <address
              itemScope
              itemType="https://schema.org/Organization"
              itemID={`${SITE_URL}/#organization`}
              className="mt-7 text-sm not-italic leading-[1.6] text-muted-foreground"
            >
              <meta itemProp="name" content="Zensus" />
              <link itemProp="url" href={SITE_URL} />
              <p itemProp="legalName" className="font-medium text-foreground">
                {LEGAL_NAME}
              </p>{" "}
              <div className="mt-3 grid gap-4 min-[480px]:grid-cols-2 min-[480px]:gap-8">
                {COMPANY_ADDRESSES.map((office) => (
                  <p key={office.label} itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground/80">
                      {office.label}
                    </span>
                    <span className="sr-only">: </span>
                    {/* Street, then the suite on its own line (USPS address
                        line 2), so neither column wraps mid-number. */}
                    <span itemProp="streetAddress">
                      {office.street.split(", ").map((part, i) => (
                        <span key={part}>
                          {i > 0 ? <LineBreak /> : null}
                          {part}
                        </span>
                      ))}
                    </span>
                    <LineBreak />
                    <span itemProp="addressLocality">{office.locality}</span>,{" "}
                    <abbr title={REGION_NAMES[office.region]} itemProp="addressRegion" className="no-underline">
                      {office.region}
                    </abbr>{" "}
                    <span itemProp="postalCode">{office.postalCode}</span>
                    <LineBreak />
                    <span itemProp="addressCountry" content={office.country}>
                      United States
                    </span>
                    <span className="sr-only">. </span>
                  </p>
                ))}
              </div>
            </address>

            <ul className="mt-5 flex gap-2" aria-label="Zensus profiles">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer me" aria-label={`Zensus on ${label}`} title={label} className={roundButton}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 min-[760px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.35fr)] min-[760px]:gap-x-6 min-[760px]:gap-y-10 min-[1024px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] min-[1024px]:border-t-0 min-[1024px]:pt-1.5"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="min-w-0">
                <h3 className="mb-3.5 text-sm font-semibold text-foreground">{column.title}</h3>
                <ul className="flex flex-col gap-[11px]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <AskAiCard />
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3.5 border-t border-border pt-6 min-[760px]:flex-row">
          <p className="text-center text-sm text-muted-foreground min-[760px]:text-left">
            © {new Date().getFullYear()} {LEGAL_NAME} All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <FooterLinkItem link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="h-6 min-[760px]:h-10" />
    </footer>
  );
};

export default Footer;
