'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(useremail,userpassword) {
  if(userpassword.length < 6 || useremail.length < 8) return {error: "Email or password invalid!"}
  
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({email: useremail, password: userpassword});
  if(error) return {error: "Login failed"}

  return data
}

export async function signup(useremail,userpassword) {
  if(userpassword.length < 6) return {error: "Password too short!"}
  if (!emailRegex.test(useremail)) return {error: "Invalid email format!"}
  if(useremail.substring(useremail.length-8) !== "@rptu.de") return {error: "Only rptu.de emails allowed!"}

  const supabase = await createClient()
  const { error,data } = await supabase.auth.signUp({email: useremail, password: userpassword})

  return {data:data, error:error}
}

export async function logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    return error
}