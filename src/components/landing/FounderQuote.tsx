import { Quote } from "lucide-react";

const FounderQuote = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <Quote size={48} className="text-primary/30 mx-auto mb-8" />
          
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed mb-8">
            "I built Zensus because I was tired of{" "}
            <span className="text-gradient">lying awake at night</span>{" "}
            wondering if my cash would last. Now I sleep better—and so do my co-founders."
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-semibold text-primary">
              ZF
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground text-lg">Zensus Founder</div>
              <div className="text-muted-foreground">Founder & CEO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderQuote;