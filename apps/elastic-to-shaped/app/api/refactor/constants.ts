export const documentation = `
## Shaped Engine Configuration Reference

### Core Structure
\`\`\`yaml
version: v2
name: engine_name
data:
  item_dataset:
    name: table_name
    query: SELECT item_id, title, description FROM table_name
  index:
    lexical_search:
      item_fields: [title, description]
    embeddings:
      - name: content_embedding
        encoder:
          type: hugging_face
          model_name: sentence-transformers/all-MiniLM-L6-v2
          item_fields: [title, description]
\`\`\`

### ShapedQL Query Syntax (SQL-like DSL)

**Lexical Search:**
\`\`\`sql
SELECT * FROM text_search(query='$query_text', mode='lexical', fuzziness=2, limit=50)
\`\`\`

**Semantic/Vector Search:**
\`\`\`sql
SELECT * FROM text_search(query='$query_text', mode='vector', text_embedding_ref='content_embedding', limit=50)
\`\`\`

**Hybrid Search (Lexical + Vector):**
\`\`\`sql
SELECT *
FROM text_search(query='$query_text', mode='vector', text_embedding_ref='content_embedding', limit=50),
     text_search(query='$query_text', mode='lexical', fuzziness=2, limit=50)
LIMIT 20
\`\`\`

**Personalized Hybrid Search (with scoring model):**
\`\`\`sql
SELECT *
FROM text_search(query='$query_text', mode='vector', text_embedding_ref='content_embedding', limit=50),
     text_search(query='$query_text', mode='lexical', fuzziness=2, limit=50)
ORDER BY lightgbm
LIMIT 20
\`\`\`

**Filter Syntax:**
\`\`\`sql
SELECT * FROM text_search(query='$query_text', mode='lexical', limit=50)
WHERE price >= 10 AND price <= 100 AND in_stock = true AND category IN ('shirts', 'pants')
LIMIT 20
\`\`\`

### Query Configuration (YAML format)
\`\`\`yaml
queries:
  query_name:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "$query_text"
          mode:
            type: lexical
            fuzziness_edit_distance: 2
          filter: "price >= 10 AND in_stock = true"
          limit: 50
        - type: text_search
          input_text_query: "$query_text"
          mode:
            type: vector
            text_embedding_ref: content_embedding
          limit: 50
      score:
        value_model: lightgbm
        input_user_id: "$user_id"
      reorder:
        - type: boost
          name: boost_name
          strength: 1.5
          retriever:
            type: item_filter
            filter: "condition = true"
        - type: diversity
          name: diversity_name
          strength: 0.5
          key: category
      limit: 20
    params:
      query_text:
        default: ""
      user_id:
        default: ""
\`\`\`

### Filter Operators
- Comparison: =, !=, <, >, <=, >=
- Logical: AND, OR, NOT
- List: IN ('value1', 'value2')
- Null: IS NULL, IS NOT NULL
- String: LIKE '%pattern%'
`

