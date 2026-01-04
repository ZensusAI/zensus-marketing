import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Problem from "@/components/landing/Problem";
import Features from "@/components/landing/Features";
import FounderQuote from "@/components/landing/FounderQuote";
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
        <ProductShowcase />
        <Problem />
        <Features />
        <FounderQuote />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;