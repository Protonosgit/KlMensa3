'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'


export async function retrieveUserAccountData() {

}

export async function logout() {
  const res = await fetch('https://www.mensa-kl.de/external_auth/logout', { method: 'POST' });
  if(!res.ok) return true;
  return false;
}



export async function revalidatePage() {
  revalidatePath('/');
}