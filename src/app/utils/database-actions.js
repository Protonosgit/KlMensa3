"use server";
import { revalidatePath } from "next/cache";
import { neon } from '@neondatabase/serverless';

// async function requestAccountData() {
//   const sql = neon(`${process.env.NEON_DATABASE_URL}`);
//     const email = 'dummy@example.com';
//     const res = await sql.query('SELECT * from users WHERE email = $1', [email]);
//     console.log(res);
// }

export async function getNutritionForId(mumurId) {
  const sql = neon(`${process.env.NEON_DATABASE_URL}`);
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


export async function revalidatePage() {
  revalidatePath('/');
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