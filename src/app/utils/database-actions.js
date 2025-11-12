"use server";
import { revalidatePath } from "next/cache";
import { neon } from '@neondatabase/serverless';

export async function putRating(legacyId, stars) {
  return { error: "Not implemented", data: null };
}

export async function deleteRating(legacyId) {
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