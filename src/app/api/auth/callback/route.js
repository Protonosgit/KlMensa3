import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Check for one-time-code
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 500 });
  }

  // Exchange one-time-code for token secret
  const tokenRes = await fetch(`https://www.mensa-kl.de/external_auth/codeswap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      code,
    }),
  });
  const parsedTokenRes = await tokenRes.json();

  // Check for success
  if (!tokenRes.ok || !parsedTokenRes?.secret) {
    return NextResponse.json("Failed to get token", { status: 500 });
  }

  // Store secret as cookie and return to home
  const res = NextResponse.redirect("/");
  res.cookies.set("access_token", parsedTokenRes.secret, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return res;
}
