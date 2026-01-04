const Footer = () => {
  const legalLinks = ["Privacy", "Terms", "Security"];

  return (
    <footer className="bg-background border-t border-border">
      <div className="section-container py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Legal Links */}
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
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
