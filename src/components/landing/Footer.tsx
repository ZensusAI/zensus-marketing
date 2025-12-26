import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Linkedin, Loader2 } from "lucide-react";
import zensusLogo from "@/assets/zensus-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-email", {
        body: { email, consent: true },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "You're in!",
        description: "We'll reach out soon.",
      });
    } catch (error: any) {
      console.error("Error submitting email:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const footerLinks = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy", "Terms", "Security"],
  };

  return (
    <footer className="bg-background border-t border-border">
      {/* CTA Section */}
      <div className="section-container section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Ready to see your{" "}
            <span className="text-gradient">cash flow future?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join founders who already have clarity on their finances.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={isLoading}
                />
                <Button type="submit" size="lg" className="h-12 px-6 glow group" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Get Early Access
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-xl bg-secondary border border-primary/30 max-w-md mx-auto glow-sm">
              <p className="text-lg font-medium text-foreground">You're in! 🎉</p>
              <p className="text-sm text-muted-foreground">We'll reach out soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Links */}
      <div className="section-container py-12 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src={zensusLogo} alt="Zensus logo" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-semibold text-foreground">Zensus</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              AI-powered cash flow forecasting for founders who need clarity on their finances.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com/zensusai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/zensusai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zensus. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for founders everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
