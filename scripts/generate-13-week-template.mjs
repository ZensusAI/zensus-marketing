// Generate the downloadable 13-week cash flow template (XLSX) shipped at
// public/templates/13-week-cash-flow-template.xlsx and linked from the
// 13-week guide. Formulas live in the sheet (weekly totals, net cash flow,
// closing balance chained into next week's opening, buffer check), so the
// file works in Excel, Google Sheets, and Numbers without macros.
//
// Usage: node scripts/generate-13-week-template.mjs

import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import xlsx from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "templates");
const outPath = join(outDir, "13-week-cash-flow-template.xlsx");

const WEEKS = 13;
// Column letters B..N for weeks 1..13
const col = (week) => String.fromCharCode("B".charCodeAt(0) + week - 1);

const rows = [];
const set = (r, c, cell) => {
  rows[r] = rows[r] ?? [];
  rows[r][c] = cell;
};
const label = (r, text) => set(r, 0, { v: text, t: "s" });

// Row indexes (0-based) for the layout
const R = {
  title: 0,
  note: 1,
  header: 3,
  weekOf: 4,
  opening: 5,
  cashInHeader: 6,
  collections: 7,
  contracts: 8,
  otherIn: 9,
  totalIn: 10,
  cashOutHeader: 11,
  payroll: 12,
  payrollTaxes: 13,
  rent: 14,
  software: 15,
  marketing: 16,
  otherOut: 17,
  totalOut: 18,
  net: 19,
  closing: 20,
  floorLabel: 22,
  bufferCheck: 23,
};
const xl = (r) => r + 1; // 0-based row index -> Excel row number

label(R.title, "13-Week Cash Flow Forecast");
label(
  R.note,
  "From zensus.app. Enter amounts in the input rows; totals, net cash flow, closing balances, and the buffer check are formulas. Week 1 opening balance and the cash buffer floor are the only setup inputs.",
);

label(R.header, "Line item");
for (let week = 1; week <= WEEKS; week += 1) {
  set(R.header, week, { v: `Week ${week}`, t: "s" });
}

label(R.weekOf, "Week beginning (enter date)");
label(R.opening, "Opening balance");
set(R.opening, 1, { v: 100000, t: "n" });
for (let week = 2; week <= WEEKS; week += 1) {
  set(R.opening, week, { t: "n", f: `${col(week - 1)}${xl(R.closing)}` });
}

label(R.cashInHeader, "CASH IN");
label(R.collections, "Customer collections");
label(R.contracts, "Annual and quarterly contract payments");
label(R.otherIn, "Other inflows");
label(R.totalIn, "Total cash in");

label(R.cashOutHeader, "CASH OUT");
label(R.payroll, "Payroll and contractors");
label(R.payrollTaxes, "Payroll taxes and benefits");
label(R.rent, "Rent and utilities");
label(R.software, "Software and subscriptions");
label(R.marketing, "Marketing");
label(R.otherOut, "Other outflows");
label(R.totalOut, "Total cash out");

label(R.net, "Net cash flow");
label(R.closing, "Closing balance");

label(R.floorLabel, "Cash buffer floor (your minimum)");
set(R.floorLabel, 1, { v: 25000, t: "n" });
label(R.bufferCheck, "Buffer check");

for (let week = 1; week <= WEEKS; week += 1) {
  const c = col(week);
  for (const r of [R.collections, R.contracts, R.otherIn, R.payroll, R.payrollTaxes, R.rent, R.software, R.marketing, R.otherOut]) {
    set(r, week, { v: 0, t: "n" });
  }
  set(R.totalIn, week, { t: "n", f: `SUM(${c}${xl(R.collections)}:${c}${xl(R.otherIn)})` });
  set(R.totalOut, week, { t: "n", f: `SUM(${c}${xl(R.payroll)}:${c}${xl(R.otherOut)})` });
  set(R.net, week, { t: "n", f: `${c}${xl(R.totalIn)}-${c}${xl(R.totalOut)}` });
  set(R.closing, week, { t: "n", f: `${c}${xl(R.opening)}+${c}${xl(R.net)}` });
  set(R.bufferCheck, week, {
    t: "s",
    f: `IF(${c}${xl(R.closing)}<$B$${xl(R.floorLabel)},"BELOW FLOOR","OK")`,
  });
}

// Build the worksheet from the sparse rows structure
const ws = {};
const range = { s: { r: 0, c: 0 }, e: { r: R.bufferCheck, c: WEEKS } };
rows.forEach((cells, r) => {
  cells?.forEach((cell, c) => {
    if (cell) ws[xlsx.utils.encode_cell({ r, c })] = cell;
  });
});
ws["!ref"] = xlsx.utils.encode_range(range);
ws["!cols"] = [{ wch: 38 }, ...Array.from({ length: WEEKS }, () => ({ wch: 12 }))];

const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "13-Week Forecast");

await mkdir(outDir, { recursive: true });
xlsx.writeFile(wb, outPath);
console.log(`[template] wrote ${outPath}`);
