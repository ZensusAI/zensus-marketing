import { useEffect } from "react";
import { toast } from "sonner";

const GIS_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface CredentialResponse {
  credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("GIS load failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("GIS load failed"));
    document.head.appendChild(script);
  });
}

/**
 * Google One Tap sign-in (ZEN-365). Mounts once on the homepage. When the
 * visitor has a Google session and is not already signed into Zensus, Google
 * shows a top-right One Tap prompt; one tap signs them in via Supabase
 * (signInWithIdToken) and hands off to the app. Renders nothing.
 *
 * Self-gates on: build-time config present, no existing Supabase session, and
 * a successfully loaded GIS script. Google's own frequency-capping handles
 * dismissals and repeat visits. The SignupModal's buttons remain the universal
 * fallback (Safari/webviews where One Tap will not render, Google backoff after
 * sign-out, etc.), so failures here are silent by design.
 */
export function GoogleOneTap() {
  useEffect(() => {
    // Cheap gate first: GOOGLE_CLIENT_ID is the One Tap feature flag, inlined at
    // build time, so an unconfigured deploy never pays the Supabase chunk.
    if (!GOOGLE_CLIENT_ID) return;

    // StrictMode-safe via the `cancelled` flag: if this effect is double-
    // invoked (mount, cleanup, mount), the first run's cleanup sets cancelled
    // and its async start() aborts at the next check; the second run completes.
    // An "initialized" latch would instead leave One Tap permanently aborted.
    let cancelled = false;

    async function start() {
      // Lazy-load Supabase (~100KB) + the nonce helpers so they stay out of the
      // eager homepage bundle; One Tap is a post-load interaction, so fetching
      // the SDK only when this effect runs costs nothing on first paint.
      const [{ supabase, isSupabaseConfigured }, { generateNonce, buildHandoffUrl }] =
        await Promise.all([
          import("@/lib/supabase"),
          import("@/lib/google-one-tap"),
        ]);
      if (cancelled || !isSupabaseConfigured || !supabase) return;
      const client = supabase;

      // Skip entirely if the visitor already has a session.
      const { data } = await client.auth.getSession();
      if (cancelled || data.session) return;

      try {
        await loadGisScript();
      } catch {
        return; // GIS blocked or failed to load: buttons are the fallback.
      }
      if (cancelled || !window.google?.accounts?.id) return;

      const { nonce, hashedNonce } = await generateNonce();
      if (cancelled) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
        auto_select: false,
        callback: async (response: CredentialResponse) => {
          if (!response.credential) return;
          const { error } = await client.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
            nonce,
          });
          if (error) {
            toast.error(
              "Google sign-in did not complete. Please use the buttons to continue.",
            );
            return;
          }
          window.location.href = buildHandoffUrl("/subscribe");
        },
      });
      window.google.accounts.id.prompt();
    }

    void start();

    return () => {
      cancelled = true;
      window.google?.accounts?.id?.cancel();
    };
  }, []);

  return null;
}

export default GoogleOneTap;
