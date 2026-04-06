import integrationCard from "@/assets/integrations-card.png";

const IntegrationBanner = () => {
  return (
    <section className="py-8 bg-background">
      <div className="section-container flex justify-center">
        <img
          src={integrationCard}
          alt="Integrations - Connect QuickBooks and Plaid to streamline your financial data and keep forecasts accurate"
          className="max-w-lg w-full"
          loading="lazy"
          width={512}
          height={320}
        />
      </div>
    </section>
  );
};

export default IntegrationBanner;
