import {
  GlyphRunway,
  GlyphFragmented,
  GlyphFork,
  GlyphCliff,
} from "./ProblemGlyphs";

const painPoints = [
  {
    Glyph: GlyphRunway,
    title: '"How many months do I have left?"',
    description: "You check your bank balance, do mental math, and still aren't sure",
  },
  {
    Glyph: GlyphFragmented,
    title: "Still pasting CSVs from three different tools",
    description: "Every export is stale the moment it downloads. Zensus pulls live from every source, no manual imports ever",
  },
  {
    Glyph: GlyphFork,
    title: '"Can I afford to hire?"',
    description: "No way to simulate decisions before committing real money",
  },
  {
    Glyph: GlyphCliff,
    title: "The annual invoice that posted three weeks late",
    description: "The hire you made the week before a customer churned",
  },
];

const Problem = () => {
  return (
    <section id="problem" className="section-padding bg-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            You check your bank every Monday and still aren't sure you can make payroll in six weeks.
          </h2>
          <p className="text-lg text-muted-foreground">
            Most founders check their bank balance and hope for the best. That's not a financial strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((point, index) => {
            const { Glyph } = point;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="glyph-frame">
                    <Glyph />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Problem;
