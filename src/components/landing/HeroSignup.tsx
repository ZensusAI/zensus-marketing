import { useId, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { TALK_TO_US_URL, trialUrlFor } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The lead post gets this long before the visitor is sent on regardless. It
// covers the invisible Turnstile check plus the Apollo write, which together
// usually take well under a second.
const LEAD_BUDGET_MS = 3000;

function within<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([promise, new Promise<undefined>((r) => setTimeout(() => r(undefined), ms))]);
}

// Hero email signup, in place of the Start and Talk to us buttons. Submitting
// saves the address as an Apollo lead (api/signup-lead.ts), so a visitor who
// stops partway can be followed up, then sends them to the app's login page
// with the address, where the magic link goes out on arrival and the next
// screen is "Check your email". The lead is best-effort: the redirect happens
// whether or not it saved. Turnstile loads on first focus, not on page load,
// so the homepage does not pay for Cloudflare's script before anyone types.
export function HeroSignup() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [armed, setArmed] = useState(false);
  const [sending, setSending] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const saveLead = async (address: string) => {
    if (!TURNSTILE_SITE_KEY) return;
    try {
      const token = await within(turnstileRef.current?.getResponsePromise() ?? Promise.resolve(""), LEAD_BUDGET_MS);
      if (!token) return;
      await fetch("/api/signup-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address, source: "hero", turnstileToken: token }),
        // Lets the request finish if the redirect wins the race.
        keepalive: true,
      });
    } catch {
      // A lost lead is a lost follow-up, not a lost signup.
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const address = email.trim();
    if (!EMAIL_RE.test(address)) {
      setError(address ? "Enter a valid email address, like you@company.com." : "Enter your email to start the trial.");
      return;
    }
    setError("");
    setSending(true);
    setArmed(true);
    trackCtaClick("hero", { destination: "trial", action: "email_submit" });
    await within(saveLead(address), LEAD_BUDGET_MS + 500);
    window.location.assign(trialUrlFor(address));
  };

  const errorId = `${id}-error`;
  return (
    <div className="mx-auto mt-9 w-full max-w-[520px]">
      <form
        onSubmit={onSubmit}
        noValidate
        className={cn(
          "flex flex-col gap-2 rounded-[30px] border bg-card p-1.5 shadow-[0_0_0_1px_#EBD9A6,0_0_18px_rgba(235,217,166,.45),0_4px_6px_-1px_rgba(0,0,0,.06)] transition-colors",
          "focus-within:border-primary/60 min-[480px]:flex-row min-[480px]:items-center min-[480px]:rounded-full",
          error ? "border-destructive/60" : "border-border",
        )}
      >
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          onFocus={() => setArmed(true)}
          placeholder="What is your email?"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={sending}
          className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-70"
        />
        {/* At rest the button reads "See"; hover or keyboard focus opens it to
            "See when my cash runs out ->". The rest of the label is always in
            the DOM (the accessible name and the prerendered HTML carry the
            whole sentence), only its column is 0fr wide. It stays open where
            there is no hover (touch) and on the stacked phone layout. Under
            reduced motion it opens without the slide. */}
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors duration-300 ease-ui hover:bg-[hsl(150_70%_41%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-wait disabled:opacity-80"
        >
          {sending ? (
            "Opening Zensus..."
          ) : (
            <>
              See{" "}
              <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-ui group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr] motion-reduce:transition-none max-[479px]:grid-cols-[1fr] [@media(hover:none)]:grid-cols-[1fr]">
                {/* The clipping span has no padding of its own, so at 0fr it
                    is truly zero wide; the gap after "See" lives inside. */}
                <span className="min-w-0 overflow-hidden">
                  <span className="flex items-center gap-2 whitespace-nowrap pl-[0.28em] pr-0.5 opacity-0 transition-opacity duration-300 ease-ui group-hover:opacity-100 group-hover:delay-100 group-focus-visible:opacity-100 max-[479px]:opacity-100 [@media(hover:none)]:opacity-100">
                    when my cash runs out
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                    />
                  </span>
                </span>
              </span>
            </>
          )}
        </button>
      </form>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {armed && TURNSTILE_SITE_KEY ? (
        <Turnstile ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} options={{ size: "invisible" }} />
      ) : null}

      <p className="mt-3 text-balance text-sm text-muted-foreground">
        {/* Two block spans so each sentence keeps its own line on desktop;
            the space keeps them two sentences for text extractors. */}
        <span className="block">14-day free trial, cancel anytime. No charge until it ends.</span>{" "}
        <span className="block">We'll email your sign-in link and a few setup tips.</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Prefer a walkthrough?{" "}
        <a
          href={TALK_TO_US_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaClick("hero", { destination: "talk_to_us" })}
          className="inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
        >
          Book a call with the team
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </p>
    </div>
  );
}
