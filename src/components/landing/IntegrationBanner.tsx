import quickbooksBanner from "@/assets/quickbooks-banner.png";

const IntegrationBanner = () => {
  return (
    <section className="py-8 bg-background">
      <div className="section-container flex justify-center">
        <img
          src={quickbooksBanner}
          alt="Seamlessly connects with QuickBooks - One-click integration, Automatic sync"
          className="max-w-md w-full rounded-2xl"
        />
      </div>
    </section>
  );
};

export default IntegrationBanner;
