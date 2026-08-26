import { cookies } from "next/headers";
import { User } from "@/types";

// Runs during SSR so the server-rendered HTML already reflects the visitor's
// real auth state - no client round-trip, no header skeleton flash on
// refresh. Session cookies are httpOnly, so this is the only place (besides
// the backend itself) that can read them; the client never gets a copy.
export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // No cookies at all means no session - skip the network round trip
  // entirely for first-time/anonymous visitors.
  if (!cookieHeader) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const json = (await response.json()) as { data?: User | null };
    return json.data ?? null;
  } catch {
    // Backend unreachable/slow during SSR - fail open to "logged out" for
    // this render. AuthHydrator's client-side check still runs afterward
    // and will silently correct it if that guess was wrong.
    return null;
  }
}
