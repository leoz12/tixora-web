"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth.store";
import { Spinner } from "@/components/ui/spinner";
import { User } from "@/types";

function CallbackSuccessContent() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const exchanged = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.push("/login?error=missing_data");
      return;
    }

    // Effects can run twice in dev (StrictMode) - the code is single-use, so
    // guard against exchanging it a second time.
    if (exchanged.current) return;
    exchanged.current = true;

    // A real browser request, straight to the backend's own origin, so the
    // Set-Cookie response it returns is correctly scoped there.
    api
      .post<{ data: { user: User } }>("/auth/oauth/google/callback", { code })
      .then((response) => {
        setUser(response.data.data.user);
        router.push("/");
      })
      .catch((error) => {
        console.error("Failed to exchange OAuth code:", error);
        router.push("/login?error=auth_failed");
      });
  }, [searchParams, setUser, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner label={t("signingIn")} />
    </div>
  );
}

function CallbackSuccessFallback() {
  const t = useTranslations("LoginPage");
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner label={t("signingIn")} />
    </div>
  );
}

export default function CallbackSuccessPage() {
  return (
    <Suspense fallback={<CallbackSuccessFallback />}>
      <CallbackSuccessContent />
    </Suspense>
  );
}
