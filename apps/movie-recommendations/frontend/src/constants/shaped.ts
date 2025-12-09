/**
 * Shaped API configuration constants
 */

// Model name used in all Shaped API calls
// export const SHAPED_MODEL_NAME = 'movie_recommendations_2018';
export const SHAPED_MODEL_NAME = 'movie_recommendations_with_imdb_v3';

export const SHAPED_EVENTS_DATASET_NAME = 'ratings_2018';

// Base URL for Shaped API
export const SHAPED_API_BASE_URL = 'https://api.shaped.ai/v1';

// API endpoints
export const SHAPED_API_ENDPOINTS = {
  RANK: `${SHAPED_API_BASE_URL}/models/${SHAPED_MODEL_NAME}/rank`,
  RETRIEVE: `${SHAPED_API_BASE_URL}/models/${SHAPED_MODEL_NAME}/retrieve`,
  SIMILAR_ITEMS: `${SHAPED_API_BASE_URL}/models/${SHAPED_MODEL_NAME}/similar_items`,
  EVENTS: `${SHAPED_API_BASE_URL}/datasets/${SHAPED_EVENTS_DATASET_NAME}/insert`,
} as const;