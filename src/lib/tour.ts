// Client side of the private product tour (/tour#t=<token>). The token is
// verified by api/tour-access.ts; this file only carries it around, and holds
// the player's step logic as plain functions so it is testable without a DOM.

export type Hotspot = { x: number; y: number; w: number; h: number };

export type TourStep = {
  id: string;
  title: string;
  caption: string;
  hotspot: Hotspot;
  width: number;
  height: number;
};

export type TourAccess = { name: string; expiresAt: string; steps: TourStep[] };

// Same key as scripts/tour-shell.mjs, whose inline script moves the token out
// of the address bar before any other script runs.
export const TOUR_TOKEN_KEY = "zensus-tour-token";

/** The token from a location.hash such as "#t=v1.abc.def", or null. */
export function tokenFromHash(hash: string): string | null {
  if (!hash.startsWith("#t=")) return null;
  const token = hash.slice(3);
  return token.length > 0 ? token : null;
}

function readSession(): string | null {
  try {
    return window.sessionStorage.getItem(TOUR_TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeSession(token: string): void {
  try {
    window.sessionStorage.setItem(TOUR_TOKEN_KEY, token);
  } catch {
    // Private mode or blocked storage: the tour still works until a reload.
  }
}

/**
 * Finds the link token and takes it out of the address bar so it is not left
 * in the history or a screenshot. Order: the URL fragment (dev server, or a
 * shell whose inline script did not run), the value the shell's inline script
 * stashed, then sessionStorage (a reload in the same tab).
 */
export function takeTourToken(): string | null {
  const fromHash = tokenFromHash(window.location.hash);
  if (fromHash) {
    writeSession(fromHash);
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search,
    );
    return fromHash;
  }
  const stashed = (window as unknown as { __zensusTourToken?: unknown }).__zensusTourToken;
  if (typeof stashed === "string" && stashed.length > 0) return stashed;
  return readSession();
}

export async function fetchTourAccess(token: string): Promise<TourAccess | null> {
  const res = await fetch("/api/tour-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ t: token }),
    cache: "no-store",
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as TourAccess;
  if (!data || typeof data.name !== "string" || !Array.isArray(data.steps) || data.steps.length === 0) {
    return null;
  }
  return data;
}

/** Fetches one screenshot with the token in a header and returns an object URL. */
export async function fetchStepImageUrl(token: string, stepId: string): Promise<string | null> {
  const res = await fetch(`/api/tour-image?s=${encodeURIComponent(stepId)}`, {
    headers: { "x-tour-token": token },
    cache: "no-store",
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (!res.ok) return null;
  return URL.createObjectURL(await res.blob());
}

// Player state: the index of the visible step, where index === steps.length
// is the end screen.
export type TourAction = "next" | "back" | "restart";

export function tourReducer(stepCount: number) {
  return (index: number, action: TourAction | { goto: number }): number => {
    if (typeof action === "object") return Math.min(Math.max(action.goto, 0), stepCount);
    switch (action) {
      case "next":
        return Math.min(index + 1, stepCount);
      case "back":
        return Math.max(index - 1, 0);
      case "restart":
        return 0;
      default:
        return index;
    }
  };
}

type KeyLike = { key: string; altKey?: boolean; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean };

const INTERACTIVE_TAGS = new Set(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]);

/**
 * Keyboard: right arrow and Enter advance, left arrow goes back. Enter on a
 * focused button or link is left to that control (its own click already
 * fires), so it never counts twice; modified keys belong to the browser.
 */
export function actionForKeyEvent(event: KeyLike, targetTag: string): TourAction | null {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return null;
  if (event.key === "ArrowRight") return "next";
  if (event.key === "ArrowLeft") return "back";
  if (event.key === "Enter" && !INTERACTIVE_TAGS.has(targetTag.toUpperCase())) return "next";
  return null;
}
