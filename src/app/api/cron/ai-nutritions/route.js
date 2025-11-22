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
  const sql = neon(`${process.env.NEON_DATABASE_URL_UNPOOLED}`);
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}` && process.env.NEXT_PUBLIC_CURRENT_DOMAIN !== "http://localhost:3000") {
        return NextResponse.json({ "error": "Unauthorized" }, { status: 401 });
    }
    const rawmenu = (await ParseMenu()).slice(0,1);
    //
    // Here objects should be filtered out which have a nutrition set present
    //
    const mealsList = rawmenu.flatMap(entry => entry.meals).flat();
    const dedupedList = [...new Set(mealsList)];
    const readableList = makeListReadable(dedupedList);

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
    const title = meal.title?.map(item => item).join(", ");
    const aiD = meal.murmurID;
    const additives = meal?.zsnumnamen

    return `aID: ${aiD} Titel: ${title} Zusatz: ${additives}`
  });
  return rlist;
}

//     {
//       "role": "user",
//       "content": `aID: ${aID}\nTitle: Seelachsfilet "Toskana" mit Tomatensugo, Basilikum-Nudeln und Salat\nAdditives: Farbstoff, Fisch, Glutenhaltiges Getreide, Eier und Eierzeugnisse, Laktoses, Sellerie`
//     }

async function requestNutrition(rlist) {

  const finalList = rlist.map(item => {
    return {
      "role": "user",
      "content": item
    }
  });
  finalList.unshift({
    "role": "system",
    "content": "Bitte nutze die folgenden Parameter (aID, Titel, Zusatz) und versuche die Nährwerte für eine Portion jedes einzenlen Gerichts, so präzise wie möglich einzuschätzen, nutze dazu Internet. Gebe NUR die gewünschten Nahrungswerte als JSON array zurück! [aID, Kalorien_kcal, Fett_g, Zucker_g, Protein_g, Kohlenhydrate_g, Score_% (0 ist schlecht)]"
  });

  // return finalList


const chatCompletion = await groq.chat.completions.create({
  "messages": finalList,

  "stream": false, // dont touch

  // "model": "qwen/qwen3-32b", "reasoning_effort":"low", "tools":[{"type":"browser_search"}],"response_format":{"type": "json_object"},
  "model":"openai/gpt-oss-20b", "reasoning_effort":"low", "response_format": {"type": "json_object"}, //"tools":[{"type":"browser_search"}],
  // "model":"openai/gpt-oss-120b", "reasoning_effort":"medium", tools=[{"type":"browser_search"}],
  // "model":"groq/compound", "compound_custom": {"tools":{"enabled_tools":["web_search","visit_website"]}},

  "temperature": 0.05, // touch default 0.05
  "max_completion_tokens": 4024, // dont touch
  "top_p": 1, // dont touch
  "stop": null, // idk what this does
});

return chatCompletion.choices[0].message.content;
}
