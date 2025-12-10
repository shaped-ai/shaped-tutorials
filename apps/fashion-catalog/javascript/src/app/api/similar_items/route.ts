import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interactions } = body;
    
    // Require interactions in request body
    if (!interactions) {
      return NextResponse.json(
        { error: "interactions is required in request body" },
        { status: 400 }
      );
    }
    
    // Ensure interactions is an array
    if (!Array.isArray(interactions)) {
      return NextResponse.json(
        { error: "interactions must be an array" },
        { status: 400 }
      );
    }
    
    // Ensure interactions array is not empty
    if (interactions.length === 0) {
      return NextResponse.json(
        { error: "interactions must contain at least one item ID" },
        { status: 400 }
      );
    }
    
    // Ensure all items in interactions are strings (convert if needed)
    const interactionsArray: string[] = interactions.map((id) => String(id));

    const products = [
    {
      article_id: 108775015,
      product_code: 108775,
      prod_name: "Strap top",
      product_type_no: 253,
      product_type_name: "Vest top",
      product_group_name: "Garment Upper body",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 9,
      colour_group_name: "Black",
      perceived_colour_value_id: 4,
      perceived_colour_value_name: "Dark",
      perceived_colour_master_id: 5,
      perceived_colour_master_name: "Black",
      department_no: 1676,
      department_name: "Jersey Basic",
      index_code: "A",
      index_name: "Ladieswear",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 16,
      section_name: "Womens Everyday Basics",
      garment_group_no: 1002,
      garment_group_name: "Jersey Basic",
      detail_desc: "Jersey top with narrow shoulder straps.",
    },
    {
      article_id: 108775044,
      product_code: 108775,
      prod_name: "Strap top",
      product_type_no: 253,
      product_type_name: "Vest top",
      product_group_name: "Garment Upper body",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 10,
      colour_group_name: "White",
      perceived_colour_value_id: 3,
      perceived_colour_value_name: "Light",
      perceived_colour_master_id: 9,
      perceived_colour_master_name: "White",
      department_no: 1676,
      department_name: "Jersey Basic",
      index_code: "A",
      index_name: "Ladieswear",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 16,
      section_name: "Womens Everyday Basics",
      garment_group_no: 1002,
      garment_group_name: "Jersey Basic",
      detail_desc: "Jersey top with narrow shoulder straps.",
    },
    {
      article_id: 108775051,
      product_code: 108775,
      prod_name: "Strap top (1)",
      product_type_no: 253,
      product_type_name: "Vest top",
      product_group_name: "Garment Upper body",
      graphical_appearance_no: 1010017,
      graphical_appearance_name: "Stripe",
      colour_group_code: 11,
      colour_group_name: "Off White",
      perceived_colour_value_id: 1,
      perceived_colour_value_name: "Dusty Light",
      perceived_colour_master_id: 9,
      perceived_colour_master_name: "White",
      department_no: 1676,
      department_name: "Jersey Basic",
      index_code: "A",
      index_name: "Ladieswear",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 16,
      section_name: "Womens Everyday Basics",
      garment_group_no: 1002,
      garment_group_name: "Jersey Basic",
      detail_desc: "Jersey top with narrow shoulder straps.",
    },
    {
      article_id: 110065001,
      product_code: 110065,
      prod_name: "OP T-shirt (Idro)",
      product_type_no: 306,
      product_type_name: "Bra",
      product_group_name: "Underwear",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 9,
      colour_group_name: "Black",
      perceived_colour_value_id: 4,
      perceived_colour_value_name: "Dark",
      perceived_colour_master_id: 5,
      perceived_colour_master_name: "Black",
      department_no: 1339,
      department_name: "Clean Lingerie",
      index_code: "B",
      index_name: "Lingeries/Tights",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 61,
      section_name: "Womens Lingerie",
      garment_group_no: 1017,
      garment_group_name: "Under-, Nightwear",
      detail_desc:
        "Microfibre T-shirt bra with underwired, moulded, lightly padded cups that shape the bust and provide good support. Narrow adjustable shoulder straps and a narrow hook-and-eye fastening at the back. Without visible seams for greater comfort.",
    },
    {
      article_id: 110065002,
      product_code: 110065,
      prod_name: "OP T-shirt (Idro)",
      product_type_no: 306,
      product_type_name: "Bra",
      product_group_name: "Underwear",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 10,
      colour_group_name: "White",
      perceived_colour_value_id: 3,
      perceived_colour_value_name: "Light",
      perceived_colour_master_id: 9,
      perceived_colour_master_name: "White",
      department_no: 1339,
      department_name: "Clean Lingerie",
      index_code: "B",
      index_name: "Lingeries/Tights",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 61,
      section_name: "Womens Lingerie",
      garment_group_no: 1017,
      garment_group_name: "Under-, Nightwear",
      detail_desc:
        "Microfibre T-shirt bra with underwired, moulded, lightly padded cups that shape the bust and provide good support. Narrow adjustable shoulder straps and a narrow hook-and-eye fastening at the back. Without visible seams for greater comfort.",
    },
    {
      article_id: 110065011,
      product_code: 110065,
      prod_name: "OP T-shirt (Idro)",
      product_type_no: 306,
      product_type_name: "Bra",
      product_group_name: "Underwear",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 12,
      colour_group_name: "Light Beige",
      perceived_colour_value_id: 1,
      perceived_colour_value_name: "Dusty Light",
      perceived_colour_master_id: 11,
      perceived_colour_master_name: "Beige",
      department_no: 1339,
      department_name: "Clean Lingerie",
      index_code: "B",
      index_name: "Lingeries/Tights",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 61,
      section_name: "Womens Lingerie",
      garment_group_no: 1017,
      garment_group_name: "Under-, Nightwear",
      detail_desc:
        "Microfibre T-shirt bra with underwired, moulded, lightly padded cups that shape the bust and provide good support. Narrow adjustable shoulder straps and a narrow hook-and-eye fastening at the back. Without visible seams for greater comfort.",
    },
    {
      article_id: 111565001,
      product_code: 111565,
      prod_name: "20 den 1p Stockings",
      product_type_no: 304,
      product_type_name: "Underwear Tights",
      product_group_name: "Socks & Tights",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 9,
      colour_group_name: "Black",
      perceived_colour_value_id: 4,
      perceived_colour_value_name: "Dark",
      perceived_colour_master_id: 5,
      perceived_colour_master_name: "Black",
      department_no: 3608,
      department_name: "Tights basic",
      index_code: "B",
      index_name: "Lingeries/Tights",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 62,
      section_name: "Womens Nightwear, Socks & Tigh",
      garment_group_no: 1021,
      garment_group_name: "Socks and Tights",
      detail_desc:
        "Semi shiny nylon stockings with a wide, reinforced trim at the top. Use with a suspender belt. 20 denier.",
    },
    {
      article_id: 111565003,
      product_code: 111565,
      prod_name: "20 den 1p Stockings",
      product_type_no: 302,
      product_type_name: "Socks",
      product_group_name: "Socks & Tights",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 13,
      colour_group_name: "Beige",
      perceived_colour_value_id: 2,
      perceived_colour_value_name: "Medium Dusty",
      perceived_colour_master_id: 11,
      perceived_colour_master_name: "Beige",
      department_no: 3608,
      department_name: "Tights basic",
      index_code: "B",
      index_name: "Lingeries/Tights",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 62,
      section_name: "Womens Nightwear, Socks & Tigh",
      garment_group_no: 1021,
      garment_group_name: "Socks and Tights",
      detail_desc:
        "Semi shiny nylon stockings with a wide, reinforced trim at the top. Use with a suspender belt. 20 denier.",
    },
    {
      article_id: 111586001,
      product_code: 111586,
      prod_name: "Shape Up 30 den 1p Tights",
      product_type_no: 273,
      product_type_name: "Leggings/Tights",
      product_group_name: "Garment Lower body",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 9,
      colour_group_name: "Black",
      perceived_colour_value_id: 4,
      perceived_colour_value_name: "Dark",
      perceived_colour_master_id: 5,
      perceived_colour_master_name: "Black",
      department_no: 3608,
      department_name: "Tights basic",
      index_code: "B",
      index_name: "Lingeries/Tights",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 62,
      section_name: "Womens Nightwear, Socks & Tigh",
      garment_group_no: 1021,
      garment_group_name: "Socks and Tights",
      detail_desc:
        "Tights with built-in support to lift the bottom. Black in 30 denier and light amber in 15 denier.",
    },
    {
      article_id: 111593001,
      product_code: 111593,
      prod_name: "Support 40 den 1p Tights",
      product_type_no: 304,
      product_type_name: "Underwear Tights",
      product_group_name: "Socks & Tights",
      graphical_appearance_no: 1010016,
      graphical_appearance_name: "Solid",
      colour_group_code: 9,
      colour_group_name: "Black",
      perceived_colour_value_id: 4,
      perceived_colour_value_name: "Dark",
      perceived_colour_master_id: 5,
      perceived_colour_master_name: "Black",
      department_no: 3608,
      department_name: "Tights basic",
      index_code: "B",
      index_name: "Lingeries/Tights",
      index_group_no: 1,
      index_group_name: "Ladieswear",
      section_no: 62,
      section_name: "Womens Nightwear, Socks & Tigh",
      garment_group_no: 1021,
      garment_group_name: "Socks and Tights",
      detail_desc:
        "Semi shiny tights that shape the tummy, thighs and calves while also encouraging blood circulation in the legs. Elasticated waist.",
    },
    ];

    const res = await fetch("https://api.shaped.ai/v2/models/model_name/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.SHAPED_API_KEY ?? "",
    },
    body: JSON.stringify({
      query: {
        type: "rank",
        retrieve: [
          {
            type: "column_order",
            columns: [
              {
                name: "_derived_popular_rank",
                ascending: "true",
              },
            ],
            limit: 1000,
          },
        ],
        score: {
          value_model: "lightgbm",
          input_user_id: "$parameters.userId",
          input_interactions_item_ids: interactionsArray,
        },
        from: "item",
      },
      parameters: {
        userId: "12345",
      },
      return_metadata: "true",
    }),
  });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in similar_items route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 400 }
    );
  }
}
