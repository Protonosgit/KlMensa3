'use server'
import { revalidatePath } from 'next/cache'
import { neon } from '@neondatabase/serverless';

export async function retrieveUserAccountData() {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const email = 'dummy@example.com';
    const res = await sql.query('SELECT * from users WHERE email = $1', [email]);
    console.log(res);
}

export async function logout() {
  const res = await fetch('https://www.mensa-kl.de/external_auth/logout', { method: 'POST' });
  if(!res.ok) return true;
  return false;
}



export async function revalidatePage() {
  revalidatePath('/');
}