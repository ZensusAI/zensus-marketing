import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyTourTokenFromEnv } from "./_lib/tour-token.js";
import { readStepImage } from "./_lib/tour-manifest.js";
import { INVALID_LINK, logTour, setTourHeaders } from "./_lib/tour-http.js";

// GET /api/tour-image?s=<stepId> with the link token in the x-tour-token
// header (a header, so the token never lands in a URL, a log line or the
// browser history). The page fetches each screenshot this way and shows it
// through an object URL. The images sit in api/_tour/, outside public/, so
// there is no other way to fetch them.

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? undefined : value;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setTourHeaders(res);
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ code: "method_not_allowed" });
  }

  const v = verifyTourTokenFromEnv(single(req.headers["x-tour-token"]));
  if (v.ok === false) {
    logTour("tour-image", "refused", v.error);
    return res.status(404).json(INVALID_LINK);
  }

  const image = await readStepImage(single(req.query.s));
  if (!image) return res.status(404).json({ code: "not_found" });

  res.setHeader("Content-Type", image.contentType);
  res.setHeader("Content-Length", String(image.body.length));
  return res.status(200).send(image.body);
}
