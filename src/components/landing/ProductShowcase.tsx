import { BarChart3 } from "lucide-react";

const ProductShowcase = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Replace chaos with <span className="text-gradient">clarity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See your cash flow future using custom scenarios. Make confident decisions backed by data.
          </p>
        </div>

        {/* Product Mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow effect behind */}
          <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl opacity-50" />
          
          {/* Dashboard mockup */}
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
            {/* Browser header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-md mx-auto bg-background/50 rounded-md px-4 py-1.5 text-sm text-muted-foreground text-center">
                  app.zensus.io
                </div>
              </div>
            </div>

            {/* Placeholder until screenshot is uploaded */}
            <div className="h-64 md:h-96 flex items-center justify-center bg-secondary/20">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <BarChart3 size={48} className="text-primary/50" />
                <span className="text-sm">Dashboard screenshot coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;