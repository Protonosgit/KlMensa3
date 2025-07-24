// All routes should be internal

import { createClient } from "./supabase/server";


export async function fetchNews() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false }).limit(1);
    if(error) return {error: "Api call failed"}
    return data
}