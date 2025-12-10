## Example inputs and outputs

These engine configs are copy-pasted into `/app/api/refactor/constants.ts` for use in the system prompt

### Boost based on tags, in_stock, category, price and featured

#### Input: Elastic DSL

```json
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
```

#### Output: Shaped engine config

```yaml
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
```

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

#### What this query does: 

- Match "Blue jeans for summer" in the description
- Are featured, in stock, priced $20–$100, rated 4.0+, from Levis, and in jeans/pants/bottoms
- Get a boost if on sale or have a discount ≥ 10%

#### Output: Shaped engine config

```yaml
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
          input_text_query: "$params.input"
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
        - type: boosted
          name: sort_by_price_rating
          retriever: 
            type: item_column_order
            columns:
              - name: price
                ascending: true
              - name: rating
                ascending: false
      limit: 20
```

### Complex query with multi-match, nested bool, tags, ratings, and more

#### Input: Elastic DSL

```json
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
```

#### Output: Shaped engine config

version: v2
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
          input_text_query: "$params.input"
        - type: item_filter
          filter: "price >= 10 AND price <= 200 AND in_stock = true AND season IN ('summer', 'all-season') AND rating >= 3.0 AND (gender = 'unisex' OR gender = 'men') AND size_available IN ('S', 'M', 'L', 'XL') AND weight_grams >= 200 AND weight_grams <= 800 AND image_count >= 2 AND has_video = false AND discontinued = false AND hidden = false AND stock_quantity > 0"  
      score:
        type: score_ensemble
        name: multi_factor_ranking
        value_model: base
      reorder:
        - type: boosted
          name: featured_tag_boost
          strength: 0.7
          retriever:
            type: item_filter
            filter: "tags = 'featured'"
        - type: boosted
          name: new_arrival_boost
          strength: 0.9
          retriever:
            type: item_filter
            filter: "tags = 'new_arrival'"
        - type: boosted
          name: bestseller_boost
          strength: 0.2
          retriever:
            type: item_filter
            filter: "tags = 'bestseller'"
        - type: boosted
          name: price_range_boost
          strength: 0.2
          retriever:
            type: item_filter
            filter: "price >= 20 AND price <= 100"
        - type: boosted
          name: high_rating_boost
          strength: 0.9
          retriever:
            type: item_filter
            filter: "rating >= 4.5"
        - type: boosted
          name: in_stock_boost
          strength: 0.43
          retriever:
            type: item_filter
            filter: "in_stock = true"
        - type: boosted
          name: on_sale_boost
          strength: 0.6
          retriever:
            type: item_filter
            filter: "on_sale = true"
        - type: boosted
          name: recent_release_boost
          strength: 0.1
          retriever:
            type: item_filter
            filter: "days_since_release <= 30"
        - type: boosted
          name: discount_boost
          strength: 0.5
          retriever:
            type: item_filter
            filter: "discount_percentage >= 20"
        - type: boosted
          name: category_boost
          strength: 0.9
          retriever:
            type: item_filter
            filter: "category IN ('jeans', 'pants', 'bottoms')"
        - type: boosted
          name: free_shipping_boost
          strength: 0.9
          retriever:
            type: item_filter
            filter: "free_shipping = true"
        - type: boosted
          name: material_boost
          strength: 0.8
          retriever:
            type: item_filter
            filter: "material IN ('cotton', 'denim', 'organic')"
        - type: boosted
          name: review_count_boost
          strength: 0.2
          retriever:
            type: item_filter
            filter: "review_count >= 50"
        - type: boosted
          name: sustainable_boost
          strength: 0.4
          retriever:
            type: item_filter
            filter: "sustainable = true"
      limit: 50