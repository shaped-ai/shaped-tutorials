import { Movie } from "@/types/movie"
import { MovieSection } from "./MovieSection"
import { SimilarMoviesSkeleton } from "./SimilarMoviesSkeleton"

import { useEffect, useState } from "react";

export const SimilarMoviesSection = ({ item_id }: { item_id: string | number }) => {
    const [similarItems, setSimilarItems] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilarItems = async () => {
            setLoading(true); // Set loading to true immediately when item_id changes
            try {
                const res = await fetch("/api/similar_items", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ item_id }),
                });
                
                if (!res.ok) {
                    console.error(`Similar items API error: ${res.status} ${res.statusText}`);
                    setSimilarItems([]);
                    return;
                }
                
                const response = await res.json();
                console.log("Similar items response:", response);
                
                // Handle the response structure: { ok: true, data: { metadata: Movie[] } }
                if (response.ok && response.data) {
                    const movies = response.data.metadata || [];
                    console.log("Extracted movies:", movies);
                    setSimilarItems(Array.isArray(movies) ? movies : []);
                } else {
                    console.error("Invalid response structure:", response);
                    setSimilarItems([]);
                }
            } catch (error) {
                console.error("Error fetching similar items:", error);
                setSimilarItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSimilarItems();
    }, [item_id]);

    if (loading) {
        return <SimilarMoviesSkeleton width="100%" />;
    }

    // Show message if no similar items found
    if (similarItems.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground min-w-0">
                <p className="min-w-0">No similar movies found for this item.</p>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0">
            <MovieSection 
                title="People also liked"
                movies={similarItems}
                infoTitle="Similar items"
                infoDescription="You can ask the trained model for the most similar items from your catalog."
                infoCode={`fetch("https://api.shaped.ai/v1/models/{model_name}/similar_items", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "x-api-key": process.env.SHAPED_API_KEY ?? "",\n  },\n  body: JSON.stringify({\n    item_id: String(payload.item_id),\n    return_metadata: true,\n  }),\n});`}
                width="100%"
            />
        </div>
    );
}