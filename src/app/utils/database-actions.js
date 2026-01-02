"use server";
import { revalidatePath } from "next/cache";
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

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


export async function rateMeal(legacyId, stars) {
    if(stars < 1 || stars > 5) {
        return { error: "Invalid rating", data: null };
    }
    const store = await cookies();
    const tokenString = store.get('access_token')?.value;
    if(!tokenString) {
        return { error: "Not logged in", data: null };
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LEGACY_API_URL}/api/v1/rate-meal`, { method: 'POST',body: JSON.stringify({ meal_id: legacyId, rating: stars }), headers: { Authorization: `Bearer ${tokenString}` }});
        const result = await response.json();
        if(result?.status === "fail") {
            return { error: "Rating blocked", data: result?.data };
        }

        return { error: null, data: result };
    } catch (error) {
        console.log(error);
        return { error: "Server issue", data: null };
    }
}


export async function revalidatePage() {
  revalidatePath('/');
}

export async function sendSystemTGMessage(text) {

    const obj = {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text
    };

    const res =await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    });
    console.log(res);
}