import { NextResponse } from "next/server";

export async function GET(request) {
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
  if (!userAccessToken || userAccessToken.length < 3) {
    console.warn("No secret provided");
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=1");
  }


  // Store secret as cookie and return home
  const res = NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=0");
  res.cookies.delete("csrf_token", { path: "/" });
  res.cookies.set("access_token", userAccessToken, {
    path: "/",
    maxAge: 15552000, // 6 months
  });


  return res;
}
