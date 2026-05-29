import { Link } from "react-router-dom";
import type { Author } from "@/lib/authors";
import { cn } from "@/lib/utils";

interface AuthorCardProps {
  author: Author;
  className?: string;
}

export function AuthorCard({ author, className }: AuthorCardProps) {
  const inner = (
    <div className={cn("flex items-start gap-3", className)}>
      <img
        src={author.avatar}
        alt={author.name}
        className="h-10 w-10 rounded-full border border-border object-cover"
        loading="lazy"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {author.name}
        </p>
        <p className="text-xs text-muted-foreground">{author.position}</p>
        {author.bio ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {author.bio}
          </p>
        ) : null}
      </div>
    </div>
  );
  if (author.url) {
    return (
      <Link
        to={author.url}
        className="group block rounded-lg transition-colors hover:bg-muted/40"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
