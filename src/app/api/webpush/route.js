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
    
    //
    // Store subscription in database
    // Warning set query to update when signing in is implemented!!!!!
    //
    await sql`
    INSERT INTO users (push_endpoint, push_auth, push_p256dh)
    VALUES (${subscription.endpoint}, ${subscription.keys.auth}, ${subscription.keys.p256dh})
    `;
    
    const payload = JSON.stringify('Wellcome to kl-mensa v2!');

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
    const sql = neon(process.env.NEON_DATABASE_URL);
    const subscription = await req.json();
    

    // Remove subscription in database
    await sql`
    UPDATE users
    SET push_endpoint = '', push_auth = '', push_p256dh = ''
    WHERE push_endpoint = ${subscription.endpoint} AND push_auth = ${subscription.keys.auth}`;    

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
