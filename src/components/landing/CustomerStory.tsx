import HeroTestimonial from "./HeroTestimonial";

// The customer video in its own section, after the product preview. It used
// to be the hero visual, beside the headline; the category survey (16 Oct
// 2026) found no finance SaaS landing page that leads with a talking head,
// and it pushed the hero buttons a full screen down on a phone.
const CustomerStory = () => (
  <section
    className="bg-background pt-16 pb-8 md:pt-24 md:pb-12"
    aria-labelledby="customer-story-heading"
  >
    <div className="section-container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          Customer story
        </p>
        <h2 id="customer-story-heading" className="mt-3 text-section">
          Hear it from a customer.
        </h2>
      </div>
      <HeroTestimonial />
    </div>
  </section>
);

export default CustomerStory;
