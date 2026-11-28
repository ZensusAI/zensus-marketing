/*
 * Arithmetic behind the net working capital guide's two in-post tools. Kept
 * pure so the published worked examples are pinned by tests.
 */

export type BalanceSheet = {
  cash: number;
  marketableSecurities: number;
  receivables: number;
  inventory: number;
  prepaid: number;
  otherCurrentAssets: number;
  payables: number;
  accrued: number;
  shortTermDebt: number;
  otherCurrentLiabilities: number;
};

export type WorkingCapitalHealth = {
  currentAssets: number;
  currentLiabilities: number;
  netWorkingCapital: number;
  /** Null when there are no current liabilities to divide by. */
  currentRatio: number | null;
  quickRatio: number | null;
  cashRatio: number | null;
};

const ratio = (top: number, bottom: number) => (bottom > 0 ? top / bottom : null);

export function workingCapitalHealth(b: BalanceSheet): WorkingCapitalHealth {
  const currentAssets = b.cash + b.marketableSecurities + b.receivables + b.inventory + b.prepaid + b.otherCurrentAssets;
  const currentLiabilities = b.payables + b.accrued + b.shortTermDebt + b.otherCurrentLiabilities;
  return {
    currentAssets,
    currentLiabilities,
    netWorkingCapital: currentAssets - currentLiabilities,
    currentRatio: ratio(currentAssets, currentLiabilities),
    // Quick assets: cash, cash equivalents, marketable securities and net receivables.
    quickRatio: ratio(b.cash + b.marketableSecurities + b.receivables, currentLiabilities),
    // The guide's simplified cash ratio: cash and cash equivalents only.
    cashRatio: ratio(b.cash, currentLiabilities),
  };
}

export type CashReleaseInputs = {
  annualCreditSales: number;
  annualCogs: number;
  collectDaysFaster: number;
  inventoryDaysFewer: number;
  supplierDaysLonger: number;
};

export type CashRelease = { collections: number; inventory: number; suppliers: number; total: number };

/**
 * One-time cash released or retained by shortening the cash conversion cycle.
 * Receivables move with credit sales per day; inventory and payables with cost
 * of goods sold per day (COGS stands in for purchases). Each line is rounded
 * to the dollar, and the total is the sum of the rounded lines, as in the guide.
 */
export function cashRelease(i: CashReleaseInputs): CashRelease {
  const collections = Math.round((i.annualCreditSales / 365) * i.collectDaysFaster);
  const inventory = Math.round((i.annualCogs / 365) * i.inventoryDaysFewer);
  const suppliers = Math.round((i.annualCogs / 365) * i.supplierDaysLonger);
  return { collections, inventory, suppliers, total: collections + inventory + suppliers };
}
