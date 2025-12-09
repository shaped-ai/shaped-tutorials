"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SimilarMoviesSection } from "./SimilarMoviesSection";
import { useDialog } from "@/contexts/DialogContext";
import Image from "next/image";

export const MovieDialog = () => {
  const { isDialogOpen, currentMovie, closeDialog } = useDialog();

  if (!currentMovie) return null;

  const genreList = currentMovie.genres?.[0].split(",");

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-[900px] max-h-[90vh] overflow-y-auto h-full sm:h-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4 justify-center items-start min-w-0">
          <div className="flex flex-row">
            <div className="flex flex-col min-w-0">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold mb-4 break-words min-w-0">
                  {currentMovie.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 min-w-0">
                {currentMovie?.description && (
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground min-w-0 break-words">
                      {currentMovie.description.length > 300
                        ? `${currentMovie.description.slice(0, 300)}...`
                        : currentMovie.description}
                    </p>
                  </div>
                )}
                {currentMovie.release_date && (
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg mb-2">Release Date</h3>
                    <p className="text-muted-foreground min-w-0 break-words">
                      {currentMovie.release_date}
                    </p>
                  </div>
                )}
                {currentMovie.directors && (
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg mb-2">Directors</h3>
                    <div className="text-muted-foreground flex flex-wrap gap-2 min-w-0">
                      {currentMovie.directors.split(",").join(", ")}
                    </div>
                  </div>
                )}
                {currentMovie.writers && (
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg mb-2">Writers</h3>
                    <div className="text-muted-foreground flex flex-wrap gap-2 min-w-0">
                      {currentMovie.writers.split(",").join(", ")}
                    </div>
                  </div>
                )}
                {currentMovie?.cast && (
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg mb-2">Cast</h3>
                    <div className="text-muted-foreground flex flex-wrap gap-2 min-w-0">
                      {currentMovie?.cast.length > 3
                        ? currentMovie?.cast.split(",").slice(0, 3).join(", ") +
                          " and others"
                        : currentMovie?.cast.split(",").join(", ")}
                    </div>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2 min-w-0">
                    {genreList?.map((g, index) => (
                      <Badge key={index} variant="secondary" className="shrink text-muted-foreground">
                        {g.trim().charAt(0).toUpperCase() + g.trim().slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div id="poster" className="hidden sm:flex justify-center sm:justify-start">
              {currentMovie.poster_url && currentMovie.poster_url.length > 0 ? (
                <Image
                  src={currentMovie.poster_url[0]}
                  alt={`${currentMovie.title} poster`}
                  width={192}
                  height={288}
                  className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs sm:text-sm">No poster available</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center min-w-0">
          <SimilarMoviesSection item_id={currentMovie.item_id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
