import { Skeleton } from "@/components/ui/skeleton";

export const MovieListSkeleton = () => {
  return (
    <>
      {/* For You Section Skeleton */}
      <section className="mb-12 border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-20 pl-3" />
          <Skeleton className="h-5 w-5" />
        </div>
        <div className="relative">
          <div className="overflow-x-auto pb-4 pl-2 scrollbar-hide w-full">
            <div className="flex gap-4 w-max min-w-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-32 sm:w-40 lg:w-48 flex-shrink-0">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genre Sections Skeleton */}
      {Array.from({ length: 8 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="mb-12 border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-24 pl-3" />
            <Skeleton className="h-5 w-5" />
          </div>
          <div className="relative">
            <div className="overflow-x-auto pb-4 pl-2 scrollbar-hide w-full">
              <div className="flex gap-4 w-max min-w-0">
                {Array.from({ length: 6 }).map((_, cardIndex) => (
                  <div key={cardIndex} className="w-32 sm:w-40 lg:w-48 flex-shrink-0">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};
