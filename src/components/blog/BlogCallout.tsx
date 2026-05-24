import type { ReactNode } from "react";

interface BlogCalloutProps {
  title?: string;
  children: ReactNode;
}

export function BlogCallout({ title, children }: BlogCalloutProps) {
  return (
    <aside className="not-prose mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
      {title ? (
        <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      ) : null}
      <div className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        {children}
      </div>
    </aside>
  );
}
