import Link from "next/link";
import { TicketX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <Card className="flex flex-col items-center gap-4 p-10">
        <div className="flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <TicketX className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900">{t("title")}</h1>
        <p className="text-ink-500">{t("description")}</p>
        <Button
          variant="primary"
          render={<Link href="/" />}
          nativeButton={false}
          className="mt-2"
        >
          {t("backHome")}
        </Button>
      </Card>
    </div>
  );
}
