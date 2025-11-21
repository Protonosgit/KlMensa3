"use server"
import { Groq } from 'groq-sdk';

// Bitte nutze die folgenden Parameter (aID, title, additives) und versuche die Nährwerte für eine Portion so präzise wie möglich einzuschätzen. Gebe ausschließlich alle Daten NUR als CSV zurrück (aID, Kalorien in kcal, Fett g, Zucker g, Protein g, Kohlenhydrate g)

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  defaultHeaders: {
    "Groq-Model-Version": "latest"
  }
});

export async function requestNutrition(aID, title, additives) {

const chatCompletion = await groq.chat.completions.create({
  "messages": [
    {
      "role": "system",
      "content": "Bitte nutze die folgenden Parameter (aID, title, additives) und versuche die Nährwerte für eine Portion so präzise wie möglich einzuschätzen. Gebe ausschließlich alle Daten NUR als CSV zurrück (aID, Kalorien in kcal, Fett g, Zucker g, Protein g, Kohlenhydrate g)"
    },
    {
      "role": "user",
      "content": `aID: ${aID}\nTitle: Gebratene Hähnchenbrustwürfel in Frischkäsekräutersoße, Eiernudeln und Salat\nAdditives: Geflügel, Farbstoff, Konservierungsstoff, Glutenhaltiges Getreide, Eier und Eierzeugnisse, Laktoses`
    },
    {
      "role": "user",
      "content": `aID: ${aID}\nTitle: Seelachsfilet "Toskana" mit Tomatensugo, Basilikum-Nudeln und Salat\nAdditives: Farbstoff, Fisch, Glutenhaltiges Getreide, Eier und Eierzeugnisse, Laktoses, Sellerie`
    }
  ],

  "model": "qwen/qwen3-32b", "reasoning_effort": "default",
  // "model":"openai/gpt-oss-20b", "reasoning_effort":"medium", tools=[{"type":"browser_search"}]
  // "model":"openai/gpt-oss-120b", "reasoning_effort":"medium", tools=[{"type":"browser_search"}]
  // "model":"groq/compound", "compound_custom": {"tools":{"enabled_tools":["web_search","visit_website"]}}

  "temperature": 0.05, // touch default 0.05
  "max_completion_tokens": 1024, // dont touch
  "top_p": 1, // dont touch
  "stream": false, // dont touch
  "stop": null,
});

console.log(chatCompletion.choices[0].message.content);
return { error: "Not implemented", data: null };
}


