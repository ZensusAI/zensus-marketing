import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Button } from "@/components/ui/button";
import { TalkToUsButton } from "./TalkToUsButton";
import { SIGN_IN_URL } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics/events";
import zensusLogo from "@/assets/zensus-logo.png";

interface NavLinkItem {
  href: string;
  label: string;
  isRoute: boolean;
}

interface NavChild {
  href: string;
  label: string;
  description: string;
  // Hash-anchor children (e.g. /#features) render as plain <a> tags so the
  // browser handles the jump natively; router children render as <Link>.
  isRoute?: boolean;
}

interface NavMenu {
  label: string;
  children: NavChild[];
}

type NavEntry = NavLinkItem | NavMenu;

const isMenu = (entry: NavEntry): entry is NavMenu => "children" in entry;

const NAV: NavEntry[] = [
  {
    label: "Product",
    children: [
      {
        href: "/#features",
        label: "Features",
        description: "Runway, alerts, and scenario planning in one view.",
        isRoute: false,
      },
      {
        href: "/integrations",
        label: "Integrations",
        description: "Plaid, QuickBooks, HubSpot, and Slack.",
      },
      {
        href: "/use-cases",
        label: "Use Cases",
        description: "Who Zensus is for and the problems it solves.",
      },
      {
        href: "/security",
        label: "Security",
        description: "How Zensus protects your financial data.",
      },
    ],
  },
  {
    label: "Resources",
    children: [
      {
        href: "/blog",
        label: "Blog",
        description: "Guides, product updates, and announcements.",
      },
      {
        href: "/changelog",
        label: "Changelog",
        description: "Ship notes and what's new in Zensus.",
      },
      {
        href: "/#faq",
        label: "FAQ",
        description: "Quick answers about pricing, data, and setup.",
        isRoute: false,
      },
    ],
  },
  {
    label: "Company",
    children: [
      {
        href: "/about",
        label: "About",
        description: "The company and the founder behind Zensus.",
      },
    ],
  },
];

// Flip a boolean when the user has scrolled past a small threshold. We use
// requestAnimationFrame to coalesce scroll events so the listener can't pile up.
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      setScrolled(window.scrollY > threshold);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return scrolled;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const desktopLinkBase =
  "relative text-[15px] font-semibold text-white rounded transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-[width] after:duration-200 hover:after:w-full";

function DesktopLink({ link }: { link: NavLinkItem }) {
  if (!link.isRoute) {
    return (
      <a
        href={link.href}
        className={`${desktopLinkBase} ${focusRing}`}
      >
        {link.label}
      </a>
    );
  }
  return (
    <NavLink
      to={link.href}
      className={`${desktopLinkBase} ${focusRing}`}
    >
      {({ isActive }) => (
        <span className="flex items-center gap-1.5">
          {link.label}
          {isActive && (
            <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
          )}
        </span>
      )}
    </NavLink>
  );
}

