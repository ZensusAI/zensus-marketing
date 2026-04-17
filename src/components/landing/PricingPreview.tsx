import { TalkToUsButton } from "./TalkToUsButton";

const PricingPreview = () => (
  <section className="section-padding bg-background">
    <div className="section-container">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          Pricing is tailored to your business
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Every Zensus account is configured around your data sources and your
          team shape. We will walk you through what it looks like for you on a
          call.
        </p>
        <TalkToUsButton size="lg" />
      </div>
    </div>
  </section>
);

export default PricingPreview;
