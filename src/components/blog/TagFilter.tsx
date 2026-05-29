import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  tagCounts?: Record<string, number>;
}

export function TagFilter({ tags, selectedTag, tagCounts }: TagFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTagClick = (tag: string) => {
    const next = new URLSearchParams(searchParams);
    if (tag === "All") {
      next.delete("tag");
    } else {
      next.set("tag", tag);
    }
    setSearchParams(next, { replace: false });
  };

  return (
    <>
      {/* Desktop chips */}
      <div className="hidden flex-wrap gap-2 md:flex">
        {tags.map((tag) => {
          const active = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              aria-pressed={active}
              className={cn(
                "flex h-8 cursor-pointer items-center rounded-lg border px-3 text-sm transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              <span>{tag}</span>
              {tagCounts?.[tag] ? (
                <span
                  className={cn(
                    "ml-2 flex h-6 min-w-6 items-center justify-center rounded-md border text-xs font-medium",
                    active
                      ? "border-primary-foreground/40 bg-background text-primary"
                      : "border-border",
                  )}
                >
                  {tagCounts[tag]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Mobile drawer */}
      <Drawer>
        <DrawerTrigger
          className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted md:hidden"
          aria-label="Filter posts by tag"
        >
          <span className="capitalize">{selectedTag}</span>
          <ChevronDown className="h-4 w-4" aria-hidden />
        </DrawerTrigger>
        <DrawerContent className="md:hidden">
          <DrawerHeader>
            <DrawerTitle className="text-sm font-semibold">
              Select category
            </DrawerTitle>
          </DrawerHeader>
          <div className="space-y-2 px-4 pb-6">
            {tags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="flex w-full items-center justify-between text-sm font-medium transition-colors"
                >
                  <span
                    className={cn(
                      "transition-colors",
                      active
                        ? "text-primary underline underline-offset-4"
                        : "text-muted-foreground",
                    )}
                  >
                    {tag}
                  </span>
                  {tagCounts?.[tag] ? (
                    <span className="ml-2 flex h-6 min-w-6 items-center justify-center rounded-md border border-border text-xs">
                      {tagCounts[tag]}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
