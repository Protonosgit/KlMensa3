import { NextResponse } from 'next/server';

export async function GET() {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }
  return NextResponse.json({ ok: true });
}
