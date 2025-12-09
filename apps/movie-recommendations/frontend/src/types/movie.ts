export interface Movie {
  item_id: string;
  title: string;
  release_date?: string | null;
  genres: string[];
  poster_url?: string[] | null;
  imdb_url: string;
  description?: string | null;
  interests?: string[] | null;
  cast?: string | null;
  directors?: string | null;
  writers?: string | null;
  _derived_chronological_rank: number;
  _derived_trending_rank: number;
  _derived_popular_rank: number;
  _derived_interaction_count: number;
}

export interface MovieCardProps {
  movie: Movie;
}