// Desktop dropdowns, built on a single Radix NavigationMenu root with a shared
// Viewport (the Stripe-style "morphing dropdown"). One panel stays open while
// the pointer slides between triggers: it glides horizontally under the active
// trigger and morphs its height to fit the next menu, instead of closing and
// reopening. Hover intent, keyboard nav, and Escape come for free. We style
// the shared Viewport ourselves (no shadcn wrapper) and `forceMount` both the
// Viewport and every Content so all dropdown links stay in the static
// prerendered HTML — Googlebot and AI crawlers see the same anchors whether or
// not a menu is open.
function DesktopNav({ entries }: { entries: NavEntry[] }) {
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLElement>(null);
  // Horizontal center of the active trigger, relative to the nav root. The
  // shared viewport translates to sit centered under it; transitioning that
  // transform is what makes the panel glide between menus.
  const [center, setCenter] = useState(0);
  // Radix does not stamp data-state on force-mounted Content inside a shared
  // Viewport, so we track the open menu ourselves to toggle which panel is
  // visible. lastValue keeps the outgoing panel visible while the viewport
  // fades out on close, instead of emptying the box mid-fade.
  const [value, setValue] = useState("");
  const lastValue = useRef("");

  const handleValueChange = (next: string) => {
    setValue(next);
    if (!next || !rootRef.current) return;
    lastValue.current = next;
    const trigger = rootRef.current.querySelector<HTMLElement>(
      `[data-nav-trigger="${CSS.escape(next)}"]`,
    );
    if (!trigger) return;
    const rootBox = rootRef.current.getBoundingClientRect();
    const box = trigger.getBoundingClientRect();
    setCenter(box.left - rootBox.left + box.width / 2);
  };

  const shownMenu = value || lastValue.current;

  return (
    <NavigationMenu.Root
      ref={rootRef}
      delayDuration={100}
      onValueChange={handleValueChange}
      aria-label="Main"
      className="relative"
    >
      <NavigationMenu.List className="m-0 flex list-none items-center gap-8 p-0">
        {entries.map((entry) => {
          if (!isMenu(entry)) {
            // Plain top-level links (none today) still slot into the shared
            // list so future additions keep their position among the menus.
            return (
              <NavigationMenu.Item key={entry.href} className="flex">
                <DesktopLink link={entry} />
              </NavigationMenu.Item>
            );
          }
          const menu = entry;
          const groupActive = menu.children.some((c) => c.href === pathname);
          return (
            <NavigationMenu.Item key={menu.label} value={menu.label}>
              <NavigationMenu.Trigger
                data-nav-trigger={menu.label}
                className={`group/res flex items-center gap-1.5 ${desktopLinkBase} ${focusRing} data-[state=open]:after:w-full`}
              >
                <span className="flex items-center gap-1.5">
                  {menu.label}
                  {groupActive && (
                    <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                  )}
                </span>
                <ChevronDown
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/res:rotate-180"
                />
              </NavigationMenu.Trigger>

              {/* Rendered into the shared Viewport below. Stacked absolutely;
                  the inactive panels crossfade out while the viewport glides
                  and resizes, which reads as one continuous panel. */}
              <NavigationMenu.Content
                forceMount
                className={`absolute left-0 top-0 w-72 p-2 transition-opacity duration-200 ${
                  shownMenu === menu.label
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                {menu.children.map((child) => {
                  const active = child.href === pathname;
                  const className = `block rounded-lg px-3 py-2.5 transition-colors ${focusRing} ${
                    active ? "bg-primary/5" : "hover:bg-muted/50"
                  }`;
                  const body = (
                    <>
                      <span className="flex items-center gap-1.5 text-[15px] font-semibold text-white">
                        {child.label}
                        {active && (
                          <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                        {child.description}
                      </span>
                    </>
                  );
                  return (
                    <NavigationMenu.Link asChild key={child.href}>
                      {child.isRoute === false ? (
                        <a href={child.href} className={className}>
                          {body}
                        </a>
                      ) : (
                        <Link to={child.href} className={className}>
                          {body}
                        </Link>
                      )}
                    </NavigationMenu.Link>
                  );
                })}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      {/* The wrapper owns the horizontal glide (transform transition toward
          the active trigger); the Viewport owns the size morph via Radix's
          measured CSS variables and the open/close fade. */}
      <div
        className="absolute left-0 top-full pt-3 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(calc(${center}px - 50%))` }}
      >
        <NavigationMenu.Viewport
          forceMount
          className={[
            "relative overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl",
            "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)]",
            "transition-[width,height,opacity,transform] duration-300 ease-out",
            "translate-y-1 opacity-0 pointer-events-none",
            "data-[state=open]:translate-y-0 data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto",
          ].join(" ")}
        />
      </div>
    </NavigationMenu.Root>
  );
}

const mobileLinkBase =
  "px-2 py-3 text-[17px] font-semibold text-white rounded-lg transition-colors";

function MobileLink({ link, onClose }: { link: NavLinkItem; onClose: () => void }) {
  if (!link.isRoute) {
    return (
      <a
        href={link.href}
        onClick={onClose}
        className={`${mobileLinkBase} ${focusRing} hover:bg-muted/40`}
      >
        {link.label}
      </a>
    );
  }
  return (
    <NavLink
      to={link.href}
      onClick={onClose}
      className={({ isActive }) =>
        `${mobileLinkBase} ${focusRing} ${
          isActive ? "bg-primary/5" : "hover:bg-muted/40"
        }`
      }
    >
      {link.label}
    </NavLink>
  );
}

// Mobile "Resources" group: a tap-to-toggle row that reveals indented children.
// Plain state toggle keeps it consistent with the hand-rolled mobile panel.
function MobileMenuGroup({ menu, onClose }: { menu: NavMenu; onClose: () => void }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => menu.children.some((c) => c.href === pathname));

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`${mobileLinkBase} ${focusRing} flex w-full items-center justify-between hover:bg-muted/40`}
      >
        {menu.label}
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden pl-3 transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-l border-border/60 pl-3 py-1">
          {menu.children.map((child) =>
            child.isRoute === false ? (
              <a
                key={child.href}
                href={child.href}
                onClick={onClose}
                className={`px-2 py-2.5 text-[15px] font-medium rounded-lg transition-colors ${focusRing} text-muted-foreground hover:bg-muted/40 hover:text-white`}
              >
                {child.label}
              </a>
            ) : (
              <NavLink
                key={child.href}
                to={child.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `px-2 py-2.5 text-[15px] font-medium rounded-lg transition-colors ${focusRing} ${
                    isActive ? "bg-primary/5 text-white" : "text-muted-foreground hover:bg-muted/40 hover:text-white"
                  }`
                }
              >
                {child.label}
              </NavLink>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrolled();
  const close = () => setIsOpen(false);

  return (
    <nav
      data-scrolled={scrolled || isOpen}
      className={[
        "group/nav fixed top-0 left-0 right-0 z-50",
        "pt-[env(safe-area-inset-top)]",
        "bg-background/20 backdrop-blur-lg",
        "data-[scrolled=true]:bg-background/60 data-[scrolled=true]:backdrop-blur-2xl",
        "transition-[background-color,backdrop-filter] duration-300",
        // Soft hairline that fades in when scrolled, in place of a hard border.
        "after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0",
        "after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent",
        "after:opacity-0 data-[scrolled=true]:after:opacity-100 after:transition-opacity after:duration-300",
      ].join(" ")}
    >
      <div className="section-container">
        {/* Three-column grid so the center nav is mathematically centered on
            the full width, regardless of the left and right group widths. */}
        <div className="grid grid-cols-[1fr_auto_1fr] h-16 items-center group-data-[scrolled=true]/nav:h-14 transition-[height] duration-300">
          <Link
            to="/"
            className={`group/logo flex items-center gap-2 rounded justify-self-start ${focusRing}`}
            aria-label="Zensus home"
          >
            <img
              src={zensusLogo}
              alt=""
              className="h-8 w-8 rounded-lg transition-transform duration-200 motion-safe:group-hover/logo:scale-105"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold text-foreground">Zensus</span>
          </Link>

          <div className="hidden md:block justify-self-center">
            <DesktopNav entries={NAV} />
          </div>

          <div className="flex items-center gap-3 justify-self-end">
            <div className="hidden md:flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className={`rounded-full ${focusRing}`}>
                <a
                  href={SIGN_IN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackCtaClick("navbar_desktop", { destination: "signin" })
                  }
                >
                  Sign in
                </a>
              </Button>
              <TalkToUsButton
                size="sm"
                className="shadow-[0_0_20px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_28px_hsl(var(--primary)/0.4)] transition-shadow"
              />
            </div>

            <button
              className={`md:hidden p-2 text-foreground rounded ${focusRing}`}
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile panel. We keep it mounted and animate max-height + opacity so
            the open/close is smooth, not a hard swap. */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col gap-1 py-4">
            {NAV.map((entry) =>
              isMenu(entry) ? (
                <MobileMenuGroup key={entry.label} menu={entry} onClose={close} />
              ) : (
                <MobileLink key={entry.href} link={entry} onClose={close} />
              ),
            )}
            <div className="mt-3 flex flex-col gap-2">
              <Button asChild variant="ghost" className={`justify-start ${focusRing}`}>
                <a
                  href={SIGN_IN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCtaClick("navbar_mobile", { destination: "signin" });
                    close();
                  }}
                >
                  Sign in
                </a>
              </Button>
              <TalkToUsButton
                size="lg"
                className="w-full justify-center shadow-[0_0_24px_hsl(var(--primary)/0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
