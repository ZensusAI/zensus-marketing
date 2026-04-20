import { TalkToUsButton } from "./TalkToUsButton";

const FinalCTABand = () => (
  <section className="section-padding bg-secondary/30">
    <div className="section-container text-center max-w-2xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        Stop rebuilding that spreadsheet every Monday.
      </h2>
      <p className="text-lg text-muted-foreground mb-8">
        Connect your data in 60 seconds. We will walk you through it on the call.
      </p>
      <TalkToUsButton size="lg" />
    </div>
  </section>
);

export default FinalCTABand;
