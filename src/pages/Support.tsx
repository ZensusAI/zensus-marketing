import { useEffect, useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { breadcrumbSchema, faqPageSchema, HOME_CRUMB } from "@/lib/structured-data";

const PAGE_URL = "https://zensus.app/support";
const PAGE_DESCRIPTION =
  "Get help with Zensus. Reach the team about your account, integrations, or billing, browse common questions, or email us directly at support@zensus.app.";

// Third-party form backend (no server needed on this static marketing site).
// Forminit (formerly Getform) form in Public mode. New-style Forminit forms
// require prefixed "block keys" (fi-<blockType>-<name>) rather than arbitrary
// field names (see the mapping in handleSubmit). The form's schema (name,
// sender email, subject, message) is fixed by its first submission.
const FORM_ENDPOINT = "https://forminit.com/f/ho5iwqa3lz1";

// Client-side throttle so a single browser can't hammer the form. Purely a
// courtesy guard; the real anti-spam is the honeypot field plus Forminit's
// own filtering.
const RATE_LIMIT = {
  maxAttempts: 3,
  timeWindow: 60 * 60 * 1000, // 1 hour
};
const RATE_LIMIT_KEY = "formSubmissionRateLimit";

const FAQS = [
  {
    question: "How do I get started with Zensus?",
    answer:
      "Create an account at app.zensus.app, then connect your bank through Plaid or your books through QuickBooks (or upload a spreadsheet). Zensus builds your cash flow forecast and runway automatically from there.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Yes. Bank credentials are handled by Plaid and never touch our servers, every query is isolated by account, and your data never trains an AI model. Our Security and Privacy pages cover the details.",
  },
  {
    question: "Which tools does Zensus connect to?",
    answer:
      "Plaid for live bank data, QuickBooks for accounting, HubSpot for pipeline, and Slack for alerts. You can see how each one works on the Integrations page.",
  },
  {
    question: "How much does Zensus cost?",
    answer:
      "Zensus Pro is $199/month after a 14-day free trial. We collect your card when you start the trial and only charge once it ends, so you can cancel anytime before then at no cost. Full details are on our Pricing page.",
  },
  {
    question: "How do I reach a person?",
    answer:
      "Email support@zensus.app or use the form on this page. We typically reply within one business day.",
  },
];

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Support", url: PAGE_URL },
]);

// The support FAQ is rendered as visible text below; emit it as FAQPage JSON-LD
// too so AI engines and rich results can extract the questions and answers.
const faqLd = faqPageSchema(FAQS);

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  _gotcha: string; // honeypot; humans never see or fill this
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  _gotcha: "",
};

