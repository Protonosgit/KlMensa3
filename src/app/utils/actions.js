'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from './supabase/server'

export async function login() {

    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if(user?.data?.user) {
        console.log('User logged in!')
    } else {
        console.log('User not logged in!')
        const { data, error } = await supabase.auth.signInAnonymously();
        console.log(data, error)
    }
}

export async function rotateIdentity() {

}