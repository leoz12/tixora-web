import api from "@/lib/api";
import { hardNavigate } from "@/lib/navigate";

// Revokes the refresh token server-side. Best-effort - the caller clears
// local auth state regardless of whether this succeeds.
export async function logoutRequest(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Failed to revoke session:", error);
  }
}

export function initiateGoogleLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error(
      "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID or NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI",
    );
    return;
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", "openid email profile");

  hardNavigate(authUrl.toString());
}
