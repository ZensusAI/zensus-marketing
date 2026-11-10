import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { TourPlayer } from "@/components/tour/TourPlayer";
import { fetchTourAccess, takeTourToken, type TourAccess } from "@/lib/tour";

// The private product tour. It is not public: no nav link, no sitemap or
// robots entry, no prerender, no Open Graph card (src/lib/private-routes.ts).
// It opens only from a signed per-person link, /tour#t=<token>, which the
// founder hands out; api/tour-access.ts verifies the token and returns the
// steps, and api/tour-image.ts serves each screenshot to the same token.

type State =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "ready"; token: string; access: TourAccess };

export const INVALID_MESSAGE =
  "This tour link has expired or isn't valid. Ask the person who sent it for a new one.";

export function TourInvalid() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Zensus product tour</h1>
        <p className="mt-3 text-base text-muted-foreground">{INVALID_MESSAGE}</p>
        {/* A full page load, not a router Link: the homepage then starts the
            site's normal analytics, which this page never loads. */}
        <a href="/" className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-4">
          Go to the Zensus homepage
        </a>
      </div>
    </main>
  );
}

const Tour = () => {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    const token = takeTourToken();
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    fetchTourAccess(token)
      .then((access) => {
        if (cancelled) return;
        setState(access ? { kind: "ready", token, access } : { kind: "invalid" });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "invalid" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Zensus product tour</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      {state.kind === "loading" && <div className="min-h-screen bg-background" aria-busy="true" />}
      {state.kind === "invalid" && <TourInvalid />}
      {state.kind === "ready" && (
        <div className="min-h-screen overflow-x-hidden bg-background">
          <TourPlayer token={state.token} access={state.access} />
        </div>
      )}
    </>
  );
};

export default Tour;
