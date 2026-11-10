import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { actionForKeyEvent, fetchStepImageUrl, tourReducer, type TourAccess } from "@/lib/tour";
import { TourPlayerView, type ImageState } from "./TourPlayerView";

/**
 * Stateful shell around TourPlayerView: holds the step index, listens to the
 * keyboard, and fetches every screenshot once (token in a header, shown via
 * object URLs that are revoked on unmount).
 */
export function TourPlayer({ token, access }: { token: string; access: TourAccess }) {
  const { steps, name } = access;
  const reducer = useMemo(() => tourReducer(steps.length), [steps.length]);
  const [index, dispatch] = useReducer(reducer, 0);
  const [images, setImages] = useState<Record<string, ImageState>>(() =>
    Object.fromEntries(steps.map((s) => [s.id, { status: "loading" } as ImageState])),
  );

  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];
    for (const step of steps) {
      fetchStepImageUrl(token, step.id)
        .then((url) => {
          if (url) created.push(url);
          if (cancelled) {
            if (url) URL.revokeObjectURL(url);
            return;
          }
          setImages((prev) => ({
            ...prev,
            [step.id]: url ? { status: "ready", url } : { status: "error" },
          }));
        })
        .catch(() => {
          if (!cancelled) setImages((prev) => ({ ...prev, [step.id]: { status: "error" } }));
        });
    }
    return () => {
      cancelled = true;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [token, steps]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const action = actionForKeyEvent(event, target?.tagName ?? "");
      if (!action) return;
      event.preventDefault();
      dispatch(action);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onAction = useCallback((action: Parameters<typeof dispatch>[0]) => dispatch(action), []);

  return <TourPlayerView name={name} steps={steps} index={index} images={images} onAction={onAction} />;
}
