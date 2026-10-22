import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { trialUrlFor } from "@/lib/constants";
import { trackHeroEmailSubmit } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
// The app login's own rule (apps/landing/app/login/page.tsx), so an address
// this field accepts is one the login page will send to rather than flag.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// The lead post gets this long before the visitor is sent on regardless. It
// covers the invisible Turnstile check plus the Apollo write, which together
// usually take well under a second.
const LEAD_BUDGET_MS = 3000;

// A short horizontal shake, the "no" gesture, for an empty or invalid address.
// Web Animations rather than a CSS class, so it replays on every attempt
// without remounting the field (which would drop focus). Skipped under
// reduced motion, where the red ring and the message carry it alone.
const SHAKE: Keyframe[] = [0, -8, 7, -5, 4, -2, 0].map((x) => ({ transform: `translateX(${x}px)` }));

function shake(el: HTMLElement | null) {
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.animate(SHAKE, { duration: 420, easing: "ease-out" });
}

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
// The field stands alone: the trial terms and the booking link that sat under
// it were removed at the user's request (21 Oct 2026); both live on /pricing.
export function HeroSignup() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [armed, setArmed] = useState(false);
  const [sending, setSending] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Back from the login page can restore this page from the back/forward
  // cache exactly as it was left, field disabled and button on "Opening
  // Zensus...". Re-enable it so the visitor can try again.
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) setSending(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

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
      setError(address ? "Enter a valid email address, like you@company.com." : "Enter your email to see when your cash runs out.");
      shake(formRef.current);
      inputRef.current?.focus();
      return;
    }
    setError("");
    setSending(true);
    setArmed(true);
    trackHeroEmailSubmit();
    await within(saveLead(address), LEAD_BUDGET_MS + 500);
    window.location.assign(trialUrlFor(address));
  };

  const errorId = `${id}-error`;
  return (
    // About two thirds of the subhead above it (460 of 672px, then 420 of
    // 576px from 820px, where the hero copy steps down a size), so the field
    // reads as part of the copy column rather than a second band. Under 480px the one pill
    // splits in two: the field becomes its own pill and the button a second
    // one under it, both the full column width, so neither is squeezed. The
    // error line floats under the field (absolute), so it never pushes the
    // centred hero block off centre.
    <div className="relative mx-auto mt-8 w-full max-w-[460px] min-[820px]:mt-7 min-[820px]:max-w-[420px]">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        className={cn(
          "flex flex-col gap-2 transition-[border-color,box-shadow] duration-200",
          "min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-1 min-[480px]:rounded-full min-[480px]:border min-[480px]:bg-card min-[480px]:p-1",
          error
            ? "min-[480px]:border-destructive/70 min-[480px]:shadow-[0_0_0_3px_hsl(var(--destructive)/.12)]"
            : "min-[480px]:border-[#E4D3A1] min-[480px]:shadow-[0_0_14px_rgba(235,217,166,.4),0_2px_4px_-1px_rgba(0,0,0,.05)] min-[480px]:focus-within:border-primary/60 min-[480px]:focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/.14)]",
        )}
      >
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          ref={inputRef}
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
          className={cn(
            "h-12 min-w-0 flex-none rounded-full border bg-card px-5 text-base text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:outline-none disabled:opacity-70",
            "min-[480px]:h-11 min-[480px]:flex-1 min-[820px]:h-10 min-[820px]:text-[15px] min-[480px]:border-0 min-[480px]:bg-transparent min-[480px]:px-4 min-[480px]:shadow-none min-[480px]:focus:shadow-none",
            error
              ? "border-destructive/70 shadow-[0_0_0_3px_hsl(var(--destructive)/.12)]"
              : "border-[#E4D3A1] shadow-[0_0_14px_rgba(235,217,166,.4)] focus:border-primary/60 focus:shadow-[0_0_0_3px_hsl(var(--primary)/.14)]",
          )}
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
          className="group inline-flex h-12 shrink-0 min-[480px]:h-11 min-[820px]:h-10 min-[820px]:px-5 min-[820px]:text-sm items-center justify-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors duration-300 ease-ui hover:bg-[hsl(150_70%_41%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-wait disabled:opacity-80"
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
        <p id={errorId} role="alert" className="absolute inset-x-0 top-full mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {armed && TURNSTILE_SITE_KEY ? (
        <Turnstile ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} options={{ size: "invisible" }} />
      ) : null}

    </div>
  );
}
