# Document Search

Search the Shaped blog with hybrid search (lexical + semantic). This demo shows how to ingest documents into Shaped and build a search interface on top of it.

## How It Works

1. **Ingestion:** Blog posts are chunked into smaller segments using `langchain-text-splitters` to preserve semantic meaning while enabling granular search. See `/notebooks/site_search.ipynb` for ingestion script. 

2. **Indexing:** Shaped creates both lexical (keyword) and vector (semantic) indexes on the document chunks. See `/notebooks/blog_engine_config.yaml` for full engine config. 

3. **Search:** The frontend sends queries to the Shaped API, which performs hybrid search combining lexical and vector retrieval. See `/frontend/src/app/api/search/route.ts` for the exact API call. 

## Running the project locally

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Shaped API key](https://docs.shaped.ai/docs/support/getting-an-api-key) with write permissions

## Running the Notebook (Data Ingestion)

The notebook walks through ingesting documents into Shaped:

1. **Create a virtual environment:**
   ```bash
   cd document-search/notebooks
   python3.11 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -U shaped webflow langchain-text-splitters lxml python-dotenv
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `notebooks/` directory:
   ```
   SHAPED_API_KEY=your_shaped_api_key
   ```

4. **Run the notebook:**
   Open `site_search.ipynb` in VS Code, Cursor, or Jupyter and run all cells. The notebook will:
   - Fetch blog posts from Webflow
   - Chunk documents for better search relevance
   - Upload the chunks to a Shaped dataset
   - Create a search engine with semantic + lexical indexes

### Running the Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd document-search/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file:
   ```
   SHAPED_API_KEY=your_shaped_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
document-search/
├── frontend/                    # Next.js search UI
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/search/      # API route for Shaped queries
│   │   │   ├── page.tsx         # Main search page
│   │   │   └── layout.tsx
│   │   ├── components/ui/       # UI components
│   │   └── lib/
│   └── .env.local               # Environment variables (create from .env.example)
│
├── notebooks/                   # Data preparation & ingestion
│   ├── site_search.ipynb        # Main notebook for chunking & uploading data
│   ├── blog_engine_config.yaml  # Engine config for semantic/lexical search
│   └── data/                    # Generated data files
│       ├── posts.json           # Raw blog posts
│       ├── posts.jsonl
│       ├── blog_post_chunked.jsonl         # Chunked documents
│       ├── blog_posts_chunked.schema.yaml  # Dataset schema
│       └── blog_posts_chunked.engine.yaml  # Engine configuration
│
└── README.md
```