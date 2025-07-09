"use server";
import { createClient } from "./supabase/server";

export async function fetchComments(articleIds) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_meal_comments_by_article_ids", {
        article_ids: articleIds,
    });
    if(error) console.error(error);
    return data;
}
export async function fetchOwnComments(articleIds) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("meal_comments").select().in("article_id", articleIds);
    if(error) console.error(error);
    return data;
}

export async function publishComment(articleId,rating,comment) {
    if(rating<1 || rating>5) return "Rating must be between 1 and 5";
    const supabase = await createClient();
    const { error } = await supabase.from("meal_comments").insert({ 
        article_id: articleId,
        rating: rating,
        comment_text: comment,
        updated_at: new Date().toISOString(),
    });
    return error;
}
export async function updateComment(id,rating,comment) {
    if(rating<1 || rating>5) return "Rating must be between 1 and 5";
    const supabase = await createClient(); 
    const { error } = await supabase.from("meal_comments").update({ 
        rating: rating,
        comment_text: comment,
        updated_at: new Date().toISOString(),
    }).eq("id", id);
    console.log(error);
    return error;
}
export async function deleteComment(id) {
    const supabase = await createClient(); 
    const { error } = await supabase.from("meal_comments").delete().eq("id", id);
    console.log(error);
    return error;
}