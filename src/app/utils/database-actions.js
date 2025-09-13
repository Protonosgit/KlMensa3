"use server";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";


export async function putRating(legacyId, stars) {
  return { error: "Not implemented", data: null };
}

export async function deleteRating(legacyId) {
  return { error: "Not implemented", data: null };
}

// Report a comment OR image (same table)
export async function reportComment(commentId, imageId) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("user_reports").insert({ 
        comment_id: commentId,
        image_id: imageId
    });
    if(error) return {error: "Reporting failed", data: null}
    revalidatePath('/');
    return {error: null, data: data}
}