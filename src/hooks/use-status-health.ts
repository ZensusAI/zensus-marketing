import { useEffect, useState } from "react";
import type { SiteStatus } from "@/config/status";
import { startHealthMonitor } from "@/lib/status-health";

export interface LiveHealth {
  /** True once the health check has proven the service is up. */
  upgraded: boolean;
  /** When the last healthy check finished. */
  checkedAt: Date | null;
}

const isPrerender = () =>
  (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;

/**
 * Lets the static /status page upgrade itself to "operational" on proof.
 * Does nothing during the build prerender, for planned maintenance (which stays
 * authoritative) or when the static state is already operational.
 */
export function useStatusHealth(status: SiteStatus): LiveHealth {
  const [live, setLive] = useState<LiveHealth>({ upgraded: false, checkedAt: null });
  const enabled = status.state === "outage" || status.state === "degraded";

  useEffect(() => {
    if (!enabled || isPrerender()) return;
    return startHealthMonitor({
      url: status.healthUrl,
      doc: document,
      onHealthy: (at) => setLive((prev) => ({ ...prev, checkedAt: at })),
      onUpgrade: () => setLive((prev) => ({ ...prev, upgraded: true })),
    });
  }, [enabled, status.healthUrl]);

  return live;
}
