import { SITE_URL } from "@/lib/constants";
import { Helmet } from "react-helmet-async";
import { Check, ExternalLink } from "lucide-react";
import meshInverted960 from "@/assets/hero-mesh-inverted-960.webp";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TalkToUsButton } from "@/components/landing/TalkToUsButton";
import DataFlow from "@/components/security/DataFlow";
import SecurityFaq from "@/components/security/SecurityFaq";
import {
  COMPLIANCE,
  FACTS,
  KEEP_OR_REMOVE,
  LAST_REVIEWED,
  NEVER_STORES,
  STORE_GROUPS,
} from "@/components/security/security-content";
import { useSceneReveal } from "@/components/security/useSceneReveal";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const breadcrumbs = breadcrumbSchema([
  HOME_CRUMB,
  { name: "Security", url: `${SITE_URL}/security` },
]);

const STORE_COUNT = STORE_GROUPS.reduce((total, group) => total + group.items.length, 0);

/** One full-height screen, content centred. 66px is the navbar plus progress line. */
const SCENE =
  "flex min-h-[calc(100svh-66px)] items-center justify-center px-6 py-[72px] [scroll-snap-align:start] min-[760px]:px-12 min-[760px]:py-24 min-[1100px]:py-[104px]";
const H2_LARGE =
  "text-balance text-[34px] font-semibold leading-[1.04] tracking-[-0.045em] min-[760px]:text-[50px] min-[1100px]:text-[64px]";
const H2_SMALL =
  "text-balance text-[32px] font-semibold leading-[1.06] tracking-[-0.04em] min-[760px]:text-[44px] min-[1100px]:text-[52px]";
const SUB = "text-[18px] leading-[1.45] min-[760px]:text-[22px]";
const BLOCK = "rounded-[24px] [corner-shape:squircle]";
const BLOCK_PAD = "px-[22px] pb-2 pt-[22px] min-[760px]:px-7 min-[760px]:pb-2.5 min-[760px]:pt-[26px]";
const END_CARD = cn(BLOCK, "flex flex-col gap-4 px-6 py-7 min-[760px]:p-10");
const LINK = "text-sage-dark underline decoration-primary/55 underline-offset-4 hover:text-sage-deep";
const FOREST_LINK = "font-medium text-sage-light underline underline-offset-4";

