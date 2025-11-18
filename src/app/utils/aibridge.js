import { Groq } from 'groq-sdk';

const groq = new Groq();

export async function requestNutrition(artikel_id, title, additives) {
  return { error: "Not implemented", data: null };

  const chatCompletion = await groq.chat.completions.create({
  "messages": [
    {
      "role": "system",
      "content": "Please take in the following parameters (aID, title, additives) and guess the nutritional value of each dish (1 serving) as precise as possible.\nPlease ONLY return data in csv format(aID, callories in kcal, fat g, sugar g, protein g, carbohydrates g)"
    },
    {
      "role": "user",
      "content": "Title: Gebratene Hähnchenbrustwürfel in Frischkäsekräutersoße, Eiernudeln und Salat\nAdditives: Geflügel, Farbstoff, Konservierungsstoff, Glutenhaltiges Getreide, Eier und Eierzeugnisse, Laktoses"
    }
  ],
  "model": "openai/gpt-oss-20b",
  "temperature": 0.05,
  "max_completion_tokens": 500,
  "top_p": 1,
  "stream": false,
  "reasoning_effort": "medium",
  "stop": null
});
console.log(chatCompletion.choices[0].message.content);
}


