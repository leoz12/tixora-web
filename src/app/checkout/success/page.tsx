import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import CheckoutSuccessClient from "@/components/pages/CheckoutSuccessClient";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Payment Success | Tixora",
  description: "Your ticket order confirmation",
};

export default async function CheckoutSuccessPage() {
  const t = await getTranslations("CheckoutLoading");

  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="py-24">
            <Spinner label={t("confirmingOrder")} />
          </div>
        }
      >
        <CheckoutSuccessClient />
      </Suspense>
    </ProtectedRoute>
  );
}
