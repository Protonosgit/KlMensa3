"use server";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";


export async function putRating(legacyId, stars) {
  return { error: "Not implemented", data: null };
  const request =await fetch(
    `https://www.mensa-kl.de/ajax/rate.php?m_id=${legacyId}&rating=${stars}`,{
      credentials: "include",
      headers: {
        "User-Agent": "mensav3-api-spoofed-login 2025",
        Accept: "*/*",
        Cookie: "mensakl_session=vphrsuqvt0ht68et61dt07kv03; mensakl_memento=o23hoi8l0et2z7hbav0gyprw639q337vy9r169lmcszczwcgd3qms7kejtoxf84"
      },
      referrer: "https://www.mensa-kl.de/",
      method: "GET",
      mode: "cors"}
    );
    if(!request.ok) return { error: "Api unreachable", data: null };
    console.log(await request.text());
    const data = null
  return { error: null, data: data };
}

export async function deleteRating(legacyId) {
  
  const request =await fetch(
    `https://www.mensa-kl.de/ajax/rate.php?m_id=${legacyId}`,{
      credentials: "include",
      headers: {
        "User-Agent": "mensav3-api-spoofed-login 2025",
        Accept: "*/*",
        Cookie: "mensakl_session=vphrsuqvt0ht68et61dt07kv03; mensakl_memento=o23hoi8l0et2z7hbav0gyprw639q337vy9r169lmcszczwcgd3qms7kejtoxf84"
      },
      referrer: "https://www.mensa-kl.de/",
      method: "DELETE",
      mode: "cors"}
    );
    if(!request.ok) return { error: "Api unreachable", data: null };
    const data = await request.json();
  return { error: null, data: data };
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