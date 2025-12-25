import { TrendingUp, BarChart3, Zap } from "lucide-react";

const ProductShowcase = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Replace chaos with <span className="text-gradient">clarity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See your cash flow future across three scenarios. Make confident decisions backed by data.
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

            {/* Dashboard content */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Stat cards */}
                {[
                  { label: "Optimistic", value: "$142,500", change: "+12%", icon: TrendingUp },
                  { label: "Expected", value: "$128,000", change: "+8%", icon: BarChart3 },
                  { label: "Pessimistic", value: "$98,500", change: "-3%", icon: Zap },
                ].map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <stat.icon size={16} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className={`text-sm ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                      {stat.change} vs last week
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="h-48 md:h-64 rounded-xl bg-secondary/30 border border-border flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <BarChart3 size={48} className="text-primary/50" />
                  <span className="text-sm">8-Week Cash Flow Forecast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;