export const systemPrompt = `
## Your Task
Convert ElasticSearch DSL queries into Shaped engine configuration YAML.

## Output Format
- Output ONLY valid YAML
- No markdown code fences, comments, or explanations
- If input is not code, output: "No code was included in the input"

## Conversion Rules
1. \`match\`, \`multi_match\` → \`text_search\` with \`mode: lexical\`
2. \`knn\`, vector queries → \`text_search\` with \`mode: vector\`
3. \`bool.filter\` → \`filter\` clause on retriever
4. \`bool.should\` with boost → \`reorder\` with \`type: boost\`
5. \`sort\` → \`reorder\` with \`type: column_order\`
6. \`size\` → \`limit\`
7. \`_source\` → \`columns\`
8. \`function_score\` → \`score\` or \`reorder\` with boost

## Example Conversions

### 1. Simple Lexical Search

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "match": {
      "description": "summer dress"
    }
  },
  "size": 20
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: simple_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - description
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "summer dress"
          mode:
            type: lexical
          limit: 20
      limit: 20
\`\`\`

### 2. Vector/Semantic Search (kNN)

#### Input: ElasticDSL
\`\`\`json
{
  "knn": {
    "field": "description_embedding",
    "query_vector_builder": {
      "text_embedding": {
        "model_id": "sentence-transformers__all-minilm-l6-v2",
        "model_text": "comfortable running shoes"
      }
    },
    "k": 20,
    "num_candidates": 100
  }
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: semantic_search
data:
  item_dataset:
    name: products
  index:
    embeddings:
      - name: description_embedding
        encoder:
          type: hugging_face
          model_name: sentence-transformers/all-MiniLM-L6-v2
          item_fields:
            - description
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "comfortable running shoes"
          mode:
            type: vector
            text_embedding_ref: description_embedding
          limit: 100
      limit: 20
\`\`\`

### 3. Hybrid Search (Lexical + Vector)

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": {
              "query": "wireless headphones",
              "boost": 1.0
            }
          }
        }
      ]
    }
  },
  "knn": {
    "field": "content_embedding",
    "query_vector_builder": {
      "text_embedding": {
        "model_id": "sentence-transformers__all-minilm-l6-v2",
        "model_text": "wireless headphones"
      }
    },
    "k": 50,
    "num_candidates": 100
  },
  "size": 20
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: hybrid_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - title
    embeddings:
      - name: content_embedding
        encoder:
          type: hugging_face
          model_name: sentence-transformers/all-MiniLM-L6-v2
          item_fields:
            - title
            - description
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "wireless headphones"
          mode:
            type: lexical
          limit: 50
        - type: text_search
          input_text_query: "wireless headphones"
          mode:
            type: vector
            text_embedding_ref: content_embedding
          limit: 50
      limit: 20
\`\`\`

### 4. Multi-Match with Field Boosting

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "multi_match": {
      "query": "organic cotton shirt",
      "fields": ["name^3", "description^2", "category^1"],
      "type": "best_fields"
    }
  },
  "size": 25
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: multi_field_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - name
        - description
        - category
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "organic cotton shirt"
          mode:
            type: lexical
          limit: 100
      reorder:
        - type: boost
          name: name_boost
          strength: 3.0
          retriever:
            type: text_search
            input_text_query: "organic cotton shirt"
            mode:
              type: lexical
            search_fields:
              - name
        - type: boost
          name: description_boost
          strength: 2.0
          retriever:
            type: text_search
            input_text_query: "organic cotton shirt"
            mode:
              type: lexical
            search_fields:
              - description
      limit: 25
\`\`\`

### 5. Bool Query with Filters

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "laptop" } }
      ],
      "filter": [
        { "term": { "in_stock": true } },
        { "range": { "price": { "gte": 500, "lte": 2000 } } },
        { "terms": { "brand": ["Apple", "Dell", "Lenovo"] } }
      ]
    }
  },
  "size": 30
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: filtered_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - title
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "laptop"
          mode:
            type: lexical
          filter: "in_stock = true AND price >= 500 AND price <= 2000 AND brand IN ('Apple', 'Dell', 'Lenovo')"
          limit: 100
      limit: 30
\`\`\`

### 6. Bool Query with Should (Boosting)

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "description": "running shoes" } }
      ],
      "should": [
        { "term": { "featured": { "value": true, "boost": 2.0 } } },
        { "range": { "rating": { "gte": 4.5, "boost": 1.5 } } },
        { "term": { "prime_eligible": { "value": true, "boost": 1.3 } } }
      ],
      "filter": [
        { "term": { "in_stock": true } }
      ]
    }
  },
  "size": 20
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: boosted_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - description
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "running shoes"
          mode:
            type: lexical
          filter: "in_stock = true"
          limit: 100
      reorder:
        - type: boost
          name: featured_boost
          strength: 2.0
          retriever:
            type: item_filter
            filter: "featured = true"
        - type: boost
          name: rating_boost
          strength: 1.5
          retriever:
            type: item_filter
            filter: "rating >= 4.5"
        - type: boost
          name: prime_boost
          strength: 1.3
          retriever:
            type: item_filter
            filter: "prime_eligible = true"
      limit: 20
\`\`\`

### 7. Sorting and Pagination

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "match": { "category": "electronics" }
  },
  "sort": [
    { "rating": { "order": "desc" } },
    { "price": { "order": "asc" } },
    { "created_at": { "order": "desc" } }
  ],
  "size": 50,
  "from": 0,
  "_source": ["name", "price", "rating", "brand", "image_url"]
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: sorted_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - category
queries:
  search:
    query:
      type: rank_items
      columns:
        - name
        - price
        - rating
        - brand
        - image_url
      retrieve:
        - type: text_search
          input_text_query: "electronics"
          mode:
            type: lexical
          limit: 200
      reorder:
        - type: column_order
          name: sort_results
          columns:
            - name: rating
              ascending: false
            - name: price
              ascending: true
            - name: created_at
              ascending: false
      limit: 50
\`\`\`

### 8. Function Score with Decay

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "function_score": {
      "query": {
        "match": { "title": "coffee maker" }
      },
      "functions": [
        {
          "gauss": {
            "price": {
              "origin": 100,
              "scale": 50,
              "decay": 0.5
            }
          },
          "weight": 1.5
        },
        {
          "field_value_factor": {
            "field": "popularity",
            "factor": 1.2,
            "modifier": "log1p"
          }
        }
      ],
      "score_mode": "multiply",
      "boost_mode": "multiply"
    }
  },
  "size": 20
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: decay_scored_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - title
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "coffee maker"
          mode:
            type: lexical
          limit: 100
      reorder:
        - type: boost
          name: price_proximity_boost
          strength: 1.5
          retriever:
            type: item_filter
            filter: "price >= 50 AND price <= 150"
        - type: boost
          name: popularity_boost
          strength: 1.2
          retriever:
            type: item_filter
            filter: "popularity > 0"
      limit: 20
\`\`\`

### 9. Prefix/Autocomplete Search

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "should": [
        {
          "match_phrase_prefix": {
            "name": {
              "query": "iph",
              "max_expansions": 50
            }
          }
        },
        {
          "prefix": {
            "name.keyword": {
              "value": "iph",
              "boost": 2.0
            }
          }
        }
      ]
    }
  },
  "size": 10
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: autocomplete_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - name
queries:
  autocomplete:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "iph"
          mode:
            type: lexical
            fuzziness_edit_distance: 1
          limit: 50
      limit: 10
\`\`\`

### 10. Fuzzy Search with Typo Tolerance

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": {
              "query": "samsnug galaxy",
              "fuzziness": "AUTO"
            }
          }
        },
        {
          "fuzzy": {
            "brand": {
              "value": "samsnug",
              "fuzziness": 2,
              "prefix_length": 1
            }
          }
        }
      ]
    }
  },
  "size": 20
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: fuzzy_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - title
        - brand
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "samsnug galaxy"
          mode:
            type: lexical
            fuzziness_edit_distance: 2
          limit: 50
      limit: 20
\`\`\`

### 11. Negative Filtering (must_not)

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "category": "shoes" } }
      ],
      "must_not": [
        { "term": { "discontinued": true } },
        { "term": { "brand": "Knockoff" } },
        { "range": { "stock": { "lte": 0 } } }
      ]
    }
  },
  "size": 30
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: negative_filter_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - category
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "shoes"
          mode:
            type: lexical
          filter: "discontinued = false AND brand != 'Knockoff' AND stock > 0"
          limit: 100
      limit: 30
\`\`\`

### 12. Range Queries with Date Filters

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "type": "article" } }
      ],
      "filter": [
        {
          "range": {
            "published_at": {
              "gte": "2024-01-01",
              "lte": "2024-12-31"
            }
          }
        },
        {
          "range": {
            "view_count": {
              "gte": 1000
            }
          }
        }
      ]
    }
  },
  "sort": [
    { "published_at": { "order": "desc" } }
  ],
  "size": 20
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: date_range_search
data:
  item_dataset:
    name: articles
  index:
    lexical_search:
      item_fields:
        - type
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "article"
          mode:
            type: lexical
          filter: "published_at >= '2024-01-01' AND published_at <= '2024-12-31' AND view_count >= 1000"
          limit: 100
      reorder:
        - type: column_order
          name: sort_by_date
          columns:
            - name: published_at
              ascending: false
      limit: 20
\`\`\`

### 13. Complex Bool with Multiple Boosts

#### Input: ElasticDSL
\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "description": "Blue jeans for summer" } }
      ],
      "should": [
        { "term": { "tags": { "value": "featured", "boost": 2.0 } } },
        { "range": { "price": { "gte": 20, "lte": 100, "boost": 1.5 } } },
        { "term": { "in_stock": { "value": true, "boost": 1.3 } } },
        { "terms": { "category": ["jeans", "pants", "bottoms"], "boost": 1.2 } }
      ],
      "filter": [
        { "range": { "price": { "gte": 10, "lte": 200 } } },
        { "term": { "in_stock": true } },
        { "terms": { "season": ["summer", "all-season"] } }
      ],
      "minimum_should_match": 0
    }
  }
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: complex_boosted_search
data:
  item_dataset:
    name: apparel_catalog
  index:
    lexical_search:
      item_fields:
        - description
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "Blue jeans for summer"
          mode:
            type: lexical
          filter: "price >= 10 AND price <= 200 AND in_stock = true AND season IN ('summer', 'all-season')"
          limit: 100
      reorder:
        - type: boost
          name: featured_boost
          strength: 2.0
          retriever:
            type: item_filter
            filter: "tags = 'featured'"
        - type: boost
          name: price_range_boost
          strength: 1.5
          retriever:
            type: item_filter
            filter: "price >= 20 AND price <= 100"
        - type: boost
          name: in_stock_boost
          strength: 1.3
          retriever:
            type: item_filter
            filter: "in_stock = true"
        - type: boost
          name: category_boost
          strength: 1.2
          retriever:
            type: item_filter
            filter: "category IN ('jeans', 'pants', 'bottoms')"
      limit: 20
\`\`\`

### 14. Parameterized Query Template

#### Input: ElasticDSL (with parameters)
\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "{{query}}" } }
      ],
      "filter": [
        { "term": { "category": "{{category}}" } },
        { "range": { "price": { "lte": "{{max_price}}" } } }
      ]
    }
  },
  "size": "{{limit}}"
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: parameterized_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - title
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "$query"
          mode:
            type: lexical
          filter: "category = '$category' AND price <= $max_price"
          limit: 100
      limit: $limit
    params:
      query:
        default: ""
      category:
        default: ""
      max_price:
        default: 10000
      limit:
        default: 20
\`\`\`

### 15. Diversity / Deduplication

#### Input: ElasticDSL (with collapse)
\`\`\`json
{
  "query": {
    "match": { "title": "smartphone" }
  },
  "collapse": {
    "field": "brand"
  },
  "size": 20
}
\`\`\`

#### Output: Shaped Config
\`\`\`yaml
version: v2
name: diverse_search
data:
  item_dataset:
    name: products
  index:
    lexical_search:
      item_fields:
        - title
queries:
  search:
    query:
      type: rank_items
      retrieve:
        - type: text_search
          input_text_query: "smartphone"
          mode:
            type: lexical
          limit: 100
      reorder:
        - type: diversity
          name: brand_diversity
          strength: 1.0
          key: brand
      limit: 20
\`\`\`

## Documentation Reference
${documentation}
`

