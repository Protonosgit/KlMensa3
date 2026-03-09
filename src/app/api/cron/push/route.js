import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import {retrieveMenuCached} from '@/app/utils/meal-parser';

export async function GET(req, res) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}` && process.env.NEXT_PUBLIC_CURRENT_DOMAIN !== "http://localhost:3000") {
        return NextResponse.json({ "error": "Unauthorized" }, { status: 401 });
    }

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const sql = neon(`${process.env.NEON_DATABASE_URL}`);
  const webpush = require('web-push');
    webpush.setVapidDetails(
    'https://kl-mensa.vercel.app/about',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const pushlist =  await sql.query( `SELECT timeslot, endpoint, auth, p256dh FROM pushlist`);
  const menulist = await retrieveMenuCached();
  const todaysmenu = menulist[0]?.meals;

  const titles = todaysmenu?.map(meal => `• ${meal.titleReg[0]}`).join('\n');

  const payload = JSON.stringify({
    title: "Heute in der Mensa",
    body: titles,
    icon: "/logo.png",
    badge: "/logo.png",
    url: "/",
    timestamp: Date.now()
  });

  for (let i = 0; i < pushlist.length; i++) {
    const user = pushlist[i];
    if(!(user?.timeslot === 0 && hours === 9 && minutes === 30)) {
      continue
    } if(!(user?.timeslot === 1 && hours === 10 && minutes === 0)) {
      continue
    } if(!(user?.timeslot === 2 && hours === 10 && minutes === 30)) {
      continue
    } if(!(user?.timeslot === 3 && hours === 11 && minutes === 0)) {
      continue
    } if(!(user?.timeslot === 4 && hours === 11 && minutes === 30)) {
      continue
    }
    try {
      webpush.sendNotification({
        endpoint: user.endpoint,
        keys: {
          auth: user.auth,
          p256dh: user.p256dh
        },
      }, payload);
    } catch (e) {}
  }
  return NextResponse.json({ ok: true });
}
