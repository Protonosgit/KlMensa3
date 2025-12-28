'use server'
import { revalidatePath } from 'next/cache'
import { neon } from '@neondatabase/serverless';



export async function retrieveUserAccountData() {
  const sql = neon(`${process.env.NEON_DATABASE_URL}`);
    const email = 'dummy@example.com';
    const res = await sql.query('SELECT * from users WHERE email = $1', [email]);
    console.log(res);
}

export async function revalidatePage() {
  revalidatePath('/');
}