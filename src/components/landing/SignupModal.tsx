import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AtSign, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SIGN_IN_URL } from "@/lib/constants";

const BULLETS = [
  "Connect QuickBooks, Plaid, and HubSpot in minutes",
  "Real-time runway built on live financial data",
  "Run scenarios in plain English",
  "Slack alerts before cash runs out",
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden
      className={className}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface SignupModalProps {
  children: ReactNode;
}

export function SignupModal({ children }: SignupModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden border-border bg-background p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left pane: atmospheric brand image + tagline (hidden on small screens) */}
          <div className="relative hidden min-h-[480px] md:block">
            <picture>
              <source srcSet="/hero-aurora-1200.webp" type="image/webp" />
              <img
                src="/hero-aurora-1920.jpg"
                alt=""
                className="h-full w-full object-cover [filter:brightness(0.7)_contrast(1.05)_saturate(1.1)]"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <DialogTitle className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
                Runway that adapts to your billing cadence.
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Bank, accounting, CRM. One runway view, in real time.
              </DialogDescription>
            </div>
          </div>

          {/* Right pane: bullets + auth buttons */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            <DialogTitle className="mb-1 text-xl font-semibold tracking-tight md:hidden">
              Start using Zensus
            </DialogTitle>
            <DialogDescription className="mb-6 text-sm text-muted-foreground md:hidden">
              Bank, accounting, CRM. One runway view, in real time.
            </DialogDescription>

            <ul className="mb-8 space-y-3">
              {BULLETS.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                >
                  <Check
                    size={18}
                    className="mt-0.5 flex-shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 w-full justify-center gap-3 rounded-lg border-border bg-card text-foreground hover:bg-card/80"
              >
                <a
                  href={`${SIGN_IN_URL}?provider=google`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoogleIcon />
                  Continue with Google
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 w-full justify-center gap-3 rounded-lg border-border bg-card text-foreground hover:bg-card/80"
              >
                <a
                  href={`${SIGN_IN_URL}?provider=email`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AtSign size={18} aria-hidden />
                  Continue with Email
                </a>
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                href={SIGN_IN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
              >
                Log in
              </a>
            </p>

            <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
