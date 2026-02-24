const IntegrationLogos = () => {
  return (
    <section className="py-8">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Integrates with
          </span>
          <div className="flex items-center gap-8">
            {/* QuickBooks logo */}
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 8.5C7 7.67 7.67 7 8.5 7H10v10H8.5C7.67 17 7 16.33 7 15.5v-7z" fill="currentColor" />
                <path d="M17 15.5c0 .83-.67 1.5-1.5 1.5H14V7h1.5c.83 0 1.5.67 1.5 1.5v7z" fill="currentColor" />
              </svg>
              <span className="text-sm font-medium">QuickBooks</span>
            </div>
            {/* Plaid logo */}
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.8" />
                <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.4" />
              </svg>
              <span className="text-sm font-medium">Plaid</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationLogos;
