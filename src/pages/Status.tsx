import { Helmet } from "react-helmet-async";
import { AlertTriangle, CheckCircle2, Wrench, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { STATUS, type SiteStatus, type StatusState } from "@/config/status";
import { useStatusHealth } from "@/hooks/use-status-health";

// The app reads `from=status` to delay its health check by 60 seconds, so a
// visitor who clicks through is not bounced straight back here.
//
// The product app now lives on app.zensus.finance. The site-wide APP_URL
// constant still says app.zensus.app (whose root forwards to this site), so
// this page names the new origin itself until APP_URL is migrated.
const RETRY_APP_ORIGIN = "https://app.zensus.finance";
export const TRY_AGAIN_URL = `${RETRY_APP_ORIGIN}/?from=status`;

interface StateCopy {
  heading: string;
  label: string;
  // When set, replaces the configured message. Used where a hand-written
  // message could wrongly hint that something went wrong.
  fixedMessage?: string;
  icon: LucideIcon;
  // Tailwind classes for the icon badge. Kept calm: amber for trouble,
  // never an alarming red.
  tone: string;
}

const COPY: Record<StatusState, StateCopy> = {
  outage: {
    heading: "We're experiencing an issue",
    label: "Service unavailable",
    icon: AlertTriangle,
    tone: "bg-amber-100 text-amber-900",
  },
  degraded: {
    heading: "Some things are running slowly",
    label: "Degraded performance",
    icon: AlertTriangle,
    tone: "bg-amber-100 text-amber-900",
  },
  maintenance: {
    heading: "Scheduled maintenance",
    label: "Maintenance in progress",
    icon: Wrench,
    tone: "bg-secondary text-secondary-foreground",
  },
  operational: {
    heading: "Everything is running normally",
    label: "All systems operational",
    fixedMessage: "All Zensus services are running normally.",
    icon: CheckCircle2,
    tone: "bg-emerald-100 text-emerald-900",
  },
};

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  })} UTC`;
}

export function StatusView({
  status,
  checkedAt = null,
}: {
  status: SiteStatus;
  /** Set once a live health check has proven the service is up. */
  checkedAt?: Date | null;
}) {
  const copy = COPY[status.state];
  const Icon = copy.icon;
  const isUp = status.state === "operational";

  return (
    <main className="bg-background">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 pb-24 pt-28 sm:min-h-[65vh] sm:pt-32 text-center">
        <span
          className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${copy.tone}`}
          aria-hidden="true"
        >
          <Icon className="h-7 w-7" />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {copy.heading}
        </h1>
        <div role="status" className="mt-4 space-y-2">
          <p className="text-sm font-medium text-foreground">{copy.label}</p>
          <p className="text-lg leading-relaxed text-muted-foreground">{copy.fixedMessage ?? status.message}</p>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {checkedAt ? (
            <>
              Checked <time dateTime={checkedAt.toISOString()}>just now</time>
            </>
          ) : (
            <>
              Last updated:{" "}
              <time dateTime={status.updatedAt}>{formatUpdatedAt(status.updatedAt)}</time>
            </>
          )}
        </p>
        <Button asChild size="lg" className="mt-8">
          <a href={TRY_AGAIN_URL}>{isUp ? "Open Zensus" : "Try again"}</a>
        </Button>
        <p className="mt-8 text-sm text-muted-foreground">
          Need help? Email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </div>
    </main>
  );
}

const Status = () => {
  const live = useStatusHealth(STATUS);
  // The health check can only move the page up to "operational", on proof.
  const status: SiteStatus = live.upgraded ? { ...STATUS, state: "operational" } : STATUS;
  return (
    <>
      <Helmet>
        <title>Zensus Status</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />
      <StatusView status={status} checkedAt={live.upgraded ? live.checkedAt : null} />
      <Footer />
    </>
  );
};

export default Status;
