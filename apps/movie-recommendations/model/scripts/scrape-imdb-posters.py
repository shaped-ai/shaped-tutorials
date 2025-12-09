"""
IMDb Poster Scraper

This script scrapes movie poster URLs from IMDb (Internet Movie Database) for movies
in the MovieLens dataset. It processes the movies.csv file, creates IMDb URLs using
the imdbId from the links.csv file, and scrapes poster images from each movie's IMDb page.

The script extracts multiple poster sizes from the srcset attribute and stores them
as JSON in a CSV file for later use in the movie recommendation application.

Features:
- Batch processing with progress saving every 100 records
- Handles HTTP errors gracefully
- Stores multiple poster sizes (different resolutions)
- Resumes from previous progress if interrupted
- Uses proper User-Agent headers to avoid blocking

Note: For a more comprehensive and easier way to get IMDb metadata (including posters,
descriptions, cast, directors, etc.), consider using the enrich-movies.py script instead.
"""

import pandas as pd
import ssl
import urllib.request
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from bs4 import BeautifulSoup
import json

movies = pd.read_csv('app/model/data/ml-latest-small/movies.csv')
ratings = pd.read_csv('app/model/data/ml-latest-small/ratings.csv')
links = pd.read_csv('app/model/data/ml-latest-small/links.csv')
tags = pd.read_csv('app/model/data/ml-latest-small/tags.csv')

# Create SSL context for HTTPS requests
context = ssl._create_unverified_context()

# Create results dataframe and join with links
results = movies.copy()
results = results.merge(links, on='movieId', how='left')

# Create IMDb URL column with properly formatted URLs
results['imdbURL'] = results['imdbId'].apply(lambda x: f'https://www.imdb.com/title/tt{int(x):07d}' if pd.notna(x) else None)

# Load previously scraped poster data if it exists
scraped_posters_file = 'app/model/data/processed/movie_posters_scraped.csv'
try:
    scraped_posters = pd.read_csv(scraped_posters_file)
    results = results.merge(scraped_posters[['movieId', 'posterURL']], on='movieId', how='left')
    print(f"Loaded existing scraped data for {len(scraped_posters[scraped_posters['posterURL'].isna()])} movies")
except FileNotFoundError:
    print("No existing scraped data found, starting fresh")
    scraped_posters = pd.DataFrame()

# Scrape poster URLs from IMDb for all movies
batch_size = 100
total_movies = len(results[results['posterURL'].isna()])
processed_count = 0

for idx in range(len(results)):
    # Skip if we already have poster data for this movie
    if pd.notna(results.loc[idx, 'posterURL']):
        continue
        
    if pd.notna(results.loc[idx, 'imdbURL']):
        try:
            req = Request(results.loc[idx, 'imdbURL'])
            req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; Win 64 ; x64) Apple WeKit /537.36(KHTML , like Gecko) Chrome/80.0.3987.162 Safari/537.36')
            with urlopen(req, context=context) as response:
                html = response.read()
                soup = BeautifulSoup(html, 'html.parser')
                try:
                    # Get the img element to access both src and srcset
                    img_element = soup.find('div', attrs={'data-testid': 'hero-media__poster'}).find('div', class_='ipc-media').img
                    poster_dict = {}
                    
                    # Parse srcset attribute if available
                    if img_element.get('srcset'):
                        srcset = img_element['srcset']
                        # Use regex to properly parse srcset with commas in URLs
                        import re
                        # Pattern to match URL followed by width
                        pattern = r'(https://[^\s]+)\s+(\d+)w'
                        matches = re.findall(pattern, srcset)
                        for url, width in matches:
                            poster_dict[width] = url
                    
                    # Add src as fallback or additional entry
                    if img_element.get('src'):
                        poster_dict['src'] = img_element['src']
                    
                    # Convert dict to JSON string for CSV storage
                    results.loc[idx, 'posterURL'] = json.dumps(poster_dict)
                    print(f"Successfully scraped {len(poster_dict)} poster sizes for movie {results.loc[idx, 'movieId']}: {results.loc[idx, 'title']}")
                except (TypeError, AttributeError):
                    results.loc[idx, 'posterURL'] = 'Not found'
                    print(f"Poster not found for movie {results.loc[idx, 'movieId']}: {results.loc[idx, 'title']}")
        except HTTPError:
            results.loc[idx, 'posterURL'] = 'Not found'
            print(f"HTTP Error for movie {results.loc[idx, 'movieId']}: {results.loc[idx, 'title']}")
    
    processed_count += 1
    
    # Save progress every 100 records
    if processed_count % batch_size == 0:
        print(f"\nSaving progress... Processed {processed_count}/{total_movies} movies")
        results[['movieId', 'title', 'posterURL']].to_csv(scraped_posters_file, index=False)
        print(f"Progress saved to {scraped_posters_file}")

# Final save
print(f"\nFinal save... Processed all {processed_count} movies")
results[['movieId', 'title', 'posterURL']].to_csv(scraped_posters_file, index=False)
print(f"Final results saved to {scraped_posters_file}")

# Print first 10 rows to see the enhanced data with poster URLs
print(results.head(10))

