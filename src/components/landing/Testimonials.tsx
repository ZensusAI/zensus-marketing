import { Twitter } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    handle: "@sarahchen",
    role: "Founder, TechStartup",
    avatar: "SC",
    content: "Finally, a tool that gives me real visibility into my cash flow. No more 3am spreadsheet sessions wondering if we can make the next payroll.",
  },
  {
    name: "Marcus Johnson",
    handle: "@marcusj",
    role: "CEO, GrowthCo",
    avatar: "MJ",
    content: "The three-scenario forecasting changed how I think about financial planning. Now I know exactly what to do if revenue dips.",
  },
  {
    name: "Emily Rodriguez",
    handle: "@emilyrod",
    role: "Founder, DataFlow",
    avatar: "ER",
    content: "Zensus told me I could hire a month earlier than I thought. That velocity boost was worth 10x the subscription.",
  },
  {
    name: "David Park",
    handle: "@davidpark",
    role: "COO, ScaleUp",
    avatar: "DP",
    content: "We went from quarterly cash flow reviews to weekly confidence. The early warning alerts have saved us twice already.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Here's what <span className="text-gradient">founders are saying</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <Twitter size={20} className="text-muted-foreground" />
              </div>
              <p className="text-foreground leading-relaxed">{testimonial.content}</p>
            </div>
          ))}
        </div>

        {/* Social proof badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border">
            <div className="flex -space-x-2">
              {["SC", "MJ", "ER", "DP", "+"].map((avatar, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                >
                  {avatar}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              <span className="text-primary font-semibold">250+</span> founders already on the waitlist
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;