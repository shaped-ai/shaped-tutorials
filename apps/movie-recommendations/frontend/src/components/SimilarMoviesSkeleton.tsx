import { Skeleton } from "@/components/ui/skeleton";

interface SimilarMoviesSkeletonProps {
  width?: string;
}

export const SimilarMoviesSkeleton = ({ width = "800px" }: SimilarMoviesSkeletonProps) => {
  return (
    <section className="mb-12 border-2 border-dashed border-gray-300 rounded-lg p-4" style={{ width }}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-32 pl-3" />
        {/* No info icon skeleton since disableInfo is true */}
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4 pl-2 scrollbar-hide w-full">
          <div className="flex gap-4 w-max min-w-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-40 sm:w-48 flex-shrink-0">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
