import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    redirect_uri: `${process.env.NEXT_PUBLIC_CURRENT_DOMAIN}/api/auth/callback`,
    application_id: "klmensa_v3ext_user",
  });

  const loginUrl = `https://www.mensa-kl.de/external_auth/authenticate?${params.toString()}`;
  return NextResponse.redirect(loginUrl);
}
