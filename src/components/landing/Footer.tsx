const Footer = () => {
  const legalLinks = [
    { label: "Privacy", href: "https://app.zensus.app/privacy" },
    { label: "Terms", href: "https://app.zensus.app/terms" },
    { label: "Security", href: "#" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="section-container py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Legal Links */}
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zensus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
