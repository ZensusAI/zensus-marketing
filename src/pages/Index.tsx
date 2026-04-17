import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
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
  );
};

export default Index;
