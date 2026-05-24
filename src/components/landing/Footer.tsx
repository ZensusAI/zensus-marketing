import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { TALK_TO_US_URL } from "@/lib/constants";

const COMPANY_LINKEDIN = "https://www.linkedin.com/company/zensusai";
const CONTACT_EMAIL = "hello@zensus.app";

const socialLinkClass =
  "inline-flex items-center gap-2 rounded-sm text-sm font-medium text-gray-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";

/** Google Maps embed: city of Austin, TX only (no street address). */
const AUSTIN_MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Austin%2C+TX&z=11&output=embed";

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
  "text-sm text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm";

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
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">{title}</h3>
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
  return (
    <footer className="border-t-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-sm dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
      <div className="section-container py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-8 lg:col-span-4">
            <div className="w-full max-w-md">
              <p className="text-left text-base font-semibold text-gray-300">Austin, TX</p>
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
          <p className="text-center text-sm text-muted-foreground sm:text-left">
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
