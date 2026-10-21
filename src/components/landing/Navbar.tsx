import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SIGN_IN_URL } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import { SignupModal } from "./SignupModal";
import zensusLogo from "@/assets/zensus-logo.png";
import plaidLogo from "@/assets/integrations/plaid.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import slackLogo from "@/assets/integrations/slack.svg";
import dashboard13Week from "@/assets/dashboard-13week.webp";
import runwayDrilldown from "@/assets/runway-drilldown-weekly.webp";
import runwayWhatIf from "@/assets/runway-whatif-overview.webp";
import runwayAlerts from "@/assets/runway-alerts-a.webp";

/*
 * Site navbar, redesigned from handoff 01-navbar (locked variant: mega menu
 * with the "Ask Zensus" Product panel). Shared by every route, so it is styled
 * with theme tokens: on the cream homepage the tokens resolve to the handoff's
 * exact colours, and the dark routes get the same layout in their own palette.
 *
 * Every panel is always in the DOM (display: none while closed), so the links
 * are in the prerendered HTML for search and AI crawlers, and the panel
 * screenshots, which are lazy, only load once a panel opens.
 *
 * The handoff's small mono uppercase labels ("Ask Zensus", "Built on", the
 * Resources column titles) are plain sentence-case labels here, per the
 * redesign's global rules.
 */

interface PanelLink {
  href: string;
  label: string;
  description: string;
}

interface Question {
  q: string;
  feature: string;
  href: string;
  url: string;
  img: string;
  width: number;
  height: number;
  alt: string;
  desc: string;
}

const QUESTIONS: Question[] = [
  {
    q: "When does my cash run out?",
    feature: "Zero-cash date and 13-week rolling forecast",
    href: "/#features",
    url: "app.zensus.app",
    img: dashboard13Week,
    width: 1984,
    height: 1468,
    alt: "Zensus 13-week rolling cash flow forecast with the zero-cash date",
    desc: "Zensus combines your bank, QuickBooks, and HubSpot data into a weekly forecast and recalculates your zero-cash date every time cash moves.",
  },
  {
    q: "When does this contract actually pay?",
    feature: "Drill down to any week or day",
    href: "/integrations/hubspot",
    url: "app.zensus.app/runway",
    img: runwayDrilldown,
    width: 1506,
    height: 906,
    alt: "Zensus weekly cash flow drill-down showing when subscription contracts pay",
    desc: "Click any month to see weekly cash flow, then drill into daily details. Subscription-aware projections show when annual and quarterly contracts hit your bank.",
  },
  {
    q: "Can I afford two engineers in Q3?",
    feature: "Plain-English scenarios",
    href: "/use-cases",
    url: "app.zensus.app/runway",
    img: runwayWhatIf,
    width: 2264,
    height: 1138,
    alt: "Zensus what-if scenario comparing cash runway before and after two hires",
    desc: "Stack hiring, churn, and pricing assumptions in one conversation and compare before-and-after projections. Revert any change instantly.",
  },
  // Added at the user's request (21 Oct 2026), not in the 01-navbar handoff:
  // the question investors put to a company. The scenario chat models a raise
  // as a one-off inflow (the chart labels it "raised") and stacks it with
  // other changes. There is no portfolio or fund-level view, so the copy stays
  // on the company's side of the table.
  {
    q: "How many months does this round buy us?",
    feature: "Funding scenarios",
    href: "/tools/runway-calculator",
    url: "app.zensus.app/runway",
    img: runwayWhatIf,
    width: 2264,
    height: 1138,
    alt: "Zensus scenario showing how a funding round moves the zero-cash date",
    desc: "Add a raise as a one-off inflow and see how far it moves your zero-cash date. Stack it with a hiring plan to see what the round really buys.",
  },
  {
    q: "Will I know before it gets tight?",
    feature: "Slack threshold alerts",
    href: "/integrations/slack",
    url: "app.zensus.app/alerts",
    img: runwayAlerts,
    width: 982,
    height: 554,
    alt: "Zensus cash floor alert settings for Slack",
    desc: "Set your cash floor. Zensus watches your 30-day projection and pings Slack when it crosses the line, then re-alerts on material change.",
  },
];

