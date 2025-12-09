import { type NextRequest, NextResponse } from "next/server"
import { Anthropic } from '@anthropic-ai/sdk';
import { MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    const documentationString = `
The input structure of the YAML should  have this shape: 

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
    const anthropic = new Anthropic();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    // TODO: Replace this with your actual refactoring API call
    const system = `
    ## Instructions
    You are a senior engineer who works on Elasticsearch retrieval systems. You have been given the following ElasticSearch DSL to convert to an engine config with the Shaped Ranking API. 
    Use the "Attached documentation" to understand the Shaped API schema. Then, convert the "Input Code" to a Shaped Engine configuration. 
    The input code may be any language, including Elastic DSL, Go, Javascript, Python, etc. 

    The Engine Configuration should not use the "query" key, for conciseness. 

    If the input is code, your output should only contain YAML, with no additional markup or comments. 

    If the input is not code, you should output an error message - "No code was included in the input"


    ## Documentation: 
    ${documentationString}
    `

    const prompt = `
    ## Input Code: 
    \`\`\`
    ${code}
    \`\`\``

    const messages:MessageParam[] = [
      {"role": "user", "content": prompt}
    ]

    const tokens = await anthropic.messages.countTokens({
      model: "claude-haiku-4-5-20251001",
      messages,
      system,
    })
    console.log({tokens});
    if (tokens.input_tokens < 100000) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages,
        system: system
      })
      console.log({response})
      const contentBlock = response.content[0];
      // Mock refactoring for demonstration
      const refactoredCode = (typeof contentBlock === 'object' && 'text' in contentBlock)
        ? contentBlock.text
        : JSON.stringify(contentBlock, null, 2);
  
      return NextResponse.json({ refactoredCode })
    } else {
      return NextResponse.json({refactoredCode: "Input too long. Please reach out to our team for a consultation!"})
    }
  } catch (error) {
    console.error("Error in refactor API:", error)
    return NextResponse.json({ error: "Failed to refactor code - internal server error" }, { status: 500 })
  }
}