"use server";
import { createClient } from "./supabase/server";

export async function fetchImages(articleIds) {
    const flatArticleIds = articleIds?.map(id => id.replace(/\./g, ""));
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_mealimages_by_artid", {
        article_ids: flatArticleIds,
    });
  if(error) return {error: "api call failed"}

  return data
}
export async function fetchComments(articleIds) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_mealcomments_by_artid", {
        article_ids: articleIds,
    });
  if(error) return {error: "Api call failed"}

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

export async function reportComment(commentId, imageId) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("user_reports").insert({ 
        comment_id: commentId,
        image_id: imageId
    });
    if(error) return {error: "Reporting failed", data: null}
    return {error: null, data: data}
}