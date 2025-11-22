"use server";
import { revalidatePath } from "next/cache";
import { neon } from '@neondatabase/serverless';

export async function putRating(legacyId, stars) {
  return { error: "Not implemented", data: null };
}

export async function deleteRating(legacyId) {
  return { error: "Not implemented", data: null };
}

export async function getNutritionForId(mumurId) {
  const sql = neon(`${process.env.NEON_DATABASE_URL_UNPOOLED}`);
  try {
    const data = await sql.query(
      "SELECT * FROM nutrition WHERE a_id = $1",
      [mumurId]
    );
    return { error: null, data };
  } catch (e) {
    console.error(e);
  }
  return { error: "Not implemented", data: null };
}


export async function sendSystemTGMessage(text) {

    const obj = {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text
    };

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    });
}