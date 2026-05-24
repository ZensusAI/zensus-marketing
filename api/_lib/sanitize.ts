const MAX_LEN = 300;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\x00-\x09\x0b\x0c\x0e-\x1f]/; // control chars except LF (\x0a) and CR (\x0d)
const URL_RE = /https?:\/\/|www\./i;
const SCHEME_RE = /\b(?:javascript|data|vbscript):/i;
const MD_LINK_RE = /\[[^\]]*\]\([^)]*\)/;
const ANGLE_RE = /[<>]/;
const MANY_NEWLINES_RE = /\n{3,}/;

/** Returns a safe intro string, or null when the AI output must be rejected. */
export function sanitizeIntro(raw: string): string | null {
  const s = raw.trim();
  if (s === "" || s.length > MAX_LEN) return null;
  if (CONTROL_RE.test(s)) return null;
  if (MANY_NEWLINES_RE.test(s)) return null;
  if (URL_RE.test(s)) return null;
  if (SCHEME_RE.test(s)) return null;
  if (MD_LINK_RE.test(s)) return null;
  if (ANGLE_RE.test(s)) return null;
  return s;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
