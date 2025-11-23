import { NextResponse } from 'next/server';

export async function GET(req, res) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}` && process.env.NEXT_PUBLIC_CURRENT_DOMAIN !== "http://localhost:3000") {
        return NextResponse.json({ "error": "Unauthorized" }, { status: 401 });
    }
  return NextResponse.json({ ok: true });
}
