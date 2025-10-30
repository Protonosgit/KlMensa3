"use server";
import { revalidatePath } from "next/cache";
import { neon } from '@neondatabase/serverless';

export async function putRating(legacyId, stars) {
  return { error: "Not implemented", data: null };
}

export async function deleteRating(legacyId) {
  return { error: "Not implemented", data: null };
}
