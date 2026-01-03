import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import ParseMenu from '@/app/utils/meal-parser';
import { neon } from '@neondatabase/serverless';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  defaultHeaders: {
    "Groq-Model-Version": "latest"
  }
});


export async function GET( req, res ) {
  const sql = neon(`${process.env.NEON_DATABASE_URL}`);
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}` && process.env.NEXT_PUBLIC_CURRENT_DOMAIN !== "http://localhost:3000") {
        return NextResponse.json({ "error": "Unauthorized" }, { status: 401 });
    }
    const rawmenu = (await ParseMenu()).slice(0,2);
    //
    // Here objects should be filtered out which have a nutrition set present
    //
    const mealsList = rawmenu.flatMap(entry => entry.meals).flat();
    const dedupedList = [...new Set(mealsList)];
    const readableList = makeListReadable(dedupedList);

    // return NextResponse.json({ readableList }); // debugging

    const aiResult = await requestNutrition(readableList)
    let jsonArr;
    try {
      jsonArr = typeof aiResult === 'string' ? JSON.parse(aiResult) : aiResult;
    } catch (err) {
      console.error('Failed to parse AI response as JSON', err);
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
    }

    if (!Array.isArray(jsonArr)) jsonArr = [jsonArr];
    for (const obj of jsonArr) {
      const aID = obj.aID ?? null;
      const kal = obj.Kalorien_kcal ?? null;
      const fett = obj.Fett_g ?? null;
      const zucker = obj.Zucker_g ?? null;
      const protein = obj.Protein_g ?? null;
      const kohlen = obj.Kohlenhydrate_g ?? null;
      const score = obj['Score_%'] ?? null;

      await sql.query(
        `INSERT INTO nutrition (a_id, kalorien_kcal, fett_g, zucker_g, protein_g, kohlenhydrate_g, score_pct) 
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (a_id) DO NOTHING`,
        [aID, kal, fett, zucker, protein, kohlen, score]
      );
    }
  return NextResponse.json({ aiResult });
}


function makeListReadable(list) {
  const rlist = list.map((meal) => {
    const title = meal.titleReg?.map(item => item).join(", ");
    const aiD = meal.murmurID;
    const additives = meal?.zsnumnamen?.map(item => item.name).filter(Boolean) || [];


    return `aID: ${aiD} Titel: ${title} Zusatz: ${additives}`
  });
  return rlist;
}


async function requestNutrition(rlist) {
  const mealListString = rlist.join("\n");

// 'Bitte nutze die folgenden Parameter (aID, Titel, Zusatz) und versuche die Nährwerte in Ganzzahlen für eine Portion jedes einzelnen Mensa Gerichts in der Liste, 
// so präzise wie möglich zu berechnen. Ignoriere den Eintrag falls ein Ergebnis nicht bestimmt werden kann. Gebe NUR die gewünschten Nahrungswerte als JSON array zurück, 
// je höher der Score, desto gesünder!  
// [{"aID":"00000000","Kalorien_kcal":a,"Fett_g":b,"Zucker_g":c,"Protein_g":d,"Kohlenhydrate_g":e,"Score_%":f}, ...]',
//
  try {
    const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          'Du erhälst eine List mit Einträgen einer deutschen aktuellen Mensa-Speisekarte und hast die Aufgabe, die Nährwerte für jedes Gericht so präzise wie möglich zu schätzen. Gib alle Daten in einer JSON-String-Liste zurück, sollte das nicht möglich sein überspringst jeden Eintrag der nicht berechnet werden kann und sei dabei Fehlertollerant! Das Format: [{"aID":"00000000","Kalorien_kcal":a,"Fett_g":b,"Zucker_g":c,"Protein_g":d,"Kohlenhydrate_g":e,"Score_%":f}, ...] , achte auf Ganzzahlen, der Gesundheits-Score ist höher, je gesünder etwas ist!',
      },
      {
        role: "user",
        content: mealListString,
      },
    ],

    stream: false, // dont touch

    // "model": "qwen/qwen3-32b", "reasoning_effort":"low", "tools":[{"type":"browser_search"}],"response_format":{"type": "json_object"},
    //"model": "openai/gpt-oss-20b", "reasoning_effort": "low", "response_format": { type: "json_object" }, //"tools":[{"type":"browser_search"}],
    model: "openai/gpt-oss-120b", response_format: { type: "json_object" }, reasoning_effort: "medium",// tools: [{ type: "browser_search" }],
    // "model":"groq/compound", "compound_custom": {"tools":{"enabled_tools":["web_search","visit_website"]}},

    temperature: 0.25, // touch, default 0.2
    max_completion_tokens: 4024, // dont touch
    top_p: 1, // dont touch
    stop: null, // idk what this does
   });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return [];
  }
}
