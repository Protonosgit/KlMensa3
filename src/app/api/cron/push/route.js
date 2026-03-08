import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req, res) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}` && process.env.NEXT_PUBLIC_CURRENT_DOMAIN !== "http://localhost:3000") {
        return NextResponse.json({ "error": "Unauthorized" }, { status: 401 });
    }
    
  const sql = neon(`${process.env.NEON_DATABASE_URL}`);
  const webpush = require('web-push');
    webpush.setVapidDetails(
    'https://kl-mensa.vercel.app/about',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const pushlist =  await sql.query(
    `SELECT daily_push, push_endpoint, push_auth, push_p256dh FROM users WHERE push_endpoint != '' AND push_auth != '' AND push_p256dh != '' AND daily_push = 0`
  );

const payload = JSON.stringify({
  title: "Todays Menu",
  body: "Click to find out",
  icon: "/logo.png",
  badge: "/logo.png",
  url: "/",
  timestamp: Date.now()
});

  for (let i = 0; i < pushlist.length; i++) {
    const user = pushlist[i];
    try {
      webpush.sendNotification({
        endpoint: user.push_endpoint,
        keys: {
          auth: user.push_auth,
          p256dh: user.push_p256dh
        },
      }, payload);
    } catch (e) {}
  }
  return NextResponse.json({ ok: true });
}
