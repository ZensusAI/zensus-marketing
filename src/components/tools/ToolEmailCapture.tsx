import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  trackToolEmailFailed,
  trackToolEmailStarted,
  trackToolEmailSubmitted,
  trackToolEmailSucceeded,
  trackToolEmailPromptViewed,
  type ToolLeadId,
} from "@/lib/tool-lead-analytics";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

const RATE_LIMIT = {
  maxAttempts: 3,
  timeWindow: 60 * 60 * 1000,
};
const RATE_LIMIT_KEY = "toolEmailSubmissionRateLimit";

function formatTimeRemaining(resetTime: number): string {
  const minutes = Math.max(1, Math.ceil((resetTime - Date.now()) / 60000));
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export interface ToolEmailCaptureProps {
  tool: ToolLeadId;
  inputs: Record<string, unknown>;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function ToolEmailCapture({ tool, inputs }: ToolEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState<number | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const gotchaRef = useRef<HTMLInputElement>(null);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackToolEmailPromptViewed(tool);
  }, [tool]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      if (!raw) return;
      const { attempts, resetTime } = JSON.parse(raw) as {
        attempts: number;
        resetTime: number;
      };
      if (Date.now() > resetTime) {
        localStorage.removeItem(RATE_LIMIT_KEY);
        return;
      }
      if (attempts >= RATE_LIMIT.maxAttempts) {
        setIsRateLimited(true);
        setRateLimitReset(resetTime);
      }
    } catch {
      setIsRateLimited(false);
    }
  }, []);

  const recordAttempt = () => {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      if (!raw) {
        localStorage.setItem(
          RATE_LIMIT_KEY,
          JSON.stringify({ attempts: 1, resetTime: now + RATE_LIMIT.timeWindow }),
        );
        return;
      }
      const data = JSON.parse(raw) as { attempts: number; resetTime: number };
      if (now > data.resetTime) {
        localStorage.setItem(
          RATE_LIMIT_KEY,
          JSON.stringify({ attempts: 1, resetTime: now + RATE_LIMIT.timeWindow }),
        );
        return;
      }
      const attempts = data.attempts + 1;
      localStorage.setItem(
        RATE_LIMIT_KEY,
        JSON.stringify({ attempts, resetTime: data.resetTime }),
      );
      if (attempts >= RATE_LIMIT.maxAttempts) {
        setIsRateLimited(true);
        setRateLimitReset(data.resetTime);
      }
    } catch {
      // Ignore storage failures; they only weaken the courtesy throttle.
    }
  };

  const validateEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Please enter a valid email address";
    }
    if (!marketingConsent) {
      return "Please confirm you want us to email your breakdown";
    }
    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isRateLimited) {
      setStatus("error");
      setErrorMessage(
        rateLimitReset
          ? `Too many requests. Try again in ${formatTimeRemaining(rateLimitReset)}.`
          : "Too many requests. Try again later.",
      );
      return;
    }

    const validationError = validateEmail();
    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }

    if (!TURNSTILE_SITE_KEY) {
      setStatus("error");
      setErrorMessage("Email delivery is temporarily unavailable. Try again later.");
      trackToolEmailFailed(tool, "turnstile_unconfigured");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    trackToolEmailSubmitted(tool);

    try {
      const token = await turnstileRef.current?.getResponsePromise();
      if (!token) {
        throw new Error("turnstile_required");
      }

      const response = await fetch("/api/tools/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          email: email.trim(),
          inputs,
          turnstileToken: token,
          _gotcha: gotchaRef.current?.value ?? "",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        trackToolEmailFailed(tool, payload.error ?? `http_${response.status}`);
        if (response.status === 429 || payload.error === "rate_limit") {
          setStatus("error");
          setErrorMessage("Too many requests. Try again in an hour.");
          return;
        }
        throw new Error(payload.error ?? "send_failed");
      }

      recordAttempt();
      trackToolEmailSucceeded(tool);
      setStatus("success");
      turnstileRef.current?.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not send your breakdown right now. Check your email and try again.",
      );
      turnstileRef.current?.reset();
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-12">
        <p className="font-medium text-foreground mb-1">Breakdown sent</p>
        <p className="text-sm text-muted-foreground">
          Detailed results are on their way to {email.trim()}. Check spam if it
          does not arrive within a minute.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6 mb-12">
      <p className="text-base font-medium text-foreground mb-1">
        Want this emailed to you with a detailed breakdown?
      </p>
      <p className="text-sm text-muted-foreground mb-5">Drop your email. Optional.</p>

      {isRateLimited && rateLimitReset ? (
        <p className="text-sm text-muted-foreground mb-4">
          You have sent several breakdown requests recently. Try again in{" "}
          {formatTimeRemaining(rateLimitReset)}.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          ref={gotchaRef}
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <div className="space-y-1.5">
          <Label htmlFor={`${tool}-email`}>Email</Label>
          <Input
            id={`${tool}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onFocus={() => trackToolEmailStarted(tool)}
            disabled={status === "loading" || isRateLimited}
            placeholder="you@company.com"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1"
            checked={marketingConsent}
            onChange={(event) => setMarketingConsent(event.target.checked)}
            disabled={status === "loading" || isRateLimited}
          />
          <span>
            Email me this breakdown and occasional Zensus updates. Unsubscribe
            anytime. See our{" "}
            <Link to="/privacy" className="text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {TURNSTILE_SITE_KEY ? (
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            options={{ size: "invisible" }}
          />
        ) : null}

        <div>
          <Button type="submit" disabled={status === "loading" || isRateLimited}>
            {status === "loading" ? "Sending…" : "Email my breakdown"}
          </Button>
          {status === "error" && errorMessage ? (
            <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
