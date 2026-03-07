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
    console.log(account_data.hashedId);

    
    //
    // Store subscription in database
    // Warning this system ONLY SUPPORTS ONE DEVICE AT A TIME  previous subscriptions will be OVERWRITTEN!!!!!
    //
    await sql`
    UPDATE users
    SET push_endpoint = ${subscription.endpoint}, push_auth = ${subscription.keys.auth}, push_p256dh = ${subscription.keys.p256dh}
    WHERE hash_id = ${account_data.hashedId};
    `;


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
