"use server";
import { createClient } from "./supabase/server";

export async function fetchComments(articleIds) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_meal_comments_by_article_ids", {
        article_ids: articleIds,
    });
  if(error) return {error: "Login failed"}

  return data
}
export async function fetchOwnComments(articleIds) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("meal_comments").select().in("article_id", articleIds);
  if(error) return {error: "Login failed"}

  return data
}
export async function publishComment(articleId,rating,comment) {
    if(rating<1 || rating>5) return "Rating must be between 1 and 5";
    const supabase = await createClient();
    const { data, error } = await supabase.from("meal_comments").insert({ 
        article_id: articleId,
        rating: rating,
        comment_text: comment,
        updated_at: new Date().toISOString(),
    }).select('id');
    if(error) return {error: "Publishing comment failed", data: null}
    return {error: null, data: data}
}
export async function updateComment(id,rating,comment) {
    if(rating<1 || rating>5) return "Rating must be between 1 and 5";
    const supabase = await createClient(); 
    const { data, error } = await supabase.from("meal_comments").update({ 
        rating: rating,
        comment_text: comment,
        updated_at: new Date().toISOString(),
    }).eq("id", id);
    if(error) return {error: "Updating comment failed", data: null}
    return {error: null, data: data}
}
export async function deleteComment(id) {
    const supabase = await createClient(); 
    const { data, error } = await supabase.from("meal_comments").delete().eq("id", id);
    if(error) return {error: "Deleting comment failed", data: null}
    return {error: null, data: data}
}

export async function reportComment(commentId) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("user_reports").insert({ 
        comment_id: commentId
    });
    if(error) return {error: "Reporting comment failed", data: null}
    return {error: null, data: data}
}