"use server";
import { revalidatePath } from "next/cache";
import { neon } from '@neondatabase/serverless';
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient({
  token: process.env.HUGGING_FACE_TOKEN,
});

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