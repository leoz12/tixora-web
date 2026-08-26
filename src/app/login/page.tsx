"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/auth.store";
import { initiateGoogleLogin } from "@/lib/auth";
import GoogleIcon from "@/components/icons/GoogleIcon";
import LoginIllustration from "@/components/login/LoginIllustration";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const ERROR_KEYS: Record<string, "errorNoCode" | "errorAuthFailed" | "errorMissingData" | "errorInvalidData"> = {
  no_code: "errorNoCode",
  auth_failed: "errorAuthFailed",
  missing_data: "errorMissingData",
  invalid_data: "errorInvalidData",
};

function LoginError() {
  const t = useTranslations("LoginPage");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  const message = t(ERROR_KEYS[error] ?? "errorGeneric");

  return (
    <Alert variant="destructive" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm">
      {message}
    </Alert>
  );
}

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Auth status comes from an async /auth/me call (see AuthHydrator) - render
  // nothing until it resolves, so an already-logged-in visitor never sees the
  // login form flash before the redirect above fires.
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner label={t("checkingSession")} />
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Illustration side */}
      <div className="hero-blue relative hidden overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12 lg:py-16">
        <div className="flex-1" />
        <LoginIllustration />
        <div className="flex-1" />
        <div className="mb-4 text-center">
          <p className="text-2xl font-extrabold text-white">Tixora</p>
          <p className="mt-2 max-w-xs text-sm text-blue-100">
            {t("heroTagline")}
          </p>
        </div>
      </div>

      {/* Compact illustration banner for mobile */}
      <div className="hero-blue relative flex flex-col items-center justify-center overflow-hidden px-4 pb-10 pt-10 lg:hidden">
        <p className="text-2xl font-extrabold text-white">Tixora</p>
        <div className="mt-4 h-48 w-full">
          <LoginIllustration variant="mobile" />
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-ink-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("subtitle")}</p>

          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginError />
            </Suspense>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={initiateGoogleLogin}
              className="border-line bg-white text-ink-700 shadow-sm hover:bg-surface-alt"
            >
              <GoogleIcon className="h-5 w-5" />
              {t("signInWithGoogle")}
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-ink-400">
            {t("agreementPrefix")}{" "}
            <a href="/terms" className="underline hover:text-ink-700">
              {t("termsLink")}
            </a>{" "}
            {t("and")}{" "}
            <a href="/privacy" className="underline hover:text-ink-700">
              {t("privacyLink")}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
