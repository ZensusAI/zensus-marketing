import { TryItNowButton } from "./TryItNowButton";
import { TalkToUsButton } from "./TalkToUsButton";

// The last section asks for the same action as the first: the trial. A call
// stays available as the secondary route. This band used to end the page on
// "Talk to us" alone, so a visitor who had just read the whole pitch was
// offered a meeting instead of the product.
const FinalCTABand = () => (
  <section className="section-padding bg-secondary/30">
    <div className="section-container text-center max-w-2xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        Stop rebuilding that spreadsheet every Monday.
      </h2>
      <p className="text-lg text-muted-foreground mb-8">
        Connect your data in 60 seconds. If you would rather see it first, we
        will walk you through it on a call.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <TryItNowButton size="lg" source="final_cta_band" />
        <TalkToUsButton
          size="lg"
          variant="ghost"
          className="border border-border bg-card text-foreground hover:border-primary/60"
        />
      </div>
    </div>
  </section>
);

export default FinalCTABand;
