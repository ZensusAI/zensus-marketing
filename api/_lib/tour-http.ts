import type { VercelResponse } from "@vercel/node";

// Every tour response is personal (it answers one link holder) and must never
// be cached by a browser or CDN, or indexed if a crawler ever reaches it.
export const TOUR_RESPONSE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export function setTourHeaders(res: VercelResponse): void {
  for (const [key, value] of Object.entries(TOUR_RESPONSE_HEADERS)) res.setHeader(key, value);
}

/** One answer for every refused link: no detail on why. */
export const INVALID_LINK = { code: "invalid" } as const;

export function logTour(fn: string, outcome: string, reason?: string): void {
  console.log(JSON.stringify({ fn, outcome, reason }));
}
