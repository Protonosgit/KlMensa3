import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    redirect_uri: `${process.env.NEXT_PUBLIC_CURRENT_DOMAIN}/api/auth/callback`,
    application_id: "klmensa_v3ext_user",
  });

  const loginUrl = `${process.env.LEGACY_API_URL}/external_auth/authenticate.php?${params.toString()}`;
  return NextResponse.redirect(loginUrl);
}
