// The one file to edit when Zensus has an outage. The /status page reads this
// constant and nothing else: it makes no network request, so it keeps working
// when the product backend is down. Change the values, merge, and let Vercel
// redeploy to update the page.
//
//   state      'outage' | 'degraded' | 'maintenance' | 'operational'
//   message    One or two plain sentences shown under the heading. Do not
//              name a cause or promise a time unless you are certain.
//              Ignored when state is 'operational': the page then shows a
//              fixed neutral line instead.
//   healthUrl  Public health endpoint the page polls in the background. It can
//              only upgrade the page to 'operational' (after 2 consecutive
//              healthy checks), never show an error or an outage, and it is
//              skipped when state is 'maintenance'. If it is unreachable the
//              page just stays on the static copy above.
//   updatedAt  ISO 8601 timestamp of when you last changed this, in UTC.

export type StatusState = "outage" | "degraded" | "maintenance" | "operational";

export interface SiteStatus {
  state: StatusState;
  message: string;
  updatedAt: string;
  healthUrl: string;
}

export const STATUS: SiteStatus = {
  state: "outage",
  message:
    "Zensus is currently unavailable. We're aware and working to restore service. Your data is safe.",
  updatedAt: "2026-11-27T00:00:00Z",
  healthUrl: "https://api.zensus.app/health",
};
