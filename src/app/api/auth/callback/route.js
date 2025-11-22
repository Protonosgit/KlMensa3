import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Check for one-time-code
  if (!code || code.length < 3) {
    return NextResponse.json({ error: "No code provided" }, { status: 500 });
  }

  // // Exchange one-time-code for token secret
  const tokenRes = await fetch(`${process.env.LEGACY_API_URL}/external_auth/codeswap.php`, {
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

  // // Check for success
  if (!tokenRes.ok || !parsedTokenRes?.secret) {
    return NextResponse.json("Failed to get token", { status: 500 });
  }

  // Insert user into neon db
  // try {
  // const sql = neon(`${process.env.NEON_DATABASE_URL_UNPOOLED}`);
  // const reqCheck = await sql.query(
  //   'INSERT INTO public.users (email, metadata) SELECT $1::varchar, $2::jsonb WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = $1::varchar)',
  //   ['dummy@example.com', JSON.stringify({test: "nuululu"})]
  // );
  // if(!reqCheck) return NextResponse.json("Failed to insert user", { status: 500 });
  // } catch (error) {
  //   console.log(error);
  //   return NextResponse.json("Failed to perform database insert", { status: 500 });
  // }


  // Store secret as cookie and return to home
  const res = NextResponse.redirect(process.env.NEXT_PUBLIC_CURRENT_DOMAIN+"?authstatus=0");
  res.cookies.set("access_token", parsedTokenRes.secret, {
    httpOnly: true,
    secure: true,
    path: "/",
  });


  return res;
}
