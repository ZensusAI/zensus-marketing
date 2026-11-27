import { Helmet } from "react-helmet-async";
import { AlertTriangle, CheckCircle2, Wrench, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { APP_URL, SUPPORT_EMAIL } from "@/lib/constants";
import { STATUS, type SiteStatus, type StatusState } from "@/config/status";

// The app reads `from=status` to delay its health check by 60 seconds, so a
// visitor who clicks through is not bounced straight back here.
export const TRY_AGAIN_URL = `${APP_URL}/?from=status`;

interface StateCopy {
  heading: string;
  label: string;
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

export function StatusView({ status }: { status: SiteStatus }) {
  const copy = COPY[status.state];
  const Icon = copy.icon;
  const isUp = status.state === "operational";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 pb-24 pt-32 text-center">
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
          <p className="text-lg leading-relaxed text-muted-foreground">{status.message}</p>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Last updated: <time dateTime={status.updatedAt}>{formatUpdatedAt(status.updatedAt)}</time>
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

const Status = () => (
  <>
    <Helmet>
      <title>Zensus Status</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <Navbar />
    <StatusView status={STATUS} />
    <Footer />
  </>
);

export default Status;
