import { useState } from "react";
import { Menu, X, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import zensusLogo from "@/assets/zensus-logo.png";

const openCalendly = () => {
  (window as any).Calendly?.initPopupWidget({ url: "https://calendly.com/hello-zensus/introcall" });
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing", isRoute: true },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <img src={zensusLogo} alt="Zensus logo" className="h-8 w-8 rounded-lg" width={32} height={32} />
            <span className="text-xl font-semibold text-foreground">Zensus</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={openCalendly}
            >
              <Calendar size={16} className="mr-1.5" />
              Book Demo
            </Button>
            <Button asChild className="glow-sm">
              <a href="https://app.zensus.app/login">Get Started</a>
            </Button>
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
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <Button
                variant="outline"
                className="mt-2 rounded-full"
                onClick={() => { openCalendly(); setIsOpen(false); }}
              >
                <Calendar size={16} className="mr-1.5" />
                Book Demo
              </Button>
              <Button asChild>
                <a href="https://app.zensus.app/login" onClick={() => setIsOpen(false)}>Get Started</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
