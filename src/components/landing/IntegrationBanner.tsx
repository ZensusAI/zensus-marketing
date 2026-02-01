const IntegrationBanner = () => {
  return (
    <section className="py-8 bg-background">
      <div className="section-container">
        <div className="flex items-center justify-center gap-4 px-6 py-4 rounded-2xl bg-card border border-border max-w-md mx-auto">
          {/* QuickBooks Logo */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#2CA01C]/10 flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" fill="#2CA01C"/>
              <path 
                d="M7 12C7 9.79 8.79 8 11 8V16C8.79 16 7 14.21 7 12Z" 
                fill="white"
              />
              <path 
                d="M13 8V16C15.21 16 17 14.21 17 12C17 9.79 15.21 8 13 8Z" 
                fill="white"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground">
              Seamlessly connects with{" "}
              <span className="text-[#2CA01C]">QuickBooks</span>
            </p>
            <p className="text-xs text-muted-foreground">
              One-click integration • Automatic sync
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationBanner;
