import webpush from 'web-push';
import { neon } from '@neondatabase/serverless';

webpush.setVapidDetails(
    process.env.NEXT_PUBLIC_VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL);
    const subscription = await req.json();
    const account_data = JSON.parse(req.cookies.get('account_data')?.value) || {};
    
    // Store subscription in database
    await sql`INSERT INTO pushlist (hash_id, endpoint, auth, p256dh, timeslot) VALUES (${account_data.hashedId}, ${subscription.endpoint}, ${subscription.keys.auth}, ${subscription.keys.p256dh}, 0)`;


    return new Response(JSON.stringify({ message: 'Subscription successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(req) {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL);
    const subscription = await req.json();
    

    // Remove subscription in database
    await sql`DELETE FROM pushlist WHERE endpoint = ${subscription.endpoint} AND auth = ${subscription.keys.auth} AND p256dh = ${subscription.keys.p256dh}`;    

    return new Response(JSON.stringify({ message: 'Unsubscription successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unsubscription failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
