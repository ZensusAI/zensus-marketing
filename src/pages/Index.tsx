import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Problem from "@/components/landing/Problem";
import BeforeAfter from "@/components/landing/BeforeAfter";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FounderQuote from "@/components/landing/FounderQuote";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProductShowcase />
        <Problem />
        <BeforeAfter />
        <Features />
        <Pricing />
        <FounderQuote />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;