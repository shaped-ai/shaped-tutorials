
# Frontend - movie recommendations app

This is a Next.js app that demonstrates how to call the Shaped API in a client application. 

## Local development

### Prerequisites

Before starting, make sure to do the following: 
1. Upload the movie data: `model/data/processed/movies_2018_enriched.jsonl`
2. Upload rating data: `model/data/ml-latest-small/ratings_2018.csv`
3. Create a model in Shaped: `/model/engine_configs/movie_recommendations_with_imdb_enrichment.yaml`
4. Add your shaped API key to `.env.local`

### Run the development server
First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.