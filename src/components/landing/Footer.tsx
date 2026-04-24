const Footer = () => {
  const legalLinks = [
    { label: "About", href: "/about" },
    { label: "Book a call", href: "https://calendly.com/hello-zensus/introcall" },
    { label: "Plans", href: "/pricing" },
    { label: "Privacy", href: "https://app.zensus.app/privacy" },
    { label: "Terms", href: "https://app.zensus.app/terms" },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-sm border-t-0">
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
                className="text-base font-semibold text-gray-300 hover:text-white transition-colors"
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
