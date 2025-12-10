"""
IMDb Movie Metadata Enrichment Script

This script enriches movie data from the MovieLens dataset by fetching comprehensive
metadata from the IMDb API via RapidAPI. It processes movies from a JSONL file and
adds detailed information including descriptions, cast, directors, writers, release
dates, and other metadata.

The script uses the IMDb236 API to fetch enriched data for each movie using its
IMDb ID, then merges this data back into the original movie records. It includes
robust error handling, rate limiting, and incremental saving to handle large
datasets efficiently.

Features:
- Batch processing with incremental saves every 20 movies
- Rate limiting to respect API limits (120 requests/minute)
- Automatic retry on rate limit errors with 60-second delay
- Resume capability from existing output files
- Comprehensive error handling for HTTP errors and API failures
- Progress tracking and detailed logging

Requirements:
- RapidAPI key stored in .env.local file as RAPIDAPI_KEY
- Input JSONL file with movies containing imdbId field
"""

import requests
import json
import time
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import os

# Load from project root
env_path = os.path.join(os.path.dirname(__file__), '../../.env.local') # NOTE: create .env.local file and add your API key
load_dotenv(env_path)

# API configuration
API_URL = "https://imdb236.p.rapidapi.com/api/imdb"

# Input and outputs
INPUT_FILE_PATH='../data/processed/movies_updated_2008.jsonl'
OUTPUT_FILE_PATH='../data/processed/movies_2018_enriched.jsonl'

