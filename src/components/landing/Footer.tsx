import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { TALK_TO_US_URL } from "@/lib/constants";
import zensusLogo from "@/assets/zensus-logo.png";

const COMPANY_LINKEDIN = "https://www.linkedin.com/company/zensusai";
const CONTACT_EMAIL = "support@zensus.app";

const socialLinkClass =
  "inline-flex items-center gap-2 rounded-sm text-sm font-medium text-[hsl(var(--forest-muted))] transition-colors hover:text-[hsl(var(--forest-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--sage-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--forest))]";

/** Google Maps embed: city of Austin, TX only (no street address). */
const AUSTIN_MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Austin%2C+TX&z=11&output=embed";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  children?: FooterLink[];
};

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Use Cases", href: "/use-cases" },
      {
        label: "Tools",
        href: "#",
        children: [
          { label: "Runway Calculator", href: "/tools/runway-calculator" },
          { label: "Payroll Calendar", href: "/tools/payroll-calendar" },
        ],
      },
      { label: "FAQ", href: "/#faq" },
      { label: "Pricing", href: "/pricing" },
      { label: "Book a call", href: TALK_TO_US_URL, external: true },
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
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Subprocessors", href: "/subprocessors" },
    ],
  },
];

const linkClass =
  "text-sm text-[hsl(var(--forest-muted))] transition-colors hover:text-[hsl(var(--forest-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--sage-light))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--forest))] rounded-sm";

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.children && link.children.length > 0) {
    return (
      <details className="group">
        <summary className={`${linkClass} inline-flex cursor-pointer list-none items-center gap-1.5`}>
          {link.label}
          <span
            className="text-xs transition-transform duration-150 group-open:rotate-180"
            aria-hidden
          >
            ▾
          </span>
        </summary>
        <ul className="mt-2 space-y-2 pl-3">
          {link.children.map((child) => (
            <li key={child.label}>
              <FooterLinkItem link={child} />
            </li>
          ))}
        </ul>
      </details>
    );
  }

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
          <div className="flex flex-col gap-8 lg:col-span-4">
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
            <div className="w-full max-w-md">
              <p className="text-left text-base font-semibold text-[hsl(var(--forest-foreground))]">Austin, TX</p>
              <div className="relative mt-3 aspect-[5/2] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-inner">
                <iframe
                  title="Map centered on Austin, Texas"
                  src={AUSTIN_MAP_EMBED_SRC}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href={COMPANY_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  aria-label="Zensus on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" aria-hidden />
                  LinkedIn
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={socialLinkClass}
                  aria-label={`Email ${CONTACT_EMAIL}`}
                >
                  <Mail className="h-5 w-5" aria-hidden />
                  Email
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-8 lg:gap-10">
            {FOOTER_COLUMNS.map((column) => (
              <FooterColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center text-sm text-[hsl(var(--forest-muted))] sm:text-left">
            © {new Date().getFullYear()} Zensus. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
            <Link to="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link to="/terms" className={linkClass}>
              Terms
            </Link>
            <Link to="/subprocessors" className={linkClass}>
              Subprocessors
            </Link>
            <Link to="/security" className={linkClass}>
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
