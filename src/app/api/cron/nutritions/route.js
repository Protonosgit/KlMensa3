import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { retrieveMenuCached } from "@/app/utils/meal-parser";
import { neon } from "@neondatabase/serverless";

/*
Information:
This system was stolen from an unsecured demo webpage of an industry leader in ai food nutrition scans.
Their app ranks in the top 4 results for "nutrition scan" and they use a setup very similar to this.
BUT somehow this is much better and returns results with higher precision, a better model, higher reliability and more details.
*/

//gemini-3-flash-preview  better but high demand 
const model = "gemini-3.1-flash-lite";
const aiconfig = {
  maxOutputTokens: 5031,
  thinkingConfig: {
    thinkingLevel: "LOW",
  },
  temperature: 0.1,
  topP: 0.5,
  tools: [
    {
      googleSearch: {},
    },
  ],
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    required: ["response"],
    properties: {
      response: {
        type: Type.OBJECT,
        required: ["items"],
        properties: {
          aID: {
            type: Type.STRING,
          },
          title: {
            type: Type.STRING,
          },
          score: {
            type: Type.NUMBER,
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                },
                amount: {
                  type: Type.STRING,
                },
              },
            },
          },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              calories: {
                type: Type.NUMBER,
              },
              protein: {
                type: Type.NUMBER,
              },
              carbs: {
                type: Type.NUMBER,
              },
              fat: {
                type: Type.NUMBER,
              },
              fiber: {
                type: Type.NUMBER,
              },
              sugar: {
                type: Type.NUMBER,
              },
            },
          },
          micronutrients: {
            type: Type.OBJECT,
            required: ["sodium", "vitamin_c", "iron"],
            properties: {
              sodium: {
                type: Type.NUMBER,
              },
              vitamin_c: {
                type: Type.NUMBER,
              },
              iron: {
                type: Type.NUMBER,
              },
            },
          },
        },
      },
    },
  },
};

export async function GET(req, res) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NEXT_PUBLIC_CURRENT_DOMAIN !== "http://localhost:3000"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sql = neon(`${process.env.NEON_DATABASE_URL}`);

  try {
    const rawmenu = (await retrieveMenuCached()).slice(1, 2);

    const mealsList = rawmenu.flatMap((entry) => entry.meals).flat();
    const dedupedList = [...new Set(mealsList)];
    const idList = dedupedList.map((entry) => entry.murmurID);

    const existingList = await sql.query(
      `SELECT a_id FROM nutrition WHERE a_id = ANY($1)`,
      [idList]
    );

    const filteredList = dedupedList.filter((entry) => {
      return !existingList.find((item) => item.a_id === entry.murmurID);
    });

    const readableList = makeListReadable(filteredList);


    //return NextResponse.json({ readableList }); // debugging

    for (let i = 0; i < readableList.length; i++) {
      try {
        const aiResult = await requestNutrition(readableList[i]);
        if (aiResult.error || !aiResult.data) {
          console.warn("Ai detection faulted");
          continue;
        }

        const aiData = JSON.parse(aiResult?.data);

        if (aiData.error) {
          console.error(aiData.error);
          return NextResponse.json({ error: aiData.error }, { status: 500 });
        }

        const res = await sql.query(
          `INSERT INTO nutrition (a_id, variant, score, calories, fat, sugar, protein, carbs, fiber, sodium, iron) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (a_id) DO UPDATE SET score = $3, calories = $4, fat = $5, sugar = $6, protein = $7, carbs = $8, fiber = $9, sodium = $10, iron = $11;`,
          [
            aiData.aID,
            0,
            aiData.score,
            aiData.nutrition.calories,
            aiData.nutrition.fat,
            aiData.nutrition.sugar,
            aiData.nutrition.protein,
            aiData.nutrition.carbohydrates,
            aiData.nutrition.fiber,
            aiData.micronutrients.sodium,
            aiData.micronutrients.iron,
          ],
        );
      } catch (e) {
        console.error(e);
      }
    }
    return NextResponse.json({ status: "OK" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function urlToBase64(imageUrl) {
  if (!imageUrl) {
    return null;
  }
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
}

function makeListReadable(list) {
  return list
    .filter(
      (meal) =>
        meal.dpartname === "Essen 1" ||
        meal.dpartname === "Essen 2" ||
        meal.dpartname === "Eintopf 1",
    )
    .map((meal) => {
      const title = meal.titleReg?.map((item) => item);
      const aiD = meal.murmurID;
      const additives =
        meal?.zsnumnamen?.map((item) => item.name).filter(Boolean) || [];

      return {
        text: `[ID: ${aiD}] ${title} (${additives})`,
        image: meal.imageUrl?.replace(".webp", ".jpeg"),
        aID: aiD,
      };
    });
}

async function requestNutrition(rlist) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMENI_API_KEY,
    });

    const parts = [
      {
        text: `Analyze this food image and provide detailed nutritional information. Identify the main dish/meal name and break down all individual food items with their estimated portion sizes. Use knowledge of the image (if attached), title and additives: ${rlist.text} Respond ONLY with valid structured JSON, no additional text or formatting and use units like kcal for calories, mg/g for (micro-)/nutrients and % for the health score focused on the nutritional value (higher is better, estimated based on the calculated nutrients). If a meal could not be parsed respond with: {error: "three_word_reason"}. Example result: {"aID": "00000000", "score": 100, "dishTitle": "meal title here","items": [{"name": "most relevant part","portion": "150g"},{"name": "another item","portion": "200g"},],"nutrition": {"calories": 0,"protein": 0,"carbohydrates": 0,"fat": 0,"fiber": 0, "sugar: 0},"micronutrients": {"vitamin_b12":0.0,"iron": 0.0,"sodium": 0.0,"calcium": 0.0}}`,
      },
    ];

    const base64image = await urlToBase64(rlist.image);
    if (base64image && base64image.length > 10) {
      parts.unshift({
        inlineData: {
          data: base64image,
          mimeType: `image/jpeg`,
        },
      });
    }

    // Maybe add a short sentence on why the meal is good/bad
    const contents = [
      {
        role: "user",
        parts,
      },
    ];

    const response = await ai.models.generateContent({
      model,
      aiconfig,
      contents,
    });

    return { data: response.text };
  } catch (error) {
    console.error(error);
    return { error: "Server error" };
  }
}
