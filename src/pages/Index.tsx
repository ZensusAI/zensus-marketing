import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import IntegrationLogos from "@/components/landing/IntegrationLogos";
import IntegrationBanner from "@/components/landing/IntegrationBanner";
import ForecastFeature from "@/components/landing/ForecastFeature";
import RunwayFeature from "@/components/landing/RunwayFeature";
import HowItWorks from "@/components/landing/HowItWorks";
import Problem from "@/components/landing/Problem";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import PageSkeleton from "@/components/landing/PageSkeleton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load / allow assets to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main>
        <Hero />
        <IntegrationBanner />
        <Problem />
        <ForecastFeature />
        <RunwayFeature />
        <HowItWorks />
        <PricingPreview />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
