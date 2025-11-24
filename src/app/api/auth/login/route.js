import { NextResponse } from "next/server";

export async function GET() {
  const CSRF_TOKEN = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const loginUrl = `${process.env.LEGACY_API_URL}/api/v1/authorize-client?client_uuid=${process.env.LEGACY_API_URL_APP_UUID}&csrf_token=${CSRF_TOKEN}`;
  
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