def make_get_request_imdb(
    url: str,
    auth_key: str,
    headers: Optional[Dict[str, str]] = None,
    params: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Make a GET request to a generic API URL with authorization key in header.
    
    Args:
        url (str): The API endpoint URL
        auth_key (str): The authorization key/token
        headers (Optional[Dict[str, str]]): Additional headers to include
        params (Optional[Dict[str, Any]]): Query parameters for the request
    
    Returns:
        Dict[str, Any]: JSON response from the API
    
    Raises:
        requests.exceptions.RequestException: If the request fails
        ValueError: If the response is not valid JSON
    """
    # Prepare headers with authorization
    request_headers = {
        'x-rapidapi-key': f'{auth_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Add any additional headers if provided
    if headers:
        request_headers.update(headers)
    
    try:
        # Make the GET request
        response = requests.get(
            url=url,
            headers=request_headers,
            params=params,
            timeout=30  # 30 second timeout
        )
        
        # Raise an exception for bad status codes
        response.raise_for_status()
        
        # Parse JSON response
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        raise
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON response: {e}")
        raise ValueError(f"Invalid JSON response: {e}")

def load_movies(filepath: str) -> list[Dict[str, Any]]:
    """Load movies from JSONL file."""
    movies = []
    with open(filepath, 'r') as f:
        for line in f:
            movies.append(json.loads(line))
    return movies

def get_imdb_enrichments(imdb_id: int, auth_key: str) -> Optional[Dict[str, Any]]:
    """
    Fetch enriched movie data from IMDB API.
    
    Args:
        imdb_id: Numeric IMDB ID (e.g., 114709)
        auth_key: RapidAPI authentication key
        
    Returns:
        Dictionary with enriched data or None if request fails
    """
    try:
        # Convert numeric ID to tt format
        # This converts the numeric IMDB id to a string that starts with 'tt'
        # and is zero-padded to 7 digits, e.g. 114709 -> 'tt0114709'
        movie_id = f'tt{imdb_id:07d}'
        
        result = make_get_request_imdb(
            url=f"{API_URL}/{movie_id}",
            auth_key=auth_key
        )
        
        # Extract and process data
        directors = result.get("directors", [])
        directors_string = ','.join([d.get('fullName', '') for d in directors])
        writers = result.get("writers", [])
        writers_string = ','.join([x.get('fullName', '') for x in writers])
        cast = result.get("cast", [])
        cast_string = ','.join([x.get('fullName', '') for x in cast])
        
        return {
            "description": result.get("description"),
            "interests": result.get("interests"),
            "release_date": result.get("releaseDate"),
            "directors": directors_string,
            "cast": cast_string,
            "writers": writers_string,
        }
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            print(f"Rate limit hit for movie {imdb_id}. Waiting 60 seconds before retry...")
            time.sleep(60)
            # Retry once after waiting
            try:
                result = make_get_request_imdb(
                    url=f"{API_URL}/{movie_id}",
                    auth_key=auth_key
                )
                
                # Extract and process data
                directors = result.get("directors", [])
                directors_string = ','.join([d.get('fullName', '') for d in directors])
                writers = result.get("writers", [])
                writers_string = ','.join([x.get('fullName', '') for x in writers])
                cast = result.get("cast", [])
                cast_string = ','.join([x.get('fullName', '') for x in cast])
                
                return {
                    "description": result.get("description"),
                    "interests": result.get("interests"),
                    "release_date": result.get("releaseDate"),
                    "directors": directors_string,
                    "cast": cast_string,
                    "writers": writers_string,
                }
            except Exception as retry_e:
                print(f"Retry failed for movie {imdb_id}: {retry_e}")
                return None
        else:
            print(f"HTTP error enriching movie {imdb_id}: {e}")
            return None
    except Exception as e:
        print(f"Error enriching movie {imdb_id}: {e}")
        return None

def save_movies_to_jsonl(movies: list[Dict[str, Any]], filepath: str) -> None:
    """Save movies to JSONL file."""
    with open(filepath, 'w') as f:
        for movie in movies:
            f.write(json.dumps(movie) + '\n')

def needs_enrichment(movie: Dict[str, Any]) -> bool:
    """Check if movie is missing enriched fields."""
    enriched_fields = ['description', 'interests', 'release_date', 'directors', 'cast', 'writers']
    
    # Count how many fields have meaningful data
    meaningful_fields = 0
    
    for field in enriched_fields:
        if field not in movie:
            continue
        value = movie[field]
        if value is None:
            continue
        # Check for empty strings
        if isinstance(value, str) and value.strip() == "":
            continue
        # Check for empty arrays
        if isinstance(value, list) and len(value) == 0:
            continue
        
        # If we get here, the field has meaningful data
        meaningful_fields += 1
    
    # Consider a movie enriched if it has at least 3 meaningful fields
    # This allows for partial enrichment while ensuring some data is present
    return meaningful_fields < 3

def process_movies_batch(
    input_file: str, 
    output_file: str, 
    auth_key: str,
    save_interval: int = 20,
    rate_limit_delay: float = 0.5
) -> None:
    """
    Process movies in batches with incremental saves and rate limiting.
    
    Args:
        input_file: Path to input CSV or JSONL file
        output_file: Path to output JSONL file
        auth_key: RapidAPI authentication key
        save_interval: Save after processing this many movies
        rate_limit_delay: Seconds to wait between API calls (default 0.5 for 120/min limit)
    """
    # Load existing output if it exists, otherwise load input
    if os.path.exists(output_file):
        print(f"Resuming from existing output file: {output_file}")
        movies = load_movies(output_file)
    else:
        print(f"Starting fresh from input file: {input_file}")
        movies = load_movies(input_file)
    
    total_movies = len(movies)
    movies_to_process = [i for i, m in enumerate(movies) if needs_enrichment(m)]
    
    print(f"Total movies: {total_movies}")
    print(f"Movies needing enrichment: {len(movies_to_process)}")
    
    processed_count = 0
    
    for idx in movies_to_process:
        movie = movies[idx]
        imdb_id = movie.get('imdbId')
        
        if not imdb_id:
            print(f"Skipping movie {movie.get('movie_title')} - no IMDB ID")
            continue
        
        print(f"Processing [{processed_count + 1}/{len(movies_to_process)}]: {movie.get('movie_title')}")
        
        enriched_data = get_imdb_enrichments(imdb_id, auth_key)
        
        if enriched_data:
            # Merge enriched data into movie
            movies[idx].update(enriched_data)
        
        processed_count += 1
        
        # Save every save_interval movies
        if processed_count % save_interval == 0:
            save_movies_to_jsonl(movies, output_file)
            print(f"Saved progress: {processed_count}/{len(movies_to_process)} movies processed")
        
        # Rate limiting
        time.sleep(rate_limit_delay)
    
    # Final save
    save_movies_to_jsonl(movies, output_file)
    print(f"Complete! Processed {processed_count} movies. Output saved to {output_file}")

# Example usage
if __name__ == "__main__":
    AUTH_KEY = os.getenv("RAPIDAPI_KEY")
    
    if not AUTH_KEY:
        raise ValueError("RAPIDAPI_KEY environment variable is not set")
    
    # File paths
    input_file = os.path.join(os.path.dirname(__file__), INPUT_FILE_PATH)
    output_file = os.path.join(os.path.dirname(__file__), OUTPUT_FILE_PATH)
    
    # Process all movies with enrichment
    process_movies_batch(
        input_file=input_file,
        output_file=output_file,
        auth_key=AUTH_KEY,
        save_interval=20,
        rate_limit_delay=0  # 120 requests/min = 0.5s between calls
    )
