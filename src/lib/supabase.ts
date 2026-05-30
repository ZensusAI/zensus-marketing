import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True when the Supabase env vars were present at build time. Vite inlines
 * import.meta.env.VITE_* at build, so this value is fixed per deployment. When
 * false, `supabase` is null and Google One Tap (ZEN-365) renders nothing.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Cross-subdomain cookie domain for the auth cookies the browser client writes.
 * Returns ".zensus.app" on production hosts so the SDK auth cookies set by
 * signInWithIdToken are readable by app.zensus.app; undefined (host-only) on
 * localhost and preview hosts. Mirrors the landing app's getCookieDomain
 * (ZEN-49: a Domain=.zensus.app cookie on a non-zensus.app host is silently
 * dropped by the browser).
 */
export function cookieDomainForHost(hostname: string): string | undefined {
  if (hostname === "zensus.app" || hostname.endsWith(".zensus.app")) {
    return ".zensus.app";
  }
  return undefined;
}

/**
 * Construct the browser client, or null when unconfigured. Guard BEFORE
 * constructing (never construct-then-null): module-level code runs during the
 * Puppeteer prerender, and a throw here would break the prerendered routes.
 */
function createClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  const isBrowser = typeof window !== "undefined";
  const domain = isBrowser
    ? cookieDomainForHost(window.location.hostname)
    : undefined;
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      domain,
      path: "/",
      sameSite: "lax",
      secure: isBrowser && window.location.protocol === "https:",
    },
  });
}

/** Browser Supabase client, or null when unconfigured. */
export const supabase = createClient();
