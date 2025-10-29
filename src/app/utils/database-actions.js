"use server";
import { revalidatePath } from "next/cache";


export async function putRating(legacyId, stars) {
  return { error: "Not implemented", data: null };
}

export async function deleteRating(legacyId) {
  return { error: "Not implemented", data: null };
}