const PRODUCT_FOOTER: { href: string; label: string; accent?: boolean }[] = [
  { href: "/#features", label: "All features →", accent: true },
  { href: "/use-cases", label: "Use cases" },
  { href: "/quickbooks-cash-flow-forecasting", label: "For QuickBooks Online" },
];

const INTEGRATIONS = [
  { name: "Plaid", logo: plaidLogo, href: "/integrations/plaid", className: "logo-on-light" },
  { name: "QuickBooks", logo: quickbooksLogo, href: "/integrations/quickbooks" },
  { name: "HubSpot", logo: hubspotLogo, href: "/integrations/hubspot" },
  { name: "Slack", logo: slackLogo, href: "/integrations/slack" },
];

const LEARN: PanelLink[] = [
  { href: "/blog", label: "Blog", description: "Guides, product updates, and announcements." },
  { href: "/changelog", label: "Changelog", description: "Ship notes and what's new in Zensus." },
  { href: "/#faq", label: "FAQ", description: "Quick answers about pricing, data, and setup." },
  { href: "/about", label: "About Us", description: "The company and the founder behind Zensus." },
];

const TOOLS: PanelLink[] = [
  {
    href: "/tools/runway-calculator",
    label: "Runway Calculator",
    description: "Model cash runway, zero-cash date, and hiring impact.",
  },
  {
    href: "/tools/payroll-calendar",
    label: "Payroll Calendar",
    description: "Map pay dates and three-paycheck months for 2026 and 2027.",
  },
  {
    href: "/tools/13-week-cash-flow-template",
    label: "13-Week Cash Flow Template",
    description: "Free Excel template, plus a builder to see your 13 weeks first.",
  },
];

const COMPARE: PanelLink[] = [
  { href: "/compare/zensus-vs-float", label: "Zensus vs Float", description: "Bank feeds, CRM data, and alerts compared." },
  { href: "/compare/zensus-vs-pulse", label: "Zensus vs Pulse", description: "Spreadsheet-style planning or a live forecast." },
  {
    href: "/compare/zensus-vs-cash-flow-frog",
    label: "Zensus vs Cash Flow Frog",
    description: "Side by side on integrations and scenarios.",
  },
  { href: "/compare/float-alternatives", label: "Float alternatives", description: "The tools businesses shortlist instead." },
];

const RESOURCE_COLUMNS = [
  { title: "Learn", links: LEARN },
  { title: "Free tools", links: TOOLS },
  { title: "Compare", links: COMPARE },
];

// Mobile "Learn" chips. "Compare" has no index page; it opens the broadest
// comparison, the Float alternatives roundup.
const LEARN_SHORT = [
  { href: "/blog", label: "Blog" },
  { href: "/changelog", label: "Changelog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/compare/float-alternatives", label: "Compare" },
  { href: "/about", label: "About Us" },
];

type MenuKey = "product" | "resources";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Hash links (/#features, /#faq) are plain anchors so the browser does the
// jump; everything else is a router link.
const NavAnchor = ({
  href,
  className,
  children,
  onClick,
  ariaLabel,
  onMouseEnter,
  onFocus,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  onMouseEnter?: () => void;
  onFocus?: () => void;
}) =>
  href.includes("#") ? (
    <a href={href} className={className} onClick={onClick} aria-label={ariaLabel} onMouseEnter={onMouseEnter} onFocus={onFocus}>
      {children}
    </a>
  ) : (
    <Link to={href} className={className} onClick={onClick} aria-label={ariaLabel} onMouseEnter={onMouseEnter} onFocus={onFocus}>
      {children}
    </Link>
  );

const PanelLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("text-[13px] font-semibold text-muted-foreground", className)}>{children}</p>
);

