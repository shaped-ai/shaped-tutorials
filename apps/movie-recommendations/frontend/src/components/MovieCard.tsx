"use client";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MovieCardProps } from "@/types/movie";
import { useUserId } from "@/hooks/useUserId";
import { useInteractions } from "@/hooks/useInteractions";
import { useDialog } from "@/contexts/DialogContext";

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { openDialog } = useDialog();
  const userId = useUserId();
  const { addInteraction } = useInteractions();
  const genreList = movie.genres?.[0].split(',')

  const handleCardClick = () => {
    openDialog(movie);
    console.log({movie})
    
    // Add interaction to the tracking array
    addInteraction(movie.item_id);
    
    trackClick();
  };

  const trackClick = () => {
    const payload = {
      event_value: "click",
      movieId: movie.item_id,
      timestamp: Math.floor(Date.now() / 1000),
      userId: userId || "anonymous"
    };

    try {
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  };

  return (
    <button type="button" onClick={handleCardClick} className="text-left w-full">
      <div 
        className="aspect-[2/3] relative overflow-hidden bg-gray-400 group rounded-lg hover:shadow-lg transition-shadow"
        style={{
          backgroundImage: movie.poster_url && movie.poster_url.length > 0 ? `url(${movie.poster_url[0]})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Gradient overlay for text readability - only on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Text content positioned at bottom - only on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 min-w-0">
          <CardTitle className="text-xs sm:text-sm line-clamp-1 text-gray-200 font-bold mb-1 min-w-0">
            {movie.title}
          </CardTitle>
          <CardDescription className="text-[10px] sm:text-xs text-gray-300 mb-2 min-w-0">
            {movie.release_date || 'N/A'}
          </CardDescription>
          <div className="flex flex-wrap gap-1 min-w-0">
            {genreList.map((g, index) => (
              <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs text-gray-200 bg-gray-800/90 hover:bg-gray-800 border-gray-600 shrink">
                {g.trim().charAt(0).toUpperCase() + g.trim().slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};
