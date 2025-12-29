import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="section-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-14 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-14 w-2/3 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-3" />
            <Skeleton className="h-6 w-4/5 mx-auto mb-10" />
            <Skeleton className="h-12 w-40 mx-auto rounded-md" />
          </div>
        </div>
      </section>

      {/* Content Skeletons */}
      <section className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </section>
    </div>
  );
};

export default PageSkeleton;