export default function Support() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState<number | null>(null);

  // On mount: clear any browser-restored values and read the throttle state.
  useEffect(() => {
    setFormData(EMPTY_FORM);
    try {
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      if (!raw) return;
      const { attempts, resetTime } = JSON.parse(raw);
      if (Date.now() > resetTime) {
        localStorage.removeItem(RATE_LIMIT_KEY);
        return;
      }
      if (attempts >= RATE_LIMIT.maxAttempts) {
        setIsRateLimited(true);
        setRateLimitReset(resetTime);
      }
    } catch {
      // A malformed entry shouldn't lock anyone out.
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
      const data = JSON.parse(raw);
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
      // Ignore storage failures (private mode, quota); they only weaken the
      // courtesy throttle, nothing functional.
    }
  };

  const formatTimeRemaining = (resetTime: number) => {
    const diff = Math.max(0, resetTime - Date.now());
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  };

  const validate = () => {
    // Honeypot filled → almost certainly a bot. Silently treat as invalid.
    if (formData._gotcha) return false;

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setErrorMessage("Please correct the errors below.");
      return false;
    }
    return true;
  };

  // Best-effort: ask our serverless function to email the submitter an
  // acknowledgment. Never blocks or fails the form. keepalive lets it survive
  // the user navigating away right after submit.
  const sendAcknowledgment = (token: string) => {
    if (!token) return;
    try {
      fetch("/api/acknowledge", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          turnstileToken: token,
        }),
      }).catch(() => {});
    } catch {
      /* ignore; acknowledgment is optional */
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) {
      setSubmitStatus("error");
      setErrorMessage(
        "You've reached the maximum number of submissions. Please email support@zensus.app instead.",
      );
      return;
    }
    if (!validate()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitStatus("idle");

    try {
      // Map our fields to Forminit block keys. Name/subject/message are text
      // blocks (lenient; a strict sender-name block would reject names with
      // commas, digits, etc. and silently drop support requests); email is a
      // sender block so replies thread back to the submitter. The _gotcha
      // honeypot is checked client-side in validate() and never sent.
      const body = new FormData();
      body.append("fi-text-name", formData.name);
      body.append("fi-sender-email", formData.email);
      body.append("fi-text-subject", formData.subject);
      body.append("fi-text-message", formData.message);

      const response = await fetch(FORM_ENDPOINT, { method: "POST", body });
      recordAttempt();

      if (!response.ok) {
        throw new Error(`Form submission failed (${response.status}).`);
      }
      setSubmitStatus("success");
      // Fire the acknowledgment with a fresh Turnstile token, then reset the
      // widget so a later "Send another message" gets a new one.
      if (TURNSTILE_SITE_KEY && turnstileRef.current) {
        try {
          const token = await turnstileRef.current.getResponsePromise();
          sendAcknowledgment(token);
        } catch {
          /* no token -> skip acknowledgment */
        }
        turnstileRef.current.reset();
      }
      setFormData(EMPTY_FORM);
      setValidationErrors({});
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email support@zensus.app.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const invalid = (field: string) =>
    validationErrors[field] ? "border-destructive focus-visible:ring-destructive" : "";

  return (
    <>
      <Helmet>
        <title>Zensus Support · Help With Your Account and Integrations</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Zensus Support · Help With Your Account and Integrations" />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content="https://zensus.app/og/support.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zensus Support social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zensus Support · Help With Your Account and Integrations" />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content="https://zensus.app/og/support.png" />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Support
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Questions about your account, integrations, or billing? Send us a
              note below and we'll get back to you, usually within one business
              day.
            </p>
          </header>

          {/* Contact form */}
          <section className="mb-14">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Contact us
            </h2>

            {submitStatus === "success" ? (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-medium text-foreground mb-1">Message sent</h3>
                <p className="text-muted-foreground text-sm">
                  Thanks for reaching out. We'll reply as soon as we can,
                  usually within one business day.
                </p>
                <button
                  type="button"
                  className="mt-4 text-sm font-medium text-primary underline underline-offset-4"
                  onClick={() => setSubmitStatus("idle")}
                >
                  Send another message
                </button>
              </div>
            ) : isRateLimited && rateLimitReset ? (
              <div className="rounded-lg border border-border bg-muted/40 p-6">
                <h3 className="font-medium text-foreground mb-1">
                  Submission limit reached
                </h3>
                <p className="text-muted-foreground text-sm">
                  You've hit the maximum number of submissions for now. Please
                  try again in {formatTimeRemaining(rateLimitReset)}, or email us
                  directly at{" "}
                  <a
                    href="mailto:support@zensus.app"
                    className="text-primary underline underline-offset-4"
                  >
                    support@zensus.app
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Honeypot: visually hidden, off the tab order. */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="_gotcha">Leave this field empty</label>
                  <input
                    type="text"
                    id="_gotcha"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData._gotcha}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-invalid={!!validationErrors.name}
                      className={invalid("name")}
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-destructive">{validationErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-invalid={!!validationErrors.email}
                      className={invalid("email")}
                    />
                    {validationErrors.email && (
                      <p className="text-xs text-destructive">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    aria-invalid={!!validationErrors.subject}
                    className={invalid("subject")}
                  />
                  {validationErrors.subject && (
                    <p className="text-xs text-destructive">{validationErrors.subject}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    aria-invalid={!!validationErrors.message}
                    className={invalid("message")}
                  />
                  {validationErrors.message && (
                    <p className="text-xs text-destructive">{validationErrors.message}</p>
                  )}
                </div>

                {TURNSTILE_SITE_KEY && (
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{ size: "invisible" }}
                  />
                )}

                <div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending…" : "Send message"}
                  </Button>
                  {submitStatus === "error" && errorMessage && (
                    <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-border bg-muted/20 p-5"
                >
                  <h3 className="font-medium text-foreground mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Email + legal */}
          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Email us
              </h2>
              <p className="text-sm text-muted-foreground">
                Prefer email? Reach the team directly at{" "}
                <a
                  href="mailto:support@zensus.app"
                  className="text-primary underline underline-offset-4"
                >
                  support@zensus.app
                </a>
                .
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Legal</h2>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  to="/privacy"
                  className="text-primary underline underline-offset-4 w-fit"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-primary underline underline-offset-4 w-fit"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
