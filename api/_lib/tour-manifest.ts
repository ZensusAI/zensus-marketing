// The private tour's step manifest and screenshots.
//
// Both live in api/_tour/, not public/: anything under public/ is served to
// anyone who guesses the URL, and these are only for people holding a valid
// link. The directory name starts with "_", so Vercel does not deploy it as a
// function, and vercel.json `functions.includeFiles` ships it inside the two
// tour functions' bundles. The functions find it from process.cwd(), which is
// the project root both on Vercel and under vitest.
//
// manifest.json is written by hand today and rewritten by the screenshot
// capture script later; see validateManifest for the exact format.

import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const TOUR_DIR = join(process.cwd(), "api", "_tour");

export type Hotspot = { x: number; y: number; w: number; h: number };

export type TourStep = {
  id: string;
  /** File name inside api/_tour/, never a path. */
  image: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  /** Click target, in percent (0 to 100) of the image's width and height. */
  hotspot: Hotspot;
};

/** What the browser is sent: everything except the file name. */
export type PublicTourStep = Omit<TourStep, "image">;

export const STEP_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(png|webp|jpg|jpeg)$/;

export const IMAGE_TYPES: Record<string, string> = {
  png: "image/png",
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function isFiniteIn(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function shortText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

/**
 * Throws on anything a capture script could get wrong, so a bad rewrite fails
 * the test suite instead of shipping a broken tour.
 */
export function validateManifest(raw: unknown): TourStep[] {
  if (typeof raw !== "object" || raw === null) throw new Error("manifest: not an object");
  const { version, steps } = raw as { version?: unknown; steps?: unknown };
  if (version !== 1) throw new Error("manifest: version must be 1");
  if (!Array.isArray(steps) || steps.length === 0) throw new Error("manifest: steps must be a non-empty array");

  const seen = new Set<string>();
  return steps.map((step: unknown, index: number) => {
    const where = `manifest: steps[${index}]`;
    if (typeof step !== "object" || step === null) throw new Error(`${where} is not an object`);
    const s = step as Record<string, unknown>;
    if (typeof s.id !== "string" || s.id.length > 40 || !STEP_ID.test(s.id)) throw new Error(`${where}.id is invalid`);
    if (seen.has(s.id)) throw new Error(`${where}.id is a duplicate`);
    seen.add(s.id);
    if (typeof s.image !== "string" || !IMAGE_NAME.test(s.image)) throw new Error(`${where}.image must be a plain file name`);
    if (!Number.isInteger(s.width) || !isFiniteIn(s.width, 1, 10000)) throw new Error(`${where}.width is invalid`);
    if (!Number.isInteger(s.height) || !isFiniteIn(s.height, 1, 10000)) throw new Error(`${where}.height is invalid`);
    if (!shortText(s.title, 80)) throw new Error(`${where}.title is invalid`);
    if (!shortText(s.caption, 240)) throw new Error(`${where}.caption is invalid`);
    const h = s.hotspot as Record<string, unknown> | undefined;
    if (
      typeof h !== "object" || h === null ||
      !isFiniteIn(h.x, 0, 100) || !isFiniteIn(h.y, 0, 100) ||
      !isFiniteIn(h.w, 0.5, 100) || !isFiniteIn(h.h, 0.5, 100) ||
      (h.x as number) + (h.w as number) > 100 || (h.y as number) + (h.h as number) > 100
    ) {
      throw new Error(`${where}.hotspot must be x, y, w, h in percent inside the image`);
    }
    return {
      id: s.id,
      image: s.image,
      width: s.width as number,
      height: s.height as number,
      title: s.title as string,
      caption: s.caption as string,
      hotspot: { x: h.x as number, y: h.y as number, w: h.w as number, h: h.h as number },
    };
  });
}

let cached: TourStep[] | null = null;

/** The validated manifest, read once per function instance. */
export function loadTourSteps(): TourStep[] {
  if (!cached) {
    cached = validateManifest(JSON.parse(readFileSync(join(TOUR_DIR, "manifest.json"), "utf-8")));
  }
  return cached;
}

export function publicSteps(steps: TourStep[]): PublicTourStep[] {
  return steps.map(({ image: _image, ...rest }) => rest);
}

/**
 * The image for a step id taken from a query string. The id is checked
 * against the id pattern and then looked up in the manifest; the file name
 * always comes from the manifest, never from the request, so a value like
 * "../manifest" cannot reach the filesystem.
 */
export async function readStepImage(
  stepId: unknown,
): Promise<{ body: Buffer; contentType: string } | null> {
  if (typeof stepId !== "string" || stepId.length > 40 || !STEP_ID.test(stepId)) return null;
  const step = loadTourSteps().find((s) => s.id === stepId);
  if (!step) return null;
  const ext = step.image.slice(step.image.lastIndexOf(".") + 1);
  const contentType = IMAGE_TYPES[ext];
  if (!contentType) return null;
  const body = await readFile(join(TOUR_DIR, step.image));
  return { body, contentType };
}
