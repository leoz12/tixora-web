import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms & Conditions | Tixora",
  description: "The terms governing ticket purchases on Tixora",
};

export default async function TermsPage() {
  const t = await getTranslations("TermsPage");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Card className="px-8 py-8 sm:px-10 sm:py-10">
        <h1 className="mb-6 text-3xl font-extrabold text-ink-900">
          {t("title")}
        </h1>
        <div className="space-y-4 text-ink-700">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </Card>
    </div>
  );
}
