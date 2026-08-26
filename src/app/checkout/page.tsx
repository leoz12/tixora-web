import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import CheckoutPageClient from "@/components/pages/CheckoutPageClient";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Checkout | Tixora",
  description: "Complete your ticket purchase",
};

export default async function CheckoutPage() {
  const t = await getTranslations("CheckoutLoading");

  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="py-24">
            <Spinner label={t("loadingCheckout")} />
          </div>
        }
      >
        <CheckoutPageClient />
      </Suspense>
    </ProtectedRoute>
  );
}
