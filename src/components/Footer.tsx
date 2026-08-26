import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-blue-950 py-12 text-on-blue-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              Tixora
            </p>
            <p className="mt-2 max-w-xs text-sm text-on-blue-faint">
              {t("tagline")}
            </p>
          </div>

          <div className="flex gap-6 text-sm font-medium sm:gap-10">
            <Link href="/about" className="hover:text-white">
              {t("about")}
            </Link>
            <Link href="/privacy" className="hover:text-white">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-white">
              {t("terms")}
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-on-blue-faint">
          {t("rights", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
