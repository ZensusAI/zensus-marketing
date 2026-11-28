import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { cashRelease, workingCapitalHealth, type BalanceSheet, type CashReleaseInputs } from "@/lib/working-capital";
import { SQUIRCLE } from "./PostCard";

/*
 * The two in-post tools for the net working capital guide. Both open on the
 * guide's own worked examples (the marketing agency, and the $1.2M business),
 * so the prerendered HTML shows the same numbers the article quotes.
 */

// A function, not a constant: SQUIRCLE comes from PostCard, which loads the
// blog post list, which loads this file. Reading it at module load would hit
// that import cycle before PostCard has initialised (a blank page in dev).
const frame = () => cn("not-prose my-9 rounded-[24px] border border-border bg-card p-5 min-[760px]:p-7", SQUIRCLE);
const EYEBROW = "font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-primary";
const usd = (n: number) => (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
const fixed2 = (n: number | null) => (n === null ? "n/a" : n.toFixed(2));

function MoneyField({ label, value, onChange, hint }: { label: string; value: number; onChange: (n: number) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13.5px] font-medium text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step={1000}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="tabular-nums"
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint ? (
        <span id={`${id}-hint`} className="text-[12.5px] text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "bad" | "good" }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border pt-3">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-mono text-[22px] font-semibold tabular-nums text-foreground",
          tone === "bad" && "text-[#B4452A]",
          tone === "good" && "text-primary",
        )}
      >
        {value}
      </span>
      <span className="text-[12.5px] leading-snug text-muted-foreground">{note}</span>
    </div>
  );
}

const AGENCY: BalanceSheet = {
  cash: 20000,
  marketableSecurities: 0,
  receivables: 60000,
  inventory: 0,
  prepaid: 5000,
  otherCurrentAssets: 0,
  payables: 25000,
  accrued: 10000,
  shortTermDebt: 5000,
  otherCurrentLiabilities: 0,
};

/** Net working capital plus the current, quick and cash ratios from a balance sheet. */
export function WorkingCapitalCalculator() {
  const [b, setB] = useState<BalanceSheet>(AGENCY);
  const set = (key: keyof BalanceSheet) => (n: number) => setB((prev) => ({ ...prev, [key]: n }));
  const h = workingCapitalHealth(b);

  return (
    <section aria-label="Net working capital calculator" className={frame()}>
      <p className={EYEBROW}>Net working capital calculator</p>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Enter amounts from your balance sheet. It opens on the marketing agency example above.
      </p>

      <div className="mt-5 grid gap-6 min-[760px]:grid-cols-2">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-[15px] font-semibold text-foreground">Current assets</legend>
          <MoneyField label="Cash and cash equivalents" value={b.cash} onChange={set("cash")} />
          <MoneyField label="Marketable securities" value={b.marketableSecurities} onChange={set("marketableSecurities")} />
          <MoneyField label="Accounts receivable" value={b.receivables} onChange={set("receivables")} hint="Net of any allowance for doubtful accounts." />
          <MoneyField label="Inventory" value={b.inventory} onChange={set("inventory")} />
          <MoneyField label="Prepaid expenses" value={b.prepaid} onChange={set("prepaid")} />
          <MoneyField label="Other current assets" value={b.otherCurrentAssets} onChange={set("otherCurrentAssets")} />
        </fieldset>
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-[15px] font-semibold text-foreground">Current liabilities</legend>
          <MoneyField label="Accounts payable" value={b.payables} onChange={set("payables")} />
          <MoneyField label="Accrued expenses" value={b.accrued} onChange={set("accrued")} />
          <MoneyField label="Short-term debt" value={b.shortTermDebt} onChange={set("shortTermDebt")} hint="Include the current portion of long-term debt." />
          <MoneyField label="Other current liabilities" value={b.otherCurrentLiabilities} onChange={set("otherCurrentLiabilities")} hint="For example taxes payable or current deferred revenue." />
        </fieldset>
      </div>

      <div aria-live="polite" className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 min-[760px]:grid-cols-4">
        <Stat
          label="Net working capital"
          value={usd(h.netWorkingCapital)}
          note={`${usd(h.currentAssets)} − ${usd(h.currentLiabilities)}`}
          tone={h.netWorkingCapital < 0 ? "bad" : "good"}
        />
        <Stat label="Current ratio" value={fixed2(h.currentRatio)} note="Current assets ÷ current liabilities" />
        <Stat label="Quick ratio" value={fixed2(h.quickRatio)} note="Cash, securities and receivables ÷ current liabilities" />
        <Stat label="Cash ratio" value={fixed2(h.cashRatio)} note="Cash and cash equivalents ÷ current liabilities (simplified: excludes securities)" />
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
        These are point-in-time measures. They do not show when receivables will turn into cash or when liabilities fall due.
      </p>
    </section>
  );
}

function DaysField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13.5px] font-medium text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={365}
        step={1}
        value={value}
        onChange={(e) => onChange(Math.min(365, Math.max(0, Number(e.target.value) || 0)))}
        className="tabular-nums"
      />
    </div>
  );
}

/** One-time cash released by collecting faster, holding less inventory and extending supplier terms. */
export function WorkingCapitalScenarioPlanner() {
  const [i, setI] = useState<CashReleaseInputs>({
    annualCreditSales: 1_200_000,
    annualCogs: 480_000,
    collectDaysFaster: 10,
    inventoryDaysFewer: 5,
    supplierDaysLonger: 5,
  });
  const set = (key: keyof CashReleaseInputs) => (n: number) => setI((prev) => ({ ...prev, [key]: n }));
  const r = cashRelease(i);
  const rows: [string, number][] = [
    [`Collect customer payments ${i.collectDaysFaster} days faster`, r.collections],
    [`Reduce inventory holding by ${i.inventoryDaysFewer} days`, r.inventory],
    [`Extend supplier payment terms by ${i.supplierDaysLonger} days`, r.suppliers],
  ];
  const max = Math.max(1, ...rows.map(([, v]) => v));

  return (
    <section aria-label="Working capital scenario planner" className={frame()}>
      <p className={EYEBROW}>Working capital scenario planner</p>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        It opens on the example above. Change the inputs to estimate your own one-time cash release.
      </p>

      <div className="mt-5 grid gap-3 min-[760px]:grid-cols-2">
        <MoneyField label="Annual credit sales" value={i.annualCreditSales} onChange={set("annualCreditSales")} />
        <MoneyField label="Annual cost of goods sold" value={i.annualCogs} onChange={set("annualCogs")} hint="Drives inventory days, and stands in for purchases on supplier days." />
        <DaysField label="Days faster to collect" value={i.collectDaysFaster} onChange={set("collectDaysFaster")} />
        <DaysField label="Fewer days of inventory held" value={i.inventoryDaysFewer} onChange={set("inventoryDaysFewer")} />
        <DaysField label="Days longer supplier terms" value={i.supplierDaysLonger} onChange={set("supplierDaysLonger")} />
      </div>

      <div aria-live="polite" className="mt-6 flex flex-col gap-4">
        {rows.map(([label, v]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4 text-[14.5px] text-foreground">
              <span>{label}</span>
              <span className="font-mono font-semibold tabular-nums">{usd(v)}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1E6CB]" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(v / max) * 100}%` }} />
            </div>
          </div>
        ))}
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-4">
          <span className="text-[15px] font-semibold text-foreground">Total estimated one-time cash release</span>
          <span className="font-mono text-[22px] font-semibold tabular-nums text-primary">{usd(r.total)}</span>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
        A one-time working capital benefit, not additional profit or recurring savings. Assumes stable sales and costs.
      </p>
    </section>
  );
}
