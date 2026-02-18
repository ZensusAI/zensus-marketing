import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { ArrowRight, Calendar } from "lucide-react";
import { getCalApi } from "@calcom/embed-react";

const Hero = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Runway Intelligence.{" "}
            <span className="text-gradient">Decide with Clarity.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Connect QuickBooks or upload your cash flow statement. Get AI-powered 
            forecasts and ask questions about your business runway.
          </p>

          {/* Try it Now CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <ShineBorder
              shineColor={["hsl(0 0% 100%)", "hsl(0 0% 80%)"]}
              duration={3}
              borderRadius={9999}
            >
              <Button asChild size="lg" className="h-12 px-8 group bg-transparent hover:bg-primary/10 text-primary-foreground border-0 rounded-full">
                <a href="https://app.zensus.app/subscribe">
                  Try it Now
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </ShineBorder>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-full"
              data-cal-namespace="30min"
              data-cal-link="zensus/30min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            >
              <Calendar size={18} className="mr-2" />
              Book Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
