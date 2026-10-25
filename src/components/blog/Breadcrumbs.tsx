import { Link } from "react-router-dom";
import type { Crumb } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { FOCUS_RING } from "./PostCard";

/**
 * The visible breadcrumb trail. Pages pass the same list they hand to
 * breadcrumbSchema(), so what readers see and what the BreadcrumbList says
 * are one thing. The last step is the current page: marked, not linked.
 */
export function Breadcrumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] text-muted-foreground">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.url} className="flex items-center gap-x-1.5">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {last ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.url.slice(SITE_URL.length) || "/"}
                  className={cn("rounded-sm transition-colors hover:text-foreground", FOCUS_RING)}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
