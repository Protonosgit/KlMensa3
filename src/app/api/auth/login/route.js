import { NextResponse } from "next/server";
import crypto from 'crypto';

export async function GET() {
  // uuid will be leaked!
  const clientUuid = process.env.LEGACY_API_URL_APP_UUID;
  const CSRF_TOKEN = crypto.randomBytes(32).toString('hex');

  const loginUrl = `${process.env.NEXT_PUBLIC_LEGACY_API_URL}/api/v1/authorize-client?client_uuid=${clientUuid}&csrf_token=${CSRF_TOKEN}`;

  const res = NextResponse.redirect(loginUrl);
    res.cookies.set({
    name: "csrf_token",
    value: CSRF_TOKEN,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300
  });

  return res;
}
