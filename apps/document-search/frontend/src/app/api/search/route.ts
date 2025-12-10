import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.SHAPED_API_KEY ?? "";
const QUERY_ENDPOINT =
  "https://api.shaped.ai/v1/models/demo___blog_semantic_search/query";

interface MainImage {
  fileId: string;
  url: string;
  alt: string | null;
}

interface ResultMetadata {
  item_id: string;
  created_at: string;
  created_at_datetime: string;
  author: string;
  categories: string;
  chunk_metadata: string | null;
  content: string;
  featured: string;
  main_image: string | null; // JSON string of MainImage
  name: string;
  popular: string;
  article_id: string;
  read_length_in_mins: string;
  release_date: string;
  roles: string | null;
  slug: string;
  updated_at: string;
  url: string;
  _derived_chronological_rank: number;
  _derived_trending_rank: number;
  _derived_popular_rank: number;
  _derived_interaction_count: number;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: ResultMetadata;
}

interface ShapedResponse {
  results: SearchResult[];
  entity_type: string;
  explanation?: {
    query_name: string;
    query_type: string;
    parameters: Record<string, string>;
    total_execution_time_ms: number;
    final_result_count: number;
    limit_applied: number;
  };
}

async function getSearchResultsFromShaped(
  query: string
): Promise<SearchResult[]> {
  try {
    const res = await fetch(QUERY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        return_explanation: true,
        query: {
          type: "rank",
          retrieve: [
            {
              type: "text_search",
              mode: {
                type: "lexical",
              },
              input_text_query: "$parameter.query",
              limit: 100,
            },
            {
              type: "text_search",
              mode: {
                type: "vector",
                text_embedding_ref: "content_embedding",
              },
              input_text_query: "$parameter.query",
              limit: 100,
            },
          ],
          from: "item",
        },
        parameters: {
          query: query,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Shaped API error (${res.status}): ${errorText}`);
    }

    const data: ShapedResponse = await res.json();
    
    // Deduplicate by article_id, keeping the first match for each article
    // Deduplicate by article_id, keeping the first match for each article
    const uniqueResults = Object.values(
      (data.results || []).reduce<Record<string, SearchResult>>((acc, r) => {
        acc[r.metadata.article_id] ??= r;
        return acc;
      }, {})
    );
    
    return uniqueResults;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  const results = await getSearchResultsFromShaped(query);
  return NextResponse.json({ results, query });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query } = body;

  const results = await getSearchResultsFromShaped(query);
  return NextResponse.json({ results, query });
}