const Security = () => {
  const { rootRef, progressRef } = useSceneReveal();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Security at Zensus · How We Protect Your Financial Data</title>
        <meta
          name="description"
          content="How Zensus protects your financial data: AES-256-GCM token encryption, OAuth via Plaid and Intuit, account isolation, US data residency, no AI training."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/security`} />
        <meta property="og:site_name" content="Zensus" />
        <meta property="og:title" content="Security at Zensus · How We Protect Your Financial Data" />
        <meta
          property="og:description"
          content="How Zensus protects your financial data. OAuth through Plaid and Intuit, encryption at rest, account-level isolation."
        />
        <meta property="og:image" content={`${SITE_URL}/og/security.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Security at Zensus social preview card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Security at Zensus · How We Protect Your Financial Data" />
        <meta
          name="twitter:description"
          content="How Zensus protects your financial data. OAuth through Plaid and Intuit, encryption at rest, account-level isolation."
        />
        <meta name="twitter:image" content={`${SITE_URL}/og/security.png`} />
        <link rel="canonical" href={`${SITE_URL}/security`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      </Helmet>
      <Navbar />

      {/* Reading progress, sitting directly under the fixed navbar. */}
      <div
        className="fixed inset-x-0 top-[calc(4rem+1px+env(safe-area-inset-top))] z-40 h-0.5 bg-border/50"
        aria-hidden="true"
      >
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-primary" />
      </div>

      <main ref={rootRef} className="pt-[calc(66px+env(safe-area-inset-top))] text-foreground">
        <header data-scene className={cn(SCENE, "text-center")}>
          <div className="flex w-full max-w-[1000px] flex-col items-center gap-7">
            <h1 className="text-balance text-[46px] font-semibold leading-[.98] tracking-[-0.05em] min-[760px]:text-[72px] min-[1100px]:text-[96px]">
              How Zensus handles your financial data
            </h1>
            <p className="max-w-[600px] text-balance text-[18px] leading-[1.5] text-muted-foreground min-[760px]:text-[21px]">
              Zensus reads from your banks, books, and CRM to forecast cash. Here is exactly what we
              hold, what we never touch, and how it is protected.
            </p>
            <p className="mt-4 flex items-center gap-2 text-[14px] text-muted-foreground">
              <span className="h-[7px] w-[7px] rounded-full bg-primary" aria-hidden="true" />
              Last reviewed <span className="font-mono text-foreground">{LAST_REVIEWED}</span>
            </p>
          </div>
        </header>

        <section data-scene aria-labelledby="security-password" className={cn(SCENE, "text-center")}>
          <div className="flex w-full max-w-[1080px] flex-col items-center gap-10 min-[760px]:gap-14">
            <div className="flex flex-col items-center gap-4">
              <h2 id="security-password" className={cn(H2_LARGE, "max-w-[860px]")}>
                We never see your bank or QuickBooks password.
              </h2>
              <p className={cn(SUB, "text-muted-foreground")}>Plaid and Intuit hold those.</p>
            </div>
            <DataFlow />
            <div className="flex w-full max-w-[720px] flex-col items-center gap-2.5 border-t border-border pt-7 min-[760px]:pt-9">
              <h3 className="text-balance text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] min-[760px]:text-[34px]">
                Zensus cannot move your money.
              </h3>
              <p className="max-w-[560px] text-balance text-[17px] leading-[1.5] text-muted-foreground">
                We read your financial data and never write to your bank, QuickBooks, or HubSpot.
              </p>
            </div>
          </div>
        </section>

        <section
          data-scene
          aria-labelledby="security-stored"
          className={cn(SCENE, "relative overflow-hidden bg-forest text-center text-forest-foreground")}
        >
          <div className="relative z-10 flex w-full max-w-[1080px] flex-col items-center gap-10 min-[760px]:gap-14">
            <div className="flex flex-col items-center gap-4">
              <h2 id="security-stored" className={cn(H2_LARGE, "max-w-[900px] text-forest-foreground")}>
                Your data is encrypted, backed up daily, and stored in the United States.
              </h2>
              <p className={cn(SUB, "text-forest-muted-strong")}>Your data never trains an AI model.</p>
            </div>
            <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-7 min-[760px]:grid-cols-4">
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col items-center gap-2 border-t border-forest-border pt-5"
                >
                  <dt className="text-[14px] text-forest-muted">{fact.label}</dt>
                  <dd className="font-mono text-[22px] leading-[1.15] tracking-[-0.02em] text-sage-light min-[760px]:text-[28px] min-[1100px]:text-[34px]">
                    {fact.value}
                  </dd>
                  <dd className="text-balance text-[14px] leading-[1.5] text-forest-muted-strong">
                    {fact.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <img
            loading="lazy"
            decoding="async"
            src={meshInverted960}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] w-full object-cover object-bottom opacity-[.14] mix-blend-screen"
          />
        </section>

        <section data-scene aria-labelledby="security-hold" className={SCENE}>
          <div className="flex w-full max-w-[1080px] flex-col items-center gap-7 min-[760px]:gap-12">
            <h2 id="security-hold" className={cn(H2_SMALL, "text-center")}>
              What we store, and never store
            </h2>
            <div className="grid w-full grid-cols-1 items-start gap-7 min-[760px]:gap-12 min-[1100px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div>
                <div className="flex items-baseline justify-between border-b border-foreground pb-3">
                  <h3 className="text-[17px] font-semibold">Stores</h3>
                  <span className="font-mono text-[12.5px] text-muted-foreground">{STORE_COUNT} items</span>
                </div>
                {STORE_GROUPS.map((group) => (
                  <div
                    key={group.title}
                    className="grid grid-cols-1 gap-x-7 gap-y-2.5 border-b border-border py-5 min-[760px]:grid-cols-[minmax(0,170px)_minmax(0,1fr)]"
                  >
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-[17px] font-semibold leading-[1.3] tracking-[-0.015em]">{group.title}</h4>
                      <p className="text-[14px] leading-[1.5] text-muted-foreground">{group.summary}</p>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li key={item} className="grid grid-cols-[18px_minmax(0,1fr)] gap-2 text-[14px] leading-[1.5]">
                          <Check className="mt-1 h-[13px] w-[13px] text-sage-deep" strokeWidth={2.4} aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-5">
                <div className={cn(BLOCK, BLOCK_PAD, "bg-secondary")}>
                  <h3 className="mb-1 text-[17px] font-semibold">Never stores</h3>
                  {NEVER_STORES.map((entry, i) => (
                    <p key={entry.item} className={cn("flex flex-col gap-1.5 py-[18px]", i > 0 && "border-t border-border")}>
                      <span className="text-[21px] font-semibold leading-[1.2] tracking-[-0.025em] min-[760px]:text-[24px]">
                        {entry.item}
                      </span>
                      <span className="text-[15px] text-muted-foreground">{entry.holder}</span>
                    </p>
                  ))}
                </div>
                <div className={cn(BLOCK, BLOCK_PAD, "border border-border")}>
                  <h3 className="mb-1 text-[17px] font-semibold">Keeping or removing your data</h3>
                  {KEEP_OR_REMOVE.map((line, i) => (
                    <p key={line} className={cn("py-3 text-[14.5px] leading-[1.55]", i > 0 && "border-t border-rule-soft")}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-scene aria-labelledby="security-trust" className={cn(SCENE, "bg-secondary")}>
          <div className="flex w-full max-w-[1080px] flex-col items-center gap-7 min-[760px]:gap-12">
            <h2 id="security-trust" className={cn(H2_SMALL, "text-center")}>
              Who can see it, and where we stand
            </h2>
            <div className="grid w-full grid-cols-1 items-start gap-7 min-[760px]:gap-12 min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-2.5 border-t border-foreground pt-[18px]">
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Staff access</h3>
                  <p className="text-pretty text-[16px] leading-[1.6]">
                    One named Zensus admin can open a one-hour support session on an account. Each
                    session needs a second factor and a written reason, and is logged.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 border-t border-foreground pt-[18px]">
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Account isolation</h3>
                  <p className="text-pretty text-[16px] leading-[1.6]">
                    Every account is separate. The application ties each request to your signed-in
                    user and filters your data by that user.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 border-t border-foreground pt-[18px]">
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Two-factor authentication</h3>
                  <p className="text-pretty text-[16px] leading-[1.6]">
                    You can turn on two-factor authentication with an authenticator app. You get 10
                    single-use recovery codes, and we email you when these settings change.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-[20px] border border-border bg-card px-[22px] py-1.5 [corner-shape:squircle]">
                  <h3 className="pb-3 pt-3.5 text-[19px] font-semibold tracking-[-0.02em]">Compliance status</h3>
                  <ul>
                    {COMPLIANCE.map((row) => (
                      <li
                        key={row.area}
                        className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 border-t border-rule-soft py-3"
                      >
                        <span className="text-[15px] font-semibold">{row.area}</span>
                        <span className="flex items-center justify-end gap-2 whitespace-nowrap text-[13.5px] font-medium">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              row.status === "Active" ? "bg-primary" : "bg-scenario",
                            )}
                            aria-hidden="true"
                          />
                          {row.status}
                        </span>
                        <span className="col-span-full font-mono text-[12.5px] leading-[1.5] text-muted-foreground">
                          {row.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-pretty text-[15px] leading-[1.6]">
                  Zensus is not yet SOC 2 certified, and we would rather tell you exactly where we
                  stand than imply otherwise. If your procurement process needs specific evidence,
                  talk to us and we will share what we have.
                </p>
                <a
                  href={`https://securityheaders.com/?q=${encodeURIComponent(SITE_URL)}&followRedirects=on`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-medium text-sage-dark hover:text-sage-deep"
                >
                  Verify our HTTP security headers
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section data-scene aria-labelledby="security-faq" className={SCENE}>
          <div className="flex w-full max-w-[780px] flex-col items-center gap-7 min-[760px]:gap-12">
            <div className="flex flex-col items-center gap-3.5 text-center">
              <h2 id="security-faq" className={H2_SMALL}>
                Common security questions
              </h2>
              <p className="text-[16px] leading-[1.55] text-muted-foreground">
                The full detail for procurement and IT reviewers follows the questions.
              </p>
            </div>
            <SecurityFaq />
          </div>
        </section>

        <section data-scene aria-label="Disclosure and procurement" className={SCENE}>
          <div className="grid w-full max-w-[1080px] grid-cols-1 items-stretch gap-7 min-[760px]:gap-12 min-[1100px]:grid-cols-2">
            <div
              id="responsible-disclosure"
              className={cn(END_CARD, "scroll-mt-24 border border-border bg-card")}
            >
              <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em]">Responsible disclosure</h2>
              <p className="text-[15.5px] leading-[1.65]">
                Found a security issue? Email{" "}
                <a href="mailto:support@zensus.app" className={cn(LINK, "font-medium")}>
                  support@zensus.app
                </a>{" "}
                and we will work with you on it. We support good-faith security research. If you
                report a vulnerability responsibly, test only against your own account, give us
                reasonable time to fix the issue before disclosing it, and do not access, modify, or
                delete data that is not your own, we will not pursue legal action against you for
                your research.
              </p>
              <p className="text-[15.5px] leading-[1.65]">
                Our machine-readable policy lives at{" "}
                <a href="/.well-known/security.txt" className={cn(LINK, "whitespace-nowrap font-mono text-[14px]")}>
                  /.well-known/security.txt
                </a>
                .
              </p>
            </div>
            <div className={cn(END_CARD, "relative justify-between gap-7 overflow-hidden bg-forest text-forest-foreground")}>
              <img
                loading="lazy"
                decoding="async"
                src={meshInverted960}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full object-cover object-bottom opacity-[.16] mix-blend-screen"
              />
              <div className="relative flex flex-col gap-4">
                <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-forest-foreground">
                  Procurement
                </h2>
                <p className="text-[15.5px] leading-[1.65] text-forest-muted-strong">
                  Review the{" "}
                  <a href="/subprocessors" className={FOREST_LINK}>
                    subprocessors
                  </a>{" "}
                  we rely on. Security questions, disclosures, and procurement inquiries go to{" "}
                  <a href="mailto:support@zensus.app" className={FOREST_LINK}>
                    support@zensus.app
                  </a>
                  . If a breach affects your data, we will notify you without undue delay.
                </p>
              </div>
              <TalkToUsButton size="lg" className="relative self-start hover:bg-sage-light" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
