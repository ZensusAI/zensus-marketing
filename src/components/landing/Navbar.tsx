import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TalkToUsButton } from "./TalkToUsButton";
import { SIGN_IN_URL } from "@/lib/constants";
import zensusLogo from "@/assets/zensus-logo.png";

interface NavLink {
  href: string;
  label: string;
  isRoute: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/#features", label: "Product", isRoute: false },
  { href: "/integrations", label: "Integrations", isRoute: true },
  { href: "/changelog", label: "Changelog", isRoute: true },
  { href: "/security", label: "Security", isRoute: true },
];

const linkClass =
  "text-sm text-muted-foreground hover:text-foreground transition-colors";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={zensusLogo}
              alt="Zensus logo"
              className="h-8 w-8 rounded-lg"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold text-foreground">Zensus</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) =>
              link.isRoute ? (
                <Link key={link.href} to={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ),
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <a href={SIGN_IN_URL} target="_blank" rel="noopener noreferrer">
                Sign in
              </a>
            </Button>
            <TalkToUsButton size="sm" />
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="flex flex-col gap-4 py-5 pb-24">
              {NAV_LINKS.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={linkClass}
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className={linkClass}
                    onClick={close}
                  >
                    {link.label}
                  </a>
                ),
              )}
              <Button asChild variant="ghost" className="justify-start px-0">
                <a
                  href={SIGN_IN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                >
                  Sign in
                </a>
              </Button>
            </div>
            <div className="fixed left-0 right-0 bottom-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border">
              <TalkToUsButton size="lg" className="w-full justify-center" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
