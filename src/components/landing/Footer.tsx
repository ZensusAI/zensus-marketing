/** Google Maps embed: city of Austin, TX only (no street address). */
const AUSTIN_MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Austin%2C+TX&z=11&output=embed";

const Footer = () => {
  const legalLinks = [
    { label: "About", href: "/about" },
    { label: "Book a call", href: "https://calendly.com/hello-zensus/introcall" },
    { label: "Plans", href: "/pricing" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Subprocessors", href: "/subprocessors" },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-sm border-t-0">
      <div className="section-container py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10 lg:gap-12">
          <div className="mx-auto flex w-full max-w-md shrink-0 flex-col md:mx-0">
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
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-6 md:items-end">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-end">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-base font-semibold text-gray-300 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground md:text-right">
              © {new Date().getFullYear()} Zensus. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
