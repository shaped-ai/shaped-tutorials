"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import { useUserId } from "@/hooks/useUserId";
import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = useUserId();

  const searchMovies = async (query: string) => {
    if (!query.trim() || !userId) {
      setMovies([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_metadata: "true",
          explain: true,
          // user_id: userId,
          // limit: 10,
          text_query: query,
          "config": {
            "exploration_factor": 0,
            "diversity_factor": 0,
            diversity_attributes: [],
            "limit": 50
        }
        }),
      });

      const data = await response.json();
      
      if (data.ok && data.data?.metadata) {
        // Transform metadata to Movie type
        const transformedMovies: Movie[] = data.data.metadata.map((item: any) => ({
          item_id: item.item_id,
          title: item.title,
          release_date: item.release_date || null,
          genres: Array.isArray(item.genres) ? item.genres : [item.genres || ""],
          poster_url: Array.isArray(item.poster_url) ? item.poster_url : [item.poster_url || ""],
          imdb_url: item.imdb_url || "",
          description: item.description || null,
          interests: item.interests || null,
          cast: item.cast || null,
          directors: item.directors || null,
          writers: item.writers || null,
          _derived_chronological_rank: item._derived_chronological_rank || 0,
          _derived_trending_rank: item._derived_trending_rank || 0,
          _derived_popular_rank: item._derived_popular_rank || 0,
          _derived_interaction_count: item._derived_interaction_count || 0,
        }));
        setMovies(transformedMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Create debounced search function
  const debouncedSearch = useMemo(
    () => debounce(searchMovies, 1000),
    [userId]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Trigger search when input changes
  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="max-w-[720px] mb-8">
          <Search className="mr-2 h-4 w-4" />
          Search for your favourite movie
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[95vw] !max-w-[95vw] sm:!max-w-4xl lg:!max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Movies</DialogTitle>
          <DialogDescription>
            Search for movies using natural language queries. Try searching for genres, actors, or themes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 w-full min-w-0">
          <Input
            placeholder="Search for movies (eg 'Tina Fey films', 'Japanese horror', 'fantasy')"
            value={searchInput}
            onChange={handleInputChange}
            className="w-full"
          />
          
          {loading && (
            <div className="text-center py-4">
              <div className="text-muted-foreground">Searching...</div>
            </div>
          )}
          
          {!loading && searchInput.trim() && movies.length === 0 && (
            <div className="text-center py-4">
              <div className="text-muted-foreground">No movies found for &quot;{searchInput}&quot;</div>
            </div>
          )}
          
          {!loading && movies.length > 0 && (
            <div className="w-full overflow-hidden min-w-0">
              <div className="mb-12 border-2 border-dashed border-gray-300 rounded-lg p-4 w-full min-w-0">
                <div className="flex items-center justify-between mb-4 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-primary pl-3 truncate">Search Results for &quot;{searchInput}&quot;</h2>
                </div>
                <div className="relative w-full">
                  <div className="overflow-x-auto pb-4 pl-2 scrollbar-hide w-full">
                    <div className="flex gap-4 w-max min-w-0">
                      {movies.map((movie) => (
                        <div key={movie.item_id} className="w-40 sm:w-48 flex-shrink-0">
                          <MovieCard movie={movie} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
