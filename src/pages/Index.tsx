import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import BeforeAfter from "@/components/landing/BeforeAfter";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import FounderQuote from "@/components/landing/FounderQuote";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <BeforeAfter />
        <ProductShowcase />
        <Features />
        <Testimonials />
        <FounderQuote />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;