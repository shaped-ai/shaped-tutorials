import pandas as pd
import re
import json

OUTPUT_FILE_NAME='model/data/movies_movieslens32m.jsonl'

# output: movie_id, movie_title, release_date, poster_url, imdb_url_new, genres

movies = pd.read_csv('model/data/ml-latest-small/movies.csv', sep=",", header=0, nrows=None)
links = pd.read_csv('model/data/ml-latest-small/links.csv', sep=",", header=0, nrows=None)
posters = pd.read_csv('model/data/processed/movie_posters_scraped.csv', sep=",", header=0, nrows=None)

df = movies.copy()
df = df.merge(links, on='movieId', how='left')
df = df.merge(posters, on='movieId', how='left', suffixes=('', '_posters'))
if 'title_posters' in df.columns:
    df = df.drop('title_posters', axis=1)
df = df.rename(columns={"title": "movie_title", "movieId": "movie_id", "posterURL": "all_poster_urls"})
df['imdb_url_new'] = df['imdbId'].apply(lambda x: f'https://www.imdb.com/title/tt{int(x):07d}' if pd.notna(x) else None)

def extract_poster_url(row):
    """Extract poster URL from JSON with fallback logic."""
    try:
        if pd.isna(row['all_poster_urls']):
            print(f"Missing poster data for movie_id: {row['movie_id']}")
            return None
        
        poster_data = json.loads(row['all_poster_urls'])
        
        # Try key "380" first
        poster_url = poster_data.get('380')
        if poster_url and poster_url.strip():
            return poster_url
        
        # Fallback to "src"
        poster_url = poster_data.get('src')
        if poster_url and poster_url.strip():
            return poster_url
        
        # Both are null/empty
        print(f"No valid poster URL for movie_id: {row['movie_id']}")
        return None
    except (json.JSONDecodeError, TypeError) as e:
        print(f"Error parsing poster data for movie_id: {row['movie_id']} - {e}")
        return None

df['poster_url'] = df.apply(extract_poster_url, axis=1)
# num_missing_posters = df['poster_url'].isna().sum() + (df['poster_url'] == '').sum()
# print(f"Number of items with blank or null poster_url: {num_missing_posters}")


# Convert genres from pipe-separated to comma-separated values
if 'genres' in df.columns:
    df['genres'] = df['genres'].str.replace("|", ",")

def reformat_trailing_the(title: str) -> str:
    """Move trailing ", The" to the front, preserving any parentheses suffixes.

    Examples:
    - "Forbidden Christ, The (Cristo proibito, Il) (1993)" ->
      "The Forbidden Christ (Cristo proibito, Il) (1993)"
    - "Usual Suspects, The" -> "The Usual Suspects"
    - "Usual Suspects, The (1993)" -> "The Usual Suspects (1993)"
    """
    if not isinstance(title, str) or not title:
        return title

    # Capture the base title, then a literal ", The", then any number of parenthetical suffixes
    match = re.match(r"^(?P<base>.*?),\s*The(?P<suffix>(?:\s*\([^)]*\))*)$", title)
    if not match:
        return title

    base_title = match.group("base").strip()
    suffix = match.group("suffix") or ""
    return f"The {base_title}{suffix}"

# Apply reformatting to the movie_title column if present
if 'movie_title' in df.columns:
    df['movie_title'] = df['movie_title'].apply(reformat_trailing_the)

with pd.option_context('display.max_columns', None):
    print(df.head(5))

df.to_json(OUTPUT_FILE_NAME, orient='records', lines=True)
df.to_json("data.json", orient='records')

