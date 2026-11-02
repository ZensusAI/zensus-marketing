import { cn } from "@/lib/utils";

const NODE = "flex flex-col gap-1.5 rounded-[18px] px-[22px] py-5 [corner-shape:squircle]";
const LINK =
  "flex items-center gap-2 py-2.5 pl-[22px] min-[760px]:flex-col min-[760px]:px-3 min-[760px]:py-0";
const LINE = "h-8 w-px shrink-0 min-[760px]:h-px min-[760px]:w-full min-[760px]:min-w-10";
const LINK_LABEL = "whitespace-nowrap font-mono text-[12.5px]";

/**
 * The credential diagram (handoff 17-security): your password stops at the
 * provider, and only a scoped token reaches Zensus. Horizontal from 760px,
 * vertical below it.
 */
const DataFlow = () => (
  <div className="grid w-full grid-cols-1 items-center text-left min-[760px]:grid-cols-[minmax(0,1fr)_130px_minmax(0,1fr)_130px_minmax(0,1fr)]">
    <div className={cn(NODE, "border border-border bg-card")}>
      <span className="text-[13px] text-muted-foreground">You</span>
      <span className="text-[18px] font-semibold">Your bank login</span>
    </div>
    <div className={LINK}>
      <span className={cn(LINK_LABEL, "text-muted-foreground")}>password</span>
      <span className={cn(LINE, "bg-[#D9C79A]")} aria-hidden="true" />
    </div>
    <div className={cn(NODE, "border border-foreground bg-card")}>
      <span className="text-[13px] text-muted-foreground">Provider</span>
      <span className="text-[18px] font-semibold">Plaid or Intuit</span>
      <span className="text-[13.5px] text-muted-foreground">Holds your credentials</span>
    </div>
    <div className={LINK}>
      <span className={cn(LINK_LABEL, "text-sage-dark")}>scoped token</span>
      <span className={cn(LINE, "bg-primary")} aria-hidden="true" />
    </div>
    <div className={cn(NODE, "bg-forest text-forest-foreground")}>
      <span className="text-[13px] text-forest-muted">Zensus</span>
      <span className="text-[18px] font-semibold">Token only</span>
      <span className="text-[13.5px] text-forest-muted-strong">Reads. Never writes.</span>
    </div>
  </div>
);

export default DataFlow;
