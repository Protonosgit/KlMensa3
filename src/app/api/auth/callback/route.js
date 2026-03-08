import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';


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

  // legacy site should provide this information
  // const hereshouldbeanapi = {email: "test12345@fmail.cow",hashedId: "2c042f25af393f70495953f482e9f4ed",reviews: 3571, images: 1}
  // if it fails, throw an error because token invalid

  // const res = await sql.query(
  //   `INSERT INTO users (email, hash_id) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
  //   [hereshouldbeanapi.email, hereshouldbeanapi.hashedId]
  // );

  // response.cookies.set("account_data", JSON.stringify(hereshouldbeanapi), {
  //   // maybe use httponlyy
  //   secure: process.env.NODE_ENV === "production",
  //   path: "/",
  //   maxAge: 15552000, // 6 months
  // });


    // Store secret as cookie and return home
  const response = NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=0");
  response.cookies.delete("csrf_token", { path: "/" });
  response.cookies.set("access_token", userAccessToken, {
    // maybe use httponly
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15552000, // 6 months
  });

  return response;
}
