import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TalkToUsButton } from "./TalkToUsButton";
import { SIGN_IN_URL } from "@/lib/constants";
import zensusLogo from "@/assets/zensus-logo.png";

interface NavItem {
  href: string;
  label: string;
  isRoute: boolean;
}

const NAV_LINKS: NavItem[] = [
  { href: "/#features", label: "Product", isRoute: false },
  { href: "/integrations", label: "Integrations", isRoute: true },
  { href: "/changelog", label: "Changelog", isRoute: true },
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

function DesktopLink({ link }: { link: NavItem }) {
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

const mobileLinkBase =
  "px-2 py-3 text-[17px] font-semibold text-white rounded-lg transition-colors";

function MobileLink({ link, onClose }: { link: NavItem; onClose: () => void }) {
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
            {NAV_LINKS.map((link) => (
              <DesktopLink key={link.href} link={link} />
            ))}
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
            isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <MobileLink key={link.href} link={link} onClose={close} />
            ))}
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