const SignInLink = ({ source, className }: { source: string; className: string }) => (
  <a
    href={SIGN_IN_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    onClick={() => trackCtaClick(source, { destination: "signin" })}
  >
    Sign in
  </a>
);

const TrialButton = ({ source, className, arrow = true }: { source: string; className: string; arrow?: boolean }) => (
  <SignupModal>
    <button
      type="button"
      className={className}
      onClick={() => trackCtaClick(source, { destination: "trial", action: "open_signup_modal" })}
    >
      Start
      {arrow && <ArrowRight size={16} aria-hidden />}
    </button>
  </SignupModal>
);

function ProductPanel({ onNavigate }: { onNavigate: () => void }) {
  const [active, setActive] = useState(0);
  const current = QUESTIONS[active];

  return (
    <div className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-10 px-8 pb-6 pt-7">
      <div className="flex flex-col">
        <PanelLabel className="mb-2.5">Ask Zensus</PanelLabel>
        <ul>
          {QUESTIONS.map((row, i) => {
            const on = i === active;
            return (
              <li key={row.q}>
                <NavAnchor
                  href={row.href}
                  onClick={onNavigate}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    "-mx-3.5 flex items-center gap-3.5 rounded-xl p-3.5 transition-colors duration-200 motion-reduce:transition-none",
                    on ? "bg-secondary" : "bg-transparent",
                    focusRing,
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "font-mono text-[15px] font-semibold transition-colors duration-200",
                      on ? "text-sage-deep" : "text-muted-foreground/50",
                    )}
                  >
                    &gt;
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[14.5px] text-foreground">{row.q}</span>
                    <span className="mt-[3px] block text-[13px] text-muted-foreground">{row.feature}</span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "text-base text-primary transition-all duration-[250ms] motion-reduce:transition-none",
                      on ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0",
                    )}
                  >
                    →
                  </span>
                </NavAnchor>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border pt-4 text-[13.5px] font-semibold">
          {PRODUCT_FOOTER.map((l) => (
            <NavAnchor
              key={l.href}
              href={l.href}
              onClick={onNavigate}
              className={cn("rounded", l.accent ? "text-primary" : "text-foreground", "hover:underline", focusRing)}
            >
              {l.label}
            </NavAnchor>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="overflow-hidden rounded-[14px] border border-forest-border bg-[#19291F] shadow-[0_24px_48px_-28px_rgba(15,28,22,.6)]">
          <div className="flex items-center gap-2.5 border-b border-forest-border/60 bg-forest px-3 py-[9px]">
            <span aria-hidden className="flex gap-[5px]">
              <span className="h-2 w-2 rounded-full bg-forest-border" />
              <span className="h-2 w-2 rounded-full bg-forest-border" />
              <span className="h-2 w-2 rounded-full bg-forest-border" />
            </span>
            <span className="flex-1 text-center font-mono text-[10.5px] text-forest-muted">{current.url}</span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-sage-light">Live</span>
          </div>
          <div className="relative aspect-[16/8.2]">
            {QUESTIONS.map((row, i) => (
              <img
                key={row.q}
                src={row.img}
                alt={i === active ? row.alt : ""}
                aria-hidden={i !== active}
                width={row.width}
                height={row.height}
                loading="lazy"
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover object-left-top transition-[opacity,transform] duration-[450ms] motion-reduce:transition-none",
                  i === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                )}
              />
            ))}
          </div>
        </div>
        {/* All four descriptions stay in the HTML; only the active one shows. */}
        <div className="grid min-h-[42px] text-[13.5px] leading-[1.55] text-muted-foreground">
          {QUESTIONS.map((row, i) => (
            <p
              key={row.q}
              aria-hidden={i !== active}
              className={cn("col-start-1 row-start-1 m-0", i === active ? "visible" : "invisible")}
            >
              {row.desc}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-3.5 text-xs text-muted-foreground">
          <span>Built on</span>
          {INTEGRATIONS.map((g) => (
            <img key={g.name} src={g.logo} alt={g.name} width={18} height={18} className={cn("h-[18px] w-[18px] object-contain", g.className)} />
          ))}
          <Link to="/integrations" onClick={onNavigate} className={cn("ml-auto rounded font-semibold text-primary hover:underline", focusRing)}>
            Integrations →
          </Link>
        </div>
      </div>
    </div>
  );
}

const ResourcesPanel = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="mx-auto grid max-w-[1280px] grid-cols-3 gap-10 p-8">
    {RESOURCE_COLUMNS.map((col) => (
      <div key={col.title}>
        <PanelLabel className="mb-3">{col.title}</PanelLabel>
        <ul>
          {col.links.map((l) => (
            <li key={l.href}>
              <NavAnchor
                href={l.href}
                onClick={onNavigate}
                className={cn("-mx-3 block rounded-[10px] px-3 py-[9px] transition-colors hover:bg-secondary", focusRing)}
              >
                <span className="block text-[15px] font-semibold text-foreground">{l.label}</span>
                <span className="mt-0.5 block text-[13px] leading-[1.4] text-muted-foreground">{l.description}</span>
              </NavAnchor>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const panelShell =
  "absolute inset-x-0 top-full z-20 border-b border-border bg-card shadow-[0_30px_60px_-30px_rgba(26,42,40,.35)] animate-nav-in motion-reduce:animate-none";

function DesktopNav({ open, setOpen }: { open: MenuKey | null; setOpen: (k: MenuKey | null) => void }) {
  const close = useCallback(() => setOpen(null), [setOpen]);
  // Hover and focus open a panel a moment before the click that caused them;
  // without this the click would toggle the panel straight back shut.
  const openedAt = useRef(0);
  const openFrom = (key: MenuKey) => {
    if (open !== key) openedAt.current = Date.now();
    setOpen(key);
  };

  const trigger = (key: MenuKey, label: string, panel: ReactNode) => {
    const on = open === key;
    return (
      <li
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            if (open === key) close();
          }
        }}
      >
        <button
          type="button"
          aria-expanded={on}
          aria-controls={`nav-panel-${key}`}
          onPointerEnter={(e) => e.pointerType === "mouse" && openFrom(key)}
          onFocus={() => openFrom(key)}
          onClick={() => {
            if (on && Date.now() - openedAt.current < 400) return;
            setOpen(on ? null : key);
          }}
          className={cn(
            "relative flex h-16 items-center gap-1.5 text-[15px] font-semibold text-foreground",
            "focus-visible:outline-none focus-visible:after:absolute focus-visible:after:inset-x-[-6px] focus-visible:after:inset-y-4 focus-visible:after:rounded focus-visible:after:ring-2 focus-visible:after:ring-ring",
          )}
        >
          {label}
          <ChevronDown
            size={14}
            aria-hidden
            className={cn("transition-transform duration-200 motion-reduce:transition-none", on && "rotate-180")}
          />
          <span
            aria-hidden
            className={cn(
              "absolute -bottom-px left-0 z-30 h-0.5 bg-primary transition-[width] duration-200 motion-reduce:transition-none",
              on ? "w-full" : "w-0",
            )}
          />
        </button>
        <div id={`nav-panel-${key}`} className={cn(panelShell, !on && "hidden")}>
          {panel}
        </div>
      </li>
    );
  };

  const plainLink = (href: string, label: string) => (
    <li>
      <Link
        to={href}
        onPointerEnter={(e) => e.pointerType === "mouse" && close()}
        onFocus={close}
        className={cn("flex h-16 items-center text-[15px] font-semibold text-foreground", focusRing)}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <ul className="flex items-center gap-9">
      {trigger("product", "Product", <ProductPanel onNavigate={close} />)}
      {plainLink("/pricing", "Pricing")}
      {plainLink("/security", "Security")}
      {trigger("resources", "Resources", <ResourcesPanel onNavigate={close} />)}
    </ul>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const rowBorder = "border-b border-border/70";

  return (
    <div
      id="nav-mobile-drawer"
      className={cn(
        // Absolute, not fixed: the nav's backdrop-filter makes it the
        // containing block for fixed children.
        "absolute inset-x-0 top-full z-40 flex h-[calc(100dvh-4rem-env(safe-area-inset-top))] flex-col bg-card animate-nav-in motion-reduce:animate-none lg:hidden",
        !open && "hidden",
      )}
    >
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-3">
        <PanelLabel className="mb-1.5 mt-2">Ask Zensus</PanelLabel>
        <ul>
          {QUESTIONS.map((row, i) => {
            const on = i === active;
            return (
              <li key={row.q} className={rowBorder}>
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setActive(on ? -1 : i)}
                  className={cn("flex w-full gap-2.5 py-3 text-left", focusRing)}
                >
                  <span aria-hidden className={cn("font-mono font-semibold", on ? "text-sage-deep" : "text-muted-foreground/50")}>
                    &gt;
                  </span>
                  <span className="flex-1">
                    <span className="block font-mono text-sm text-foreground">{row.q}</span>
                    <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{row.feature}</span>
                  </span>
                </button>
                {on && (
                  <NavAnchor
                    href={row.href}
                    onClick={onClose}
                    ariaLabel={row.q}
                    className={cn("mb-3 block overflow-hidden rounded-[10px] border border-forest-border animate-nav-in motion-reduce:animate-none", focusRing)}
                  >
                    <img src={row.img} alt={row.alt} width={row.width} height={row.height} loading="lazy" decoding="async" className="block w-full" />
                  </NavAnchor>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-3.5 flex gap-2">
          {INTEGRATIONS.map((g) => (
            <Link
              key={g.name}
              to={g.href}
              onClick={onClose}
              aria-label={`${g.name} integration`}
              className={cn("flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-background", focusRing)}
            >
              <img src={g.logo} alt="" width={20} height={20} className={cn("h-5 w-5 object-contain", g.className)} />
            </Link>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {[
            { href: "/pricing", label: "Pricing" },
            { href: "/security", label: "Security" },
          ].map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={onClose}
              className={cn("rounded-xl border border-border p-3.5 text-base font-semibold text-foreground", focusRing)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <PanelLabel className="mb-1.5 mt-[22px]">Free tools</PanelLabel>
        <ul>
          {TOOLS.map((t) => (
            <li key={t.href} className={rowBorder}>
              <Link
                to={t.href}
                onClick={onClose}
                className={cn("flex justify-between py-[11px] text-base font-semibold text-foreground", focusRing)}
              >
                {t.label}
                <span aria-hidden className="font-normal text-muted-foreground">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <PanelLabel className="mb-1.5 mt-[22px]">Learn</PanelLabel>
        <div className="flex flex-wrap gap-2">
          {LEARN_SHORT.map((l) => (
            <NavAnchor
              key={l.label}
              href={l.href}
              onClick={onClose}
              className={cn("rounded-full border border-border px-3.5 py-[9px] text-sm font-medium text-foreground", focusRing)}
            >
              {l.label}
            </NavAnchor>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1.6fr] gap-2 border-t border-border bg-background px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3.5">
        <SignInLink
          source="navbar_mobile"
          className={cn(
            "flex h-12 items-center justify-center rounded-full border border-border bg-card text-[15px] font-semibold text-foreground",
            focusRing,
          )}
        />
        <TrialButton
          source="navbar_mobile"
          arrow={false}
          className={cn(
            "flex h-12 items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-primary-foreground",
            focusRing,
          )}
        />
      </div>
    </div>
  );
}

const Navbar = () => {
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { pathname, hash } = useLocation();

  // Close everything on navigation.
  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [pathname, hash]);

  // Esc closes and returns focus to the trigger; a click outside closes.
  useEffect(() => {
    if (!open && !drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = open && navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="nav-panel-${open}"]`);
      // Focus first: the trigger's focus handler opens its panel, and the
      // close below has to be the last update to win.
      trigger?.focus();
      setOpen(null);
      setDrawer(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, drawer]);

  // The mobile sheet is full screen; stop the page scrolling behind it.
  useEffect(() => {
    if (!drawer) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [drawer]);

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      onMouseLeave={() => setOpen(null)}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-border pt-[env(safe-area-inset-top)] backdrop-blur-[24px] transition-[background-color] duration-200",
        open || drawer ? "bg-card" : "bg-background/[0.82]",
      )}
    >
      <div className="mx-auto grid h-16 max-w-[1280px] grid-cols-[1fr_auto] items-center pl-5 pr-3 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link to="/" aria-label="Zensus home" className={cn("flex items-center gap-[9px] justify-self-start rounded", focusRing)}>
          <img src={zensusLogo} alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
          <span className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">Zensus</span>
        </Link>

        <div className="hidden lg:block">
          <DesktopNav open={open} setOpen={setOpen} />
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          <div className="hidden items-center gap-3 lg:flex">
            <SignInLink source="navbar_desktop" className={cn("rounded px-3 py-2 text-sm font-medium text-foreground", focusRing)} />
            <TrialButton
              source="navbar_desktop"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full bg-primary px-[18px] text-sm font-semibold text-primary-foreground transition-colors hover:bg-[hsl(150_70%_41%)]",
                focusRing,
              )}
            />
          </div>
          <button
            type="button"
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            aria-controls="nav-mobile-drawer"
            onClick={() => setDrawer((d) => !d)}
            className={cn("flex h-11 w-11 items-center justify-center rounded text-foreground lg:hidden", focusRing)}
          >
            {drawer ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>
      </div>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </nav>
  );
};

export default Navbar;
