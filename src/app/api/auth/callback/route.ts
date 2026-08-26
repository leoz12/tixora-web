import { NextRequest, NextResponse } from "next/server";

// Google redirects here with ?code=... This route only hands the code off to
// a client page - it deliberately does NOT exchange it for a session itself.
// The actual exchange (POST /auth/oauth/google/callback) has to happen as a
// real browser request straight to the backend's own origin, because the
// backend's Set-Cookie response needs to be scoped to the backend's domain.
// A server-to-server exchange from this route handler would have the
// opposite problem: the Set-Cookie headers would arrive at the browser
// attached to *this* app's origin (wherever this redirect response comes
// from), not the backend's - so the cookies would never get sent back to the
// backend on later requests.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/login?error=no_code`,
    );
  }

  const redirectUrl = new URL(`${request.nextUrl.origin}/auth/callback-success`);
  redirectUrl.searchParams.set("code", code);

  return NextResponse.redirect(redirectUrl);
}
