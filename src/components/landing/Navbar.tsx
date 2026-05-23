import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Button } from "@/components/ui/button";
import { TalkToUsButton } from "./TalkToUsButton";
import { SIGN_IN_URL } from "@/lib/constants";
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
}

interface NavMenu {
  label: string;
  children: NavChild[];
}

type NavEntry = NavLinkItem | NavMenu;

const isMenu = (entry: NavEntry): entry is NavMenu => "children" in entry;

const NAV: NavEntry[] = [
  { href: "/#features", label: "Product", isRoute: false },
  { href: "/integrations", label: "Integrations", isRoute: true },
  {
    label: "Resources",
    children: [
      {
        href: "/changelog",
        label: "Changelog",
        description: "Ship notes and what's new in Zensus.",
      },
      {
        href: "/blog",
        label: "Blog",
        description: "Guides, product updates, and announcements.",
      },
    ],
  },
  { href: "/security", label: "Security", isRoute: true },
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

// Desktop "Resources"-style dropdown, built on the Radix NavigationMenu
// primitive (hover intent, keyboard nav, and Escape come for free). We omit the
// shadcn Viewport and render the panel in place so its links stay in the static
// prerendered HTML via `forceMount` — Googlebot and AI crawlers see the same
// anchors whether or not the menu is open.
function DesktopMenu({ menu }: { menu: NavMenu }) {
  const { pathname } = useLocation();
  const groupActive = menu.children.some((c) => c.href === pathname);

  return (
    <NavigationMenu.Root delayDuration={100} aria-label={menu.label} className="relative">
      <NavigationMenu.List className="m-0 flex list-none p-0">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
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

          {/* Default to hidden + non-interactive; reveal only on the open
              state. This stays correct whether or not Radix stamps a
              data-state="closed" on force-mounted, inactive content. */}
          <NavigationMenu.Content
            forceMount
            className="absolute left-0 top-full pt-3 translate-y-1 opacity-0 pointer-events-none transition-[opacity,transform] duration-200 data-[state=open]:translate-y-0 data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto"
          >
            <div className="w-72 rounded-xl border border-border bg-background/95 p-2 shadow-2xl backdrop-blur-xl">
              {menu.children.map((child) => {
                const active = child.href === pathname;
                return (
                  <NavigationMenu.Link asChild key={child.href}>
                    <Link
                      to={child.href}
                      className={`block rounded-lg px-3 py-2.5 transition-colors ${focusRing} ${
                        active ? "bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-[15px] font-semibold text-white">
                        {child.label}
                        {active && (
                          <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                        {child.description}
                      </span>
                    </Link>
                  </NavigationMenu.Link>
                );
              })}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
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
          {menu.children.map((child) => (
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
          ))}
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

          <div className="hidden md:flex items-center gap-8 justify-self-center">
            {NAV.map((entry) =>
              isMenu(entry) ? (
                <DesktopMenu key={entry.label} menu={entry} />
              ) : (
                <DesktopLink key={entry.href} link={entry} />
              ),
            )}
          </div>

          <div className="flex items-center gap-3 justify-self-end">
            <div className="hidden md:flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className={`rounded-full ${focusRing}`}>
                <a href={SIGN_IN_URL} target="_blank" rel="noopener noreferrer">
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
                  onClick={close}
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
