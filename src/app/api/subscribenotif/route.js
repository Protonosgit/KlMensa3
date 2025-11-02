import webpush from 'web-push';
import { neon } from '@neondatabase/serverless';

webpush.setVapidDetails(
    process.env.NEXT_PUBLIC_VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const subscription = await req.json();
    
    // Store subscription in database
    await sql`
    INSERT INTO webpush_clients (endpoint, auth, p256dh, uid)
    VALUES (${subscription.endpoint}, ${subscription.keys.auth}, ${subscription.keys.p256dh}, ${"userid"})
    `;
    
    const payload = JSON.stringify('Your are all set for receiving updates!');

    // Send test notification
    await webpush.sendNotification(subscription, payload);

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
    const sql = neon(process.env.DATABASE_URL);
    const subscription = await req.json();
    

    // Remove subscription in database
    await sql`DELETE FROM webpush_clients WHERE endpoint = ${subscription.endpoint} AND uid = ${"userid"}`;
    

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
