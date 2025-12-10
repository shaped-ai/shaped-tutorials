import { Movie } from "@/types/movie";
import { MovieSection } from "./MovieSection";
import { ErrorToast } from "./ErrorToast";
import { SHAPED_MODEL_NAME, SHAPED_API_ENDPOINTS } from "@/constants/shaped";
import { cookies } from "next/headers";
import { getInteractionsFromServerCookie } from "@/lib/interactions";

// MovieList Component
export const MovieList = async () => {
  // Get userId from cookies (server-side)
  const cookieStore = await cookies();
  const userId = cookieStore.get("movie_app_user_id")?.value || null;

  // Get interactions from cookies (server-side)
  const cookieHeader = cookieStore.toString();
  const interactions = getInteractionsFromServerCookie(cookieHeader);

  // Ensure all item_ids in interactions are strings
  const stringInteractions = interactions.map((interaction) => ({
    ...interaction,
    item_id: String(interaction.item_id),
  }));

  // API call with error handling to prevent hydration issues
  const token = process.env.SHAPED_API_KEY ?? "";

  let shapedApiError: string | null = null;
  let forYouMoviesFromShaped: Movie[] = []; // Initialized to avoid use-before-assign

  try {
    // get FOR_YOU movies
    const response = await fetch(SHAPED_API_ENDPOINTS.RANK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify({
        return_metadata: true,
        limit: 20,
        user_id: userId,
        interactions: stringInteractions,
        config: {
          filter_interaction_iids: true,
          exploration_factor: 0.2,
          retriever_k_override: {
            // random: 150
          },
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      shapedApiError = `Shaped API error (${response.status}): ${text}`;
    } else {
      const data = await response.json();
      console.log({ data });
      if (data.metadata && Array.isArray(data.metadata)) {
        forYouMoviesFromShaped = data.metadata;
      }
      console.log("Shaped API response:", data);
    }
  } catch (error) {
    console.error("Error fetching from Shaped API:", error);
    shapedApiError =
      error instanceof Error ? error.message : "Unknown Shaped API error";
  }

  let trendingMovies: Movie[] = []; // Initialized to avoid use-before-assign

  try {
    // get top10 movies
    const trendingRes = await fetch(SHAPED_API_ENDPOINTS.RANK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify({
        return_metadata: true,
        limit: 20,
        config: {
          // diversity_factor: 0,
        },
      }),
    });

    if (!trendingRes.ok) {
      const text = await trendingRes.text();
      shapedApiError = `Shaped API error (${trendingRes.status}): ${text}`;
    } else {
      const data = await trendingRes.json();
      if (data.metadata && Array.isArray(data.metadata)) {
        trendingMovies = data.metadata;
      }
      console.log("Shaped API response:", data);
    }
  } catch (error) {
    console.error("Error fetching from Shaped API:", error);
    shapedApiError =
      error instanceof Error ? error.message : "Unknown Shaped API error";
  }

  // Ensure consistent ordering for hydration
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  async function getRecommendationsForGenre(genre: string): Promise<Movie[]> {
    const genreList = [
      "Action",
      "Adventure",
      "Animation",
      "Childrens",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Fantasy",
      "Film_Noir",
      "Horror",
      "Musical",
      "Mystery",
      "Romance",
      "Sci-Fi",
      "Thriller",
      "War",
      "Western",
    ];

    if (!genreList.includes(genre)) {
      throw new Error(`Genre ${genre} not in dataset`);
    }

    try {
      const response = await fetch(SHAPED_API_ENDPOINTS.RANK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          return_metadata: true,
          filter_predicate: `array_has_any(genres, ['${genre}'])`,
          limit: 20,
          user_id: userId,
          interactions: stringInteractions,
        }),
      });

      if (!response.ok) {
        console.error(
          `Error fetching ${genre} movies:`,
          response.status,
          response.statusText
        );
        return [];
      }

      const data = await response.json();

      // Extract movies from the API response
      if (data.metadata && Array.isArray(data.metadata)) {
        return data.metadata;
      }

      return [];
    } catch (error) {
      console.error(`Error fetching ${genre} movies:`, error);
      return [];
    }
  }

  // Fetch genre recommendations for all genres
  const genreRecommendations = await Promise.allSettled(
    genres.map(async (genre) => ({
      genre,
      movies: await getRecommendationsForGenre(genre),
    }))
  );

  // Convert to a map for easy access
  const genreMoviesMap: Record<string, Movie[]> = {};
  genreRecommendations.forEach((result) => {
    if (result.status === "fulfilled") {
      genreMoviesMap[result.value.genre] = result.value.movies;
    }
  });

  return (
    <>
      {/** Error toast will trigger on the client via useEffect in ErrorToast */}
      {shapedApiError ? <ErrorToast message={shapedApiError} /> : null}

      {/* For You Section - Horizontal Scroll */}
      <MovieSection
        title="For You"
        movies={forYouMoviesFromShaped}
        infoTitle="About 'For You'"
        infoDescription="Personalized picks from our model, trained on a catalog of 9,000 movies and 100,000 user ratings (MovieLens dataset)."
        infoCode={`// Example request to Shaped model\nfetch('https://api.shaped.ai/v1/models/{model_name}/rank', {\n  method: 'POST',\n  headers: { \n    'Content-Type': 'application/json', \n    'x-api-key': process.env.SHAPED_API_KEY \n  },\n  body: JSON.stringify({ return_metadata: true })\n}).then(r => r.json())`}
      />

      <MovieSection
        title="Top 10 movies"
        movies={trendingMovies}
        infoTitle="About 'For You'"
        infoDescription="Personalized picks from our model, trained on a catalog of 9,000 movies and 100,000 user ratings (MovieLens dataset)."
        infoCode={`// Example request to Shaped model\nfetch('https://api.shaped.ai/v1/models/{model_name}/rank', {\n  method: 'POST',\n  headers: { \n    'Content-Type': 'application/json', \n    'x-api-key': process.env.SHAPED_API_KEY \n  },\n  body: JSON.stringify({ return_metadata: true })\n}).then(r => r.json())`}
      />

      {/* Genre Sections */}
      {genres.map((genre) => {
        const genreMovies = genreMoviesMap[genre] || [];
        if (genreMovies.length === 0) {
          console.log(`No movies found for genre: ${genre}`);
          return null;
        }

        return (
          <MovieSection
            key={genre}
            title={genre}
            movies={genreMovies}
            infoTitle={`${genre} movies`}
            infoDescription={`These are the top movies tagged with ${genre}. Our items data is a mix of genres, and we filter the top in a specific genre at request (inference) time.`}
            infoCode={`fetch('https://api.shaped.ai/v1/models/{model_name}/rank', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': process.env.SHAPED_API_KEY },\n  body: JSON.stringify({\n    return_metadata: true,\n    filter_predicate: 'array_has_any(genres, ['${genre.toLowerCase()}'])'\n  })\n}).then(r => r.json())`}
          />
        );
      })}
    </>
  );
};
