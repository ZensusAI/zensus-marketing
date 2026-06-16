import { Landmark, KeyRound, Filter, Lock, ChevronRight } from "lucide-react";
import { Fragment } from "react";

// A four-step schematic of how financial data reaches Zensus. The point it
// makes visually: credentials stay with the provider, Zensus only ever holds
// scoped tokens, and what it does hold is encrypted in a US region.
const STEPS = [
  {
    n: "01",
    icon: Landmark,
    label: "Your banks, QuickBooks, HubSpot",
    note: "You authorize access through OAuth",
  },
  {
    n: "02",
    icon: KeyRound,
    label: "Scoped OAuth tokens",
    note: "Each provider holds the credentials",
  },
  {
    n: "03",
    icon: Filter,
    label: "Zensus reads only what it needs",
    note: "Just enough to project your runway",
  },
  {
    n: "04",
    icon: Lock,
    label: "Encrypted at rest on AWS",
    note: "AES-256-GCM, United States region",
  },
];

const DataFlow = () => (
  <div>
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
      {STEPS.map((step, i) => (
        <Fragment key={step.n}>
          <div className="flex flex-1 flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-primary">{step.n}</span>
              <step.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-medium leading-snug text-foreground">{step.label}</p>
            <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted-foreground">{step.note}</p>
          </div>
          {i < STEPS.length - 1 && (
            <ChevronRight
              className="mx-auto shrink-0 rotate-90 self-center text-primary/50 lg:rotate-0"
              aria-hidden="true"
            />
          )}
        </Fragment>
      ))}
    </div>
    <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
      Your bank password never touches Zensus. Credentials stay with each provider.
    </p>
  </div>
);

export default DataFlow;
