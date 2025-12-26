import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-email", {
        body: { email, consent },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll be in touch soon with early access.",
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

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">AI-powered financial forecasting</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Forecast Your{" "}
            <span className="text-gradient">Cash Flow.</span>
            <br />
            Make Better Decisions.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Upload your financial model. Get future forecasts with custom scenarios. 
            Know exactly when you can hire, distribute, or need to cut.
          </p>

          {/* Email Signup Form */}
          <div className="max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Button type="submit" size="lg" className="h-12 px-6 glow-sm group" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-start gap-3 justify-center">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                    className="mt-0.5"
                    disabled={isLoading}
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground text-left cursor-pointer">
                    I agree to receive product updates and announcements
                  </label>
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-secondary border border-primary/30 glow-sm">
                <p className="text-lg font-medium text-foreground mb-1">You're on the list! 🎉</p>
                <p className="text-sm text-muted-foreground">We'll be in touch soon with early access.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
