# Model Directory

This directory contains the machine learning model components for the movie recommendation system.

## Uploading the movie recommendation model

Before setting up the frontend, you should upload your data and model using the Shaped dashboard:

1. Upload the movie data: `model/data/processed/movies_2018_enriched.jsonl`
2. Upload rating data: `model/data/ml-latest-small/ratings_2018.csv`
3. Create a model in Shaped: `/model/engine_configs/movie_recommendations_with_imdb_enrichment.yaml`

Once your model is trained, you can browse your data and simulate API calls. You can also run the movie recommendation client in `/frontend`

## Folders

### `data/`
Raw and processed datasets based on MovieLens. Contains:
- `ml-100k/` - MovieLens 100K dataset
- `ml-latest-small/` - MovieLens Latest Small dataset  
- `processed/` - Enriched and transformed datasets with movie posters and metadata
- `final/` - Finished dataset for upload

### `engine_configs/`
YAML configuration files describing different recommendation models in Shaped, including:
- `v2/` - Configs using v2 of engine configuration
- `v1/` - Configs using v1 model config

### `scripts/`
Python scripts for data transformation and enrichment:
- `enrich-movies.py` - Enriches movie data with additional metadata
- `scrape-imdb-posters.py` - Scrapes movie posters from IMDB
- `transform-csv.py` - Transforms CSV data formats

## Dataset Source
[MovieLens Dataset](https://grouplens.org/datasets/movielens/) - GroupLens Research Lab
