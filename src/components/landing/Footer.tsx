import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import {
  COMPANY_ADDRESSES,
  COMPANY_PROFILES,
  LEGAL_NAME,
  SUPPORT_EMAIL,
  TALK_TO_US_URL,
} from "@/lib/constants";
import zensusLogo from "@/assets/zensus-logo.png";

// The footer is the one block that appears on every page, so it carries the
// facts search and AI engines use to pin down the entity: the legal name, the
// registered addresses, the support mailbox, every public profile, and the
// same one-sentence description as the Organization schema in index.html.
// Every link is a plain anchor in the HTML (no collapsed groups), so the
// prerendered page hands crawlers the full map.

const ENTITY_SENTENCE =
  "Cash flow forecasting software for businesses with unpredictable revenue.";

// lucide has no X logo, so the mark is drawn inline.
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_LINKS: { label: string; href: string; Icon: typeof Linkedin | typeof XIcon }[] = [
  { label: "LinkedIn", href: COMPANY_PROFILES.linkedin, Icon: Linkedin },
  { label: "X", href: COMPANY_PROFILES.x, Icon: XIcon },
  { label: "YouTube", href: COMPANY_PROFILES.youtube, Icon: Youtube },
  { label: "Instagram", href: COMPANY_PROFILES.instagram, Icon: Instagram },
  { label: "GitHub", href: COMPANY_PROFILES.github, Icon: Github },
];

const socialLinkClass =
  "inline-flex items-center gap-2 rounded-sm text-sm font-medium text-[hsl(var(--forest-muted))] transition-colors hover:text-[hsl(var(--forest-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--sage-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--forest))]";

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

const linkClass =
  "text-sm text-[hsl(var(--forest-muted))] transition-colors hover:text-[hsl(var(--forest-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--sage-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--forest))] rounded-sm";

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {link.label}
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

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-[hsl(var(--forest-foreground))]">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  // Forest close: the footer is the page's deepest brand surface and is
  // styled with the global forest constants so it reads identically on
  // cream (landing) and dark (other routes).
  return (
    <footer className="border-t border-[hsl(var(--forest-border)/0.5)] bg-[hsl(var(--forest))]">
      <div className="section-container py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-3">
            {/* Brand sign-off: same lockup drawing as the navbar and OG cards
                (32px tile, 22px name, -0.02em tracking, 9px gap), cream on
                forest. */}
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-[9px] rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--sage-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--forest))]"
              aria-label="Zensus home"
            >
              <img
                src={zensusLogo}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-[22px] font-semibold tracking-[-0.02em] text-[hsl(var(--forest-foreground))]">
                Zensus
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-[hsl(var(--forest-muted))]">
              {ENTITY_SENTENCE}
            </p>

            <address className="text-sm not-italic leading-relaxed text-[hsl(var(--forest-muted))]">
              <p className="font-medium text-[hsl(var(--forest-foreground))]">{LEGAL_NAME}</p>
              {COMPANY_ADDRESSES.map((office) => (
                <p key={office.label} className="mt-2">
                  <span className="block">{office.street}</span>
                  <span className="block">
                    {office.locality}, {office.region} {office.postalCode}
                  </span>
                </p>
              ))}
              <p className="mt-2">
                <a href={`mailto:${SUPPORT_EMAIL}`} className={socialLinkClass}>
                  <Mail className="h-4 w-4" aria-hidden />
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </address>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Zensus profiles">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className={socialLinkClass}
                    aria-label={`Zensus on ${label}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5 lg:gap-8"
          >
            {FOOTER_COLUMNS.map((column) => (
              <FooterColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center text-sm text-[hsl(var(--forest-muted))] sm:text-left">
            © {new Date().getFullYear()} {LEGAL_NAME} All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end" aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <FooterLinkItem link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
