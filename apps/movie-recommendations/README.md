# Shaped Movie Recommendations Demo

A complete movie recommendation system demonstrating how to build a client-server application using [Shaped](https://shaped.ai) and the `movielens` dataset.

## Live demo

Check out the live demo - [movies.shaped.ai](https://movies.shaped.ai)

Learn how this app works on our blog - [How I built a movie suggestion app with zero ML experience](www.shaped.ai/blog/how-to-build-movie-suggestion-app-no-ml?utm_source=github&utm_medium=documentation&utm_campaign=movielens_demo)

## Architecture

This application follows a client-server architecture:

- **Server (Shaped)**: Hosts the machine learning model and serves recommendations via API
- **Client (Next.js)**: A React-based frontend that consumes the Shaped API to display movie recommendations

The client communicates with Shaped's API to:
- Retrieve personalized movie recommendations
- Track user interactions (clicks, ratings)
- Find similar movies based on content

## Quick start

### Prerequisites

1. A [Shaped](https://shaped.ai) account
2. Node.js 18+ installed locally
3. Git

### Step 1: Upload Your Model to Shaped

Before running the frontend, you need to set up your recommendation model in Shaped:

1. **Upload Movie Data**: Upload `model/data/processed/movies_2018_enriched.jsonl` to Shaped
2. **Upload Rating Data**: Upload `model/data/ml-latest-small/ratings_2018.csv` to Shaped  
3. **Create Model**: Use the configuration in `model/engine_configs/movie_recommendations_with_imdb_enrichment.yaml` to create your model in Shaped

For detailed instructions, see the [Model README](model/README.md).

### Step 2: Start the Local Server

1. **Clone and navigate to the frontend**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the `frontend` directory and add your Shaped API key:
   ```bash
   SHAPED_API_KEY=your_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Learn More

- **Shaped Documentation**: Learn more about building recommendation systems at [shaped.ai/blog](https://shaped.ai/blog)
- **Frontend Details**: See [frontend/README.md](frontend/README.md) for frontend-specific setup
- **Model Details**: See [model/README.md](model/README.md) for model configuration details

## Project Structure

```
├── frontend/          # Next.js React application
│   ├── src/
│   │   ├── app/       # Next.js app router pages
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom React hooks
│   │   └── lib/       # Utility functions
│   └── README.md      # Frontend-specific documentation
├── model/             # Machine learning model components
│   ├── data/          # MovieLens datasets and processed data
│   ├── engine_configs/ # Shaped model configuration files
│   ├── scripts/       # Data processing scripts
│   └── README.md      # Model-specific documentation
└── README.md          # This file
```

## Contributing

This is a quickstart template. Feel free to fork and modify it for your own recommendation use cases!