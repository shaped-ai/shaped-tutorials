export const documentation = `
The structure of the YAML should  have this shape: 

json\`\`\`
{
  "name": "string",
  "description": "string",
  "tags": {
    "property1": "string",
    "property2": "string"
  },
  "data": {
    "interaction_dataset": {
      "name": "string",
      "query_id": "string",
      "query": "string",
      "path": "string",
      "is_transform": false
    },
    "user_dataset": {
      "name": "string",
      "query_id": "string",
      "query": "string",
      "path": "string",
      "is_transform": false
    },
    "item_dataset": {
      "name": "string",
      "query_id": "string",
      "query": "string",
      "path": "string",
      "is_transform": false
    },
    "schedule": "@hourly",
    "schema_override": {
      "user": {
        "id": "string",
        "features": [
          {
            "name": "string",
            "type": "Id"
          }
        ],
        "created_at": "string"
      },
      "item": {
        "id": "string",
        "features": [
          {
            "name": "string",
            "type": "Id"
          }
        ],
        "created_at": "string"
      },
      "interaction": {
        "label": {
          "name": "string",
          "type": "RatingLabel"
        },
        "created_at": "string",
        "session_id": "string",
        "interaction_id": "string",
        "features": [
          {
            "name": "string",
            "type": "Id"
          }
        ]
      }
    },
    "compute": {
      "cpu_count": 4,
      "cpu_memory_gb": 16
    },
    "index": {
      "search": {
        "tokenizer": {
          "language": "en",
          "stemming": true,
          "ascii_folding": true,
          "remove_stop_words": true,
          "type": "stemmer"
        },
        "user_fields": [
          "string"
        ],
        "item_fields": [
          "string"
        ]
      },
      "embeddings": [
        {
          "name": "string",
          "encoder": {
            "model_name": "string",
            "user_fields": [
              "string"
            ],
            "item_fields": [
              "string"
            ],
            "type": "hugging_face",
            "_real_time_attribute_encoding": true
          }
        }
      ]
    },
    "filters": [
      {
        "name": "string",
        "filter_dataset": {
          "name": "string",
          "query_id": "string",
          "query": "string",
          "path": "string",
          "is_transform": false
        },
        "type": {
          "user_id_column": "user_id",
          "item_id_column": "item_id",
          "index_type": "bloom_filter",
          "type": "personal"
        }
      }
    ]
  },
  "training": {
    "schedule": "@daily",
    "compute": {
      "gpu_type": "T4",
      "gpu_count": 1,
      "cpu_memory_gb": 16,
      "cpu_count": 4,
      "force_gpu": false,
      "disk_size_gb": 64
    },
    "data_split": {
      "strategy": "global"
    },
    "evaluation": {
      "candidate_source": "batch_iids",
      "filter_seen_items": false,
      "evaluation_top_k": 50
    },
    "models": [
      {
        "policy_type": "base"
      }
    ],
    "tuning": {
      "total_jobs": 30,
      "parallel_jobs": 10
    }
  },
  "deployment": {
    "data_tier": "fast_tier",
    "rollout": {
      "strategy": {
        "type": "canary",
        "evaluation_period_minutes": 10
      }
    },
    "autoscaling": {
      "min_replicas": 1,
      "max_replicas": 20,
      "policy": {
        "type": "requests_per_second",
        "target_requests": 10
      }
    },
    "server": {
      "worker_count": 1
    },
    "pagination": {
      "page_expiration_in_seconds": 0
    },
    "online_store": {
      "interaction_max_per_user": 30,
      "interaction_expiration_days": 90
    }
  },
  "queries": {
    "property1": {
      "query": {
        "columns": [
          "string"
        ],
        "embeddings": [
          "string"
        ],
        "retrieve": [
          {
            "columns": [
              {
                "name": "string",
                "ascending": true,
                "nulls_first": false
              }
            ],
            "filter": "string",
            "limit": 100,
            "name": "string",
            "type": "item_column_order",
            "_return_entity": "item"
          }
        ],
        "score": {
          "value_model": "string",
          "input_user_id": "string",
          "input_user_features": "string",
          "input_interactions_item_ids": [
            null
          ],
          "name": "string",
          "type": "score_ensemble"
        },
        "reorder": [
          {
            "retriever": {
              "columns": [
                {
                  "name": "string",
                  "ascending": true,
                  "nulls_first": false
                }
              ],
              "filter": "string",
              "limit": 100,
              "name": "string",
              "type": "item_column_order",
              "_return_entity": "item"
            },
            "strength": 0.5,
            "name": "string",
            "type": "exploration"
          }
        ],
        "limit": 0,
        "type": "rank_users",
        "_return_entity": "user"
      },
      "params": {
        "property1": {
          "default": 0
        },
        "property2": {
          "default": 0
        }
      }
    },
    "property2": {
      "query": {
        "columns": [
          "string"
        ],
        "embeddings": [
          "string"
        ],
        "retrieve": [
          {
            "columns": [
              {
                "name": "string",
                "ascending": true,
                "nulls_first": false
              }
            ],
            "filter": "string",
            "limit": 100,
            "name": "string",
            "type": "item_column_order",
            "_return_entity": "item"
          }
        ],
        "score": {
          "value_model": "string",
          "input_user_id": "string",
          "input_user_features": "string",
          "input_interactions_item_ids": [
            null
          ],
          "name": "string",
          "type": "score_ensemble"
        },
        "reorder": [
          {
            "retriever": {
              "columns": [
                {
                  "name": "string",
                  "ascending": true,
                  "nulls_first": false
                }
              ],
              "filter": "string",
              "limit": 100,
              "name": "string",
              "type": "item_column_order",
              "_return_entity": "item"
            },
            "strength": 0.5,
            "name": "string",
            "type": "exploration"
          }
        ],
        "limit": 0,
        "type": "rank_users",
        "_return_entity": "user"
      },
      "params": {
        "property1": {
          "default": 0
        },
        "property2": {
          "default": 0
        }
      }
    }
  },
  "version": "v2"
}
  \`\`\`
  `

  export const systemPrompt = `
## Your task
You are a senior engineer who works on Elasticsearch retrieval systems. Your task is to convert code that retrieves data with ElasticSearch DSL into a Shaped engine config. 

## Steps breakdown
Complete the following tasks: 
1. Read the input code and express its logic in plain english (RULES)
2. Convert the plain english RULES into a Shaped YAML configuration
3. Output the YAML configuration with no additional markup or comments

## Additional context:
- Use the "Example inputs and outputs" to see correct answers
- Use the "Attached documentation" to understand the YAML schema

## Other requirements: 
- The input code may be any language, including Elastic DSL, Go, Javascript, Python, etc. 
- The output must be YAML with no additional markup
- If the input is code, your output should be YAML-formatted key-value pairs. Do not include any comments or additional markup.
- If the input is not code, you should output an error message - "No code was included in the input"

## Example inputs and outputs

### Boost based on tags, in_stock, category, price and featured

#### Input: Elastic DSL

\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "description": {
              "query": "Blue jeans for summer",
              "operator": "and"
            }
          }
        }
      ],
      "should": [
        {
          "term": {
            "tags": {
              "value": "featured",
              "boost": 2.0
            }
          }
        },
        {
          "range": {
            "price": {
              "gte": 20,
              "lte": 100,
              "boost": 1.5
            }
          }
        },
        {
          "term": {
            "in_stock": {
              "value": true,
              "boost": 1.3
            }
          }
        },
        {
          "terms": {
            "category": ["jeans", "pants", "bottoms"],
            "boost": 1.2
          }
        }
      ],
      "filter": [
        {
          "range": {
            "price": {
              "gte": 10,
              "lte": 200
            }
          }
        },
        {
          "term": {
            "in_stock": true
          }
        },
        {
          "terms": {
            "season": ["summer", "all-season"]
          }
        }
      ],
      "minimum_should_match": 0
    }
  }
}
\`\`\`

#### Output: Shaped engine config

\`\`\`yaml
name: boosted_catalog_search
data: 
  item_dataset: 
    name: apparel_catalog
  index:
    search: 
      item_fields: 
        - name
        - description
queries: 
  search_products: 
    query:
      type: rank_items
      retrieve:
        - type: item_text_search
          mode: 
            type: lexical
          input_text_query: "Blue jeans for summer"
      score:
        type: score_ensemble
        name: boosted_ranking
        value_model: base
      reorder:
        - type: boosted
          name: featured_boost
          strength: 2.0
          retriever:
            type: "item_filter"
            filter: "tags = 'featured'"
        - type: boosted
          name: price_range_boost
          strength: 1.5
          retriever:
            type: "item_filter"
            filter: "price >= 20 AND price <= 100"
        - type: boosted
          name: in_stock_boost
          strength: 1.3
          retriever:
            type: "item_filter"
            filter: "in_stock = true"
        - type: boosted
          name: category_boost
          strength: 1.2
          retriever:
            type: "item_filter"
            filter: "category IN ('jeans', 'pants', 'bottoms')"
\`\`\`

### Filter and sort without boosts

#### Input: Elastic DSL

{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "description": "Blue jeans for summer"
          }
        }
      ],
      "filter": [
        {
          "term": {
            "tags": "featured"
          }
        },
        {
          "range": {
            "price": {
              "gte": 20,
              "lte": 100
            }
          }
        },
        {
          "term": {
            "in_stock": true
          }
        },
        {
          "terms": {
            "category": [
              "jeans",
              "pants",
              "bottoms"
            ]
          }
        },
        {
          "range": {
            "rating": {
              "gte": 4.0
            }
          }
        },
        {
          "term": {
            "brand": "Levis"
          }
        }
      ],
      "should": [
        {
          "term": {
            "on_sale": true
          }
        },
        {
          "range": {
            "discount": {
              "gte": 10
            }
          }
        }
      ]
    }
  },
  "sort": [
    { "price": "asc" },
    { "rating": "desc" }
  ],
  "size": 20,
  "_source": ["name", "price", "category", "brand", "rating", "tags", "on_sale"]
}


#### Output: Shaped engine config

\`\`\`yaml
name: filtered_product_search
data:
  item_dataset:
    name: apparel_catalog
  index:
    search:
      item_fields:
        - name
        - description
queries:
  search_products:
    query:
      type: rank_items
      columns:
        - name
        - price
        - category
        - brand
        - rating
        - tags
        - on_sale
      retrieve:
        - type: item_text_search
          name: text_search
          mode:
            type: lexical
          input_text_query: "Blue jeans for summer"
          filter: "tags = 'featured' AND price >= 20 AND price <= 100 AND in_stock = true AND category IN ('jeans', 'pants', 'bottoms') AND rating >= 4.0 AND brand = 'Levis'"
      reorder:
        - type: boosted
          name: on_sale_boost
          strength: 1.0
          retriever:
            type: item_filter
            filter: "on_sale = true"
        - type: boosted
          name: discount_boost
          strength: 1.0
          retriever:
            type: item_filter
            filter: "discount >= 10"
        - type: item_column_order
          name: sort_by_price_rating
          columns:
            - name: price
              ascending: true
            - name: rating
              ascending: false
      limit: 20
\`\`\`

### Complex query with multi-match, nested bool, tags, ratings, and more

#### Input: Elastic DSL

\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        {
          "bool": {
            "should": [
              {
                "multi_match": {
                  "query": "Blue jeans for summer",
                  "fields": [
                    "name^3",
                    "description^2",
                    "tags^1.5",
                    "brand^1.2",
                    "category^1.1"
                  ],
                  "type": "best_fields",
                  "operator": "and",
                  "minimum_should_match": "75%"
                }
              },
              {
                "match_phrase": {
                  "description": {
                    "query": "Blue jeans for summer",
                    "slop": 2,
                    "boost": 1.5
                  }
                }
              },
              {
                "match_phrase_prefix": {
                  "name": {
                    "query": "Blue jeans",
                    "max_expansions": 50,
                    "boost": 1.2
                  }
                }
              }
            ],
            "minimum_should_match": 1
          }
        },
        {
          "bool": {
            "must_not": [
              {
                "term": {
                  "discontinued": true
                }
              },
              {
                "term": {
                  "hidden": true
                }
              },
              {
                "range": {
                  "stock_quantity": {
                    "lte": 0
                  }
                }
              }
            ]
          }
        }
      ],
      "should": [
        {
          "term": {
            "tags": {
              "value": "featured",
              "boost": 2.0
            }
          }
        },
        {
          "term": {
            "tags": {
              "value": "new_arrival",
              "boost": 1.8
            }
          }
        },
        {
          "term": {
            "tags": {
              "value": "bestseller",
              "boost": 1.6
            }
          }
        },
        {
          "range": {
            "price": {
              "gte": 20,
              "lte": 100,
              "boost": 1.5
            }
          }
        },
        {
          "term": {
            "in_stock": {
              "value": true,
              "boost": 1.3
            }
          }
        },
        {
          "terms": {
            "category": ["jeans", "pants", "bottoms"],
            "boost": 1.2
          }
        },
        {
          "range": {
            "rating": {
              "gte": 4.5,
              "boost": 1.4
            }
          }
        },
        {
          "range": {
            "review_count": {
              "gte": 50,
              "boost": 1.1
            }
          }
        },
        {
          "term": {
            "on_sale": {
              "value": true,
              "boost": 1.3
            }
          }
        },
        {
          "range": {
            "discount_percentage": {
              "gte": 20,
              "boost": 1.25
            }
          }
        },
        {
          "terms": {
            "material": ["cotton", "denim", "organic"],
            "boost": 1.15
          }
        },
        {
          "term": {
            "sustainable": {
              "value": true,
              "boost": 1.1
            }
          }
        },
        {
          "term": {
            "free_shipping": {
              "value": true,
              "boost": 1.2
            }
          }
        },
        {
          "range": {
            "days_since_release": {
              "lte": 30,
              "boost": 1.3
            }
          }
        },
        {
          "nested": {
            "path": "variants",
            "query": {
              "bool": {
                "should": [
                  {
                    "term": {
                      "variants.color": {
                        "value": "blue",
                        "boost": 1.2
                      }
                    }
                  },
                  {
                    "term": {
                      "variants.size": {
                        "value": "medium",
                        "boost": 1.1
                      }
                    }
                  }
                ]
              }
            },
            "boost": 1.15
          }
        },
        {
          "function_score": {
            "query": {
              "match_all": {}
            },
            "functions": [
              {
                "gauss": {
                  "price": {
                    "origin": 50,
                    "scale": 30,
                    "decay": 0.5
                  }
                },
                "weight": 1.1
              },
              {
                "gauss": {
                  "rating": {
                    "origin": 5.0,
                    "scale": 1.0,
                    "decay": 0.3
                  }
                },
                "weight": 1.2
              }
            ],
            "score_mode": "multiply",
            "boost_mode": "multiply"
          }
        }
      ],
      "filter": [
        {
          "range": {
            "price": {
              "gte": 10,
              "lte": 200
            }
          }
        },
        {
          "term": {
            "in_stock": true
          }
        },
        {
          "terms": {
            "season": ["summer", "all-season"]
          }
        },
        {
          "range": {
            "rating": {
              "gte": 3.0
            }
          }
        },
        {
          "bool": {
            "should": [
              {
                "term": {
                  "gender": "unisex"
                }
              },
              {
                "term": {
                  "gender": "men"
                }
              }
            ],
            "minimum_should_match": 1
          }
        },
        {
          "terms": {
            "size_available": ["S", "M", "L", "XL"]
          }
        },
        {
          "range": {
            "weight_grams": {
              "gte": 200,
              "lte": 800
            }
          }
        },
        {
          "exists": {
            "field": "images"
          }
        },
        {
          "range": {
            "image_count": {
              "gte": 2
            }
          }
        },
        {
          "term": {
            "has_video": false
          }
        },
        {
          "range": {
            "created_at": {
              "gte": "2023-01-01T00:00:00Z"
            }
          }
        },
        {
          "range": {
            "updated_at": {
              "gte": "now-1y/d"
            }
          }
        },
        {
          "nested": {
            "path": "inventory",
            "query": {
              "bool": {
                "must": [
                  {
                    "range": {
                      "inventory.quantity": {
                        "gt": 0
                      }
                    }
                  },
                  {
                    "term": {
                      "inventory.warehouse": "main"
                    }
                  }
                ]
              }
            }
          }
        },
        {
          "geo_distance": {
            "distance": "100km",
            "warehouse_location": {
              "lat": 40.7128,
              "lon": -74.0060
            }
          }
        },
        {
          "script": {
            "script": {
              "source": "doc['price'].value * (1 - (doc['discount_percentage'].value / 100.0)) >= params.min_final_price",
              "params": {
                "min_final_price": 8.0
              }
            }
          }
        },
        {
          "wildcard": {
            "sku": {
              "value": "APP-*",
              "boost": 1.0
            }
          }
        },
        {
          "prefix": {
            "brand": {
              "value": "Le",
              "boost": 1.0
            }
          }
        },
        {
          "fuzzy": {
            "name": {
              "value": "jeans",
              "fuzziness": "AUTO",
              "max_expansions": 50,
              "prefix_length": 0,
              "transpositions": true
            }
          }
        }
      ],
      "minimum_should_match": 2
    }
  },
  "sort": [
    {
      "_score": {
        "order": "desc"
      }
    },
    {
      "rating": {
        "order": "desc",
        "missing": "_last"
      }
    },
    {
      "review_count": {
        "order": "desc",
        "missing": "_last"
      }
    },
    {
      "price": {
        "order": "asc",
        "missing": "_last"
      }
    },
    {
      "created_at": {
        "order": "desc"
      }
    }
  ],
  "size": 50,
  "from": 0,
  "_source": {
    "includes": [
      "name",
      "description",
      "price",
      "category",
      "brand",
      "rating",
      "tags",
      "on_sale",
      "discount_percentage",
      "images",
      "variants",
      "in_stock",
      "sku",
      "material",
      "sustainable",
      "free_shipping"
    ],
    "excludes": [
      "internal_notes",
      "supplier_info",
      "cost_price"
    ]
  },
  "highlight": {
    "fields": {
      "name": {
        "number_of_fragments": 1,
        "fragment_size": 150
      },
      "description": {
        "number_of_fragments": 3,
        "fragment_size": 200,
        "pre_tags": ["<em>"],
        "post_tags": ["</em>"]
      },
      "tags": {
        "number_of_fragments": 0
      }
    },
    "require_field_match": false
  },
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          {
            "key": "budget",
            "to": 30
          },
          {
            "key": "mid-range",
            "from": 30,
            "to": 80
          },
          {
            "key": "premium",
            "from": 80
          }
        ]
      }
    },
    "categories": {
      "terms": {
        "field": "category",
        "size": 10,
        "order": {
          "_count": "desc"
        }
      }
    },
    "brands": {
      "terms": {
        "field": "brand",
        "size": 15,
        "min_doc_count": 2
      },
      "aggs": {
        "avg_rating": {
          "avg": {
            "field": "rating"
          }
        }
      }
    },
    "materials": {
      "terms": {
        "field": "material",
        "size": 20
      }
    },
    "tags": {
      "terms": {
        "field": "tags",
        "size": 25,
        "order": {
          "_count": "desc"
        }
      }
    },
    "rating_stats": {
      "stats": {
        "field": "rating"
      }
    },
    "price_stats": {
      "stats": {
        "field": "price"
      },
      "aggs": {
        "price_histogram": {
          "histogram": {
            "field": "price",
            "interval": 20,
            "min_doc_count": 1
          }
        }
      }
    },
    "on_sale_count": {
      "filter": {
        "term": {
          "on_sale": true
        }
      }
    },
    "in_stock_count": {
      "filter": {
        "term": {
          "in_stock": true
        }
      }
    }
  },
  "suggest": {
    "text": "Blue jeans",
    "product_suggestions": {
      "term": {
        "field": "name",
        "size": 5,
        "suggest_mode": "popular"
      }
    },
    "category_suggestions": {
      "term": {
        "field": "category",
        "size": 3
      }
    }
  },
  "track_scores": true,
  "explain": false,
  "version": true
}
\`\`\`

#### Query Rules (Plain English)

**MUST MATCH (Required):**

1. The product must match at least one of these text search conditions:
   - Multi-field search: "Blue jeans for summer" must appear in name (3x weight), description (2x weight), tags (1.5x weight), brand (1.2x weight), or category (1.1x weight), with all words required and at least 75% of words matching
   - Phrase match: "Blue jeans for summer" must appear as a phrase in description (allowing up to 2 words between terms)
   - Prefix match: "Blue jeans" must appear at the start of the product name

2. The product must NOT be:
   - Discontinued
   - Hidden
   - Out of stock (stock_quantity must be greater than 0)

**FILTER REQUIREMENTS (Hard Requirements - All Must Pass):**

3. Price must be between $10 and $200 (inclusive)

4. Product must be in stock

5. Season must be either "summer" or "all-season"

6. Rating must be at least 3.0 stars

7. Gender must be either "unisex" or "men"

8. At least one of these sizes must be available: S, M, L, or XL

9. Weight must be between 200 and 800 grams (inclusive)

10. Product must have at least one image

11. Product must have at least 2 images

12. Product must NOT have a video

13. Product must have been created on or after January 1, 2023

14. Product must have been updated within the last year

15. In the inventory nested data, quantity must be greater than 0 AND warehouse must be "main"

16. Warehouse location must be within 100 kilometers of coordinates (40.7128, -74.0060) - New York City area

17. Final price (after discount) must be at least $8.00 (calculated as: price × (1 - discount_percentage/100))

18. SKU must match the pattern "APP-*" (must start with "APP-")

19. Brand name must start with "Le"

20. Product name must be similar to "jeans" (fuzzy matching with automatic fuzziness)

**BOOSTING RULES (Scoring Bonuses - At Least 2 Must Match):**

21. Featured tag: 2.0x boost

22. New arrival tag: 1.8x boost

23. Bestseller tag: 1.6x boost

24. Price between $20-$100: 1.5x boost

25. High rating (4.5+ stars): 1.4x boost

26. In stock: 1.3x boost

27. On sale: 1.3x boost

28. Released within last 30 days: 1.3x boost

29. Discount of 20% or more: 1.25x boost

30. Category is jeans, pants, or bottoms: 1.2x boost

31. Free shipping: 1.2x boost

32. Variant color is blue: 1.2x boost (nested query)

33. Variant size is medium: 1.1x boost (nested query)

34. Material is cotton, denim, or organic: 1.15x boost

35. Sustainable product: 1.1x boost

36. Review count of 50 or more: 1.1x boost

37. Gaussian decay boost for price: Products closer to $50 get higher scores (decay starts at $50, scale of $30)

38. Gaussian decay boost for rating: Products closer to 5.0 stars get higher scores (decay starts at 5.0, scale of 1.0)

**SORTING RULES:**

39. Primary sort: By relevance score (highest first)

40. Secondary sort: By rating (highest first, items without rating go to end)

41. Tertiary sort: By review count (highest first, items without review count go to end)

42. Fourth sort: By price (lowest first, items without price go to end)

43. Fifth sort: By creation date (newest first)

**RESULT CONFIGURATION:**

44. Return maximum 50 results

45. Start from result 0 (first page)

46. Include these fields in results: name, description, price, category, brand, rating, tags, on_sale, discount_percentage, images, variants, in_stock, sku, material, sustainable, free_shipping

47. Exclude these fields from results: internal_notes, supplier_info, cost_price

**HIGHLIGHTING RULES:**

48. Highlight matches in name field: Show 1 fragment of 150 characters

49. Highlight matches in description field: Show 3 fragments of 200 characters each, wrap matches in \`<em>\` tags

50. Highlight matches in tags field: Show entire field (no fragments)

51. Highlighting can match across any field (not just the searched field)

**AGGREGATION RULES (Analytics):**

52. Price ranges: Count products in budget (<$30), mid-range ($30-$80), and premium ($80+) categories

53. Categories: Show top 10 most common categories, ordered by count

54. Brands: Show top 15 brands with at least 2 products, and calculate average rating for each brand

55. Materials: Show top 20 most common materials

56. Tags: Show top 25 most common tags, ordered by count

57. Rating statistics: Calculate min, max, avg, sum, and count for ratings

58. Price statistics: Calculate min, max, avg, sum, and count for prices, plus a histogram with $20 intervals

59. On sale count: Count how many products are on sale

60. In stock count: Count how many products are in stock

**SUGGESTION RULES:**

61. Generate product name suggestions based on "Blue jeans" query, return top 5 popular suggestions

62. Generate category suggestions based on "Blue jeans" query, return top 3 suggestions

**QUERY PARAMETERS:**

63. Track and return relevance scores for all results

64. Do not include query explanation in response

65. Include document version numbers in response

#### Output: Shaped engine config

\`\`\`yaml
name: advanced_product_search
data:
  item_dataset:
    name: apparel_catalog
  index:
    search:
      item_fields:
        - name
        - description
        - tags
        - brand
        - category
queries:
  search_products:
    query:
      type: rank_items
      retrieve:
        - type: item_text_search
          mode:
            type: lexical
          input_text_query: "Blue jeans for summer"
      score:
        type: score_ensemble
        name: multi_factor_ranking
        value_model: base
      reorder:
        - type: boosted
          name: featured_tag_boost
          strength: 2.0
          retriever:
            type: item_filter
            filter: "tags = 'featured'"
        - type: boosted
          name: new_arrival_boost
          strength: 1.8
          retriever:
            type: item_filter
            filter: "tags = 'new_arrival'"
        - type: boosted
          name: bestseller_boost
          strength: 1.6
          retriever:
            type: item_filter
            filter: "tags = 'bestseller'"
        - type: boosted
          name: price_range_boost
          strength: 1.5
          retriever:
            type: item_filter
            filter: "price >= 20 AND price <= 100"
        - type: boosted
          name: high_rating_boost
          strength: 1.4
          retriever:
            type: item_filter
            filter: "rating >= 4.5"
        - type: boosted
          name: in_stock_boost
          strength: 1.3
          retriever:
            type: item_filter
            filter: "in_stock = true"
        - type: boosted
          name: on_sale_boost
          strength: 1.3
          retriever:
            type: item_filter
            filter: "on_sale = true"
        - type: boosted
          name: recent_release_boost
          strength: 1.3
          retriever:
            type: item_filter
            filter: "days_since_release <= 30"
        - type: boosted
          name: discount_boost
          strength: 1.25
          retriever:
            type: item_filter
            filter: "discount_percentage >= 20"
        - type: boosted
          name: category_boost
          strength: 1.2
          retriever:
            type: item_filter
            filter: "category IN ('jeans', 'pants', 'bottoms')"
        - type: boosted
          name: free_shipping_boost
          strength: 1.2
          retriever:
            type: item_filter
            filter: "free_shipping = true"
        - type: boosted
          name: material_boost
          strength: 1.15
          retriever:
            type: item_filter
            filter: "material IN ('cotton', 'denim', 'organic')"
        - type: boosted
          name: review_count_boost
          strength: 1.1
          retriever:
            type: item_filter
            filter: "review_count >= 50"
        - type: boosted
          name: sustainable_boost
          strength: 1.1
          retriever:
            type: item_filter
            filter: "sustainable = true"
        - type: item_filter
          name: base_filters
          filter: "price >= 10 AND price <= 200 AND in_stock = true AND season IN ('summer', 'all-season') AND rating >= 3.0 AND (gender = 'unisex' OR gender = 'men') AND size_available IN ('S', 'M', 'L', 'XL') AND weight_grams >= 200 AND weight_grams <= 800 AND image_count >= 2 AND has_video = false AND discontinued = false AND hidden = false AND stock_quantity > 0"
      limit: 50
\`\`\`

## Attached documentation: 
${documentation}
`