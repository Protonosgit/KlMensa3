import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

export async function GET(request) {
  const sql = neon(process.env.NEON_DATABASE_URL);
  const { searchParams } = new URL(request.url);

  const CSRF_TOKEN = searchParams.get("csrf_token");
  const expected_CSRF_TOKEN = request.cookies.get("csrf_token")?.value;
  const userAccessToken = searchParams.get("auth_token");

  if (!expected_CSRF_TOKEN) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=1");
  }
  
  // Validate CSRF
  if (!CSRF_TOKEN || CSRF_TOKEN !== expected_CSRF_TOKEN) {
    console.warn("CSRF token mismatch");
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=1");
  }

  // Validate secret
  if (!userAccessToken || userAccessToken.length < 20) {
    console.warn("No secret provided");
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=1");
  }

  // mock api
  const hereshouldbeanapi = {email: "test12345@fmail.cow", reviews: 3571, images: 1}
  // Throw error if secret is invalid !!!


  // Create / Get account
  const userResult = await sql.query(
    `INSERT INTO users (email)
     VALUES ($1)
     ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
     RETURNING id`,
    [hereshouldbeanapi.email]
  );
  
  const accountId = userResult[0]?.id;
  if (!accountId) {
    console.error("Failed to resolve user account id");
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN + "?authstatus=1");
  }

  // Create session for user
  const sessionToken = crypto.randomBytes(32).toString("hex");
  await sql.query(
    `INSERT INTO sessions (account_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '365 days')`,
    [accountId, sessionToken]
  );

    // Store secret as cookie and return home
  const response = NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=0");
  response.cookies.delete("csrf_token", { path: "/" });
  response.cookies.set("account_data", JSON.stringify({sessionToken, email: hereshouldbeanapi.email, legacyToken: userAccessToken}), {
    // maybe use httponlyy
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15552000, // 6 months
  });


  return response;
}
