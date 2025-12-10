import { Suspense } from "react";
import { FloatingButtons } from "@/components/FloatingButtons";
import { MovieList } from "@/components/MovieList";
import { Header } from "@/components/Header";
import { MovieListSkeleton } from "@/components/MovieListSkeleton";
import { SearchDialog } from "@/components/SearchDialog";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <div className="w-full px-[100px] py-[100px]">
        <Header />
        <SearchDialog />
        <Suspense fallback={<MovieListSkeleton />}>
          <MovieList />
        </Suspense>
      </div>
      <FloatingButtons />
    </div>
  );
}
