import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/store/auth.store";
import { hardNavigate } from "@/lib/navigate";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Auth is httpOnly cookies now, not a header - the browser needs to be
  // told to actually send/accept them on cross-origin requests.
  withCredentials: true,
});

// CSRF is enforced server-side by an Origin/Referer allowlist (the SPA and API
// are on different registrable domains, so a double-submit cookie could never
// work — JS here can't read the API's cookie). Nothing to send from here beyond
// the credentialed cookies; `withCredentials: true` covers it.

// A burst of concurrent requests that all hit a 401 (expired access token)
// should trigger exactly one /auth/refresh call, not one per request.
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Response interceptor - transparently refresh an expired access token once,
// then fall back to logging out. Only /auth/refresh itself is excluded from
// the retry (its own 401 must not trigger another refresh attempt, or it'd
// loop). /auth/me DOES go through the refresh attempt below - it's the
// endpoint every page load uses to check "who's logged in", so a 401 there
// is usually just an expired access token that a valid refresh token can
// still recover, not necessarily a logged-out visitor. It still must not
// force a redirect to /login when refresh fails, though, since that's also
// the normal 401 an anonymous visitor gets.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const url = originalRequest?.url ?? "";
    const isAuthCheck = url.includes("/auth/me");
    const isRefreshCall = url.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshCall
    ) {
      originalRequest._retry = true;

      const refreshed = await refreshSession();
      if (refreshed) {
        return api(originalRequest);
      }

      useAuthStore.getState().logout();

      if (
        !isAuthCheck &&
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        // Hard navigation (not router.push) is intentional here: this runs
        // outside the React tree (an axios interceptor), and we want a full
        // reload to guarantee all in-memory query/auth state is cleared.
        hardNavigate("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
