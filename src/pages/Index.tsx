import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import Problem from "@/components/landing/Problem";
import RunwayFeature from "@/components/landing/RunwayFeature";
import Bento from "@/components/landing/Bento";
import HowItWorks from "@/components/landing/HowItWorks";
import SecurityStrip from "@/components/landing/SecurityStrip";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQ from "@/components/landing/FAQ";
import FinalCTABand from "@/components/landing/FinalCTABand";
import Footer from "@/components/landing/Footer";
import PageSkeleton from "@/components/landing/PageSkeleton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Zensus · Cash flow forecasting for founders with variable revenue</title>
        <meta name="description" content="Know exactly when your cash runs out and what to do about it. Connect your bank, QuickBooks, and HubSpot for runway projections that match the calendar." />
        <meta property="og:title" content="Zensus · Cash flow forecasting for founders" />
        <meta property="og:description" content="Runway that matches the calendar. Built for founders with annual and quarterly contracts." />
        <meta property="og:image" content="https://zensus.app/og/home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://zensus.app/og/home.png" />
        <link rel="canonical" href="https://zensus.app/" />
      </Helmet>
      <Navbar />
      <div className="animate-fade-in">
        <main>
          <Hero />
          <TrustBar />
          <Problem />
          <RunwayFeature />
          <Bento />
          <HowItWorks />
          <SecurityStrip />
          <PricingPreview />
          <FAQ />
          <FinalCTABand />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
