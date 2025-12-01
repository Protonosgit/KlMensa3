import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const CSRF_TOKEN = searchParams.get("CSRF_TOKEN");
  const expected_CSRF_TOKEN = request.cookies.get("csrf_token")?.value;
  const userAccessToken = searchParams.get("USER_MEMENTO");

  if (!expected_CSRF_TOKEN) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=1");
  }

  console.log(CSRF_TOKEN, expected_CSRF_TOKEN, userAccessToken);
  
  // Validate CSRF
  if (!CSRF_TOKEN || CSRF_TOKEN !== expected_CSRF_TOKEN) {
    console.warn("CSRF token mismatch");
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=1");
  }

  // Validate secret
  if (!USER_MEMENTO || USER_MEMENTO.length < 3) {
    console.warn("No secret provided");
    return NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=1");
  }


  // Store secret as cookie and return home
  const res = NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=0");
  res.cookies.delete("csrf_token", { path: "/" });
  res.cookies.set("access_token", userAccessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  });


  return res;
}
