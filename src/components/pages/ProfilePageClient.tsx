"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/auth.store";
import { logoutRequest } from "@/lib/auth";
import { useUserStats } from "@/lib/queries/users";
import { formatPrice } from "@/lib/utils";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePageClient() {
  const t = useTranslations("ProfilePage");
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: stats, isLoading: isStatsLoading } = useUserStats(!!user);

  const handleLogout = async () => {
    await logoutRequest();
    logout();
    router.push("/");
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  const initial = user.name?.charAt(0).toUpperCase() ?? "?";
  const totalOrders = stats?.total_orders ?? user.total_orders;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold text-ink-900 sm:text-4xl">
        {t("title")}
      </h1>

      <Card className="mb-6 px-6 py-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 ring-4 ring-blue-100 after:hidden">
            {user.avatar_url && (
              <AvatarImage src={user.avatar_url} alt={user.name} />
            )}
            <AvatarFallback
              delay={user.avatar_url ? 400 : 0}
              className="bg-blue-600 text-3xl font-bold text-white"
            >
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold text-ink-900">
              {user.name}
            </h2>
            <p className="truncate text-ink-500">{user.email}</p>
            {user.created_at && (
              <p className="mt-1 text-sm text-ink-400">
                {t("joined", {
                  date: dayjs(user.created_at).format("D MMMM YYYY"),
                })}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <Card className="px-6 py-6 text-center">
          <p className="mb-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">
            {t("totalOrders")}
          </p>
          {isStatsLoading && totalOrders === undefined ? (
            <Skeleton className="mx-auto h-8 w-12" />
          ) : (
            <p className="text-3xl font-extrabold text-blue-700">
              {totalOrders ?? 0}
            </p>
          )}
        </Card>
        <Card className="px-6 py-6 text-center">
          <p className="mb-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">
            {t("totalSpent")}
          </p>
          {isStatsLoading ? (
            <Skeleton className="mx-auto h-8 w-20" />
          ) : (
            <p className="text-xl font-extrabold text-green-700 sm:text-3xl">
              {formatPrice(stats?.total_spent ?? 0)}
            </p>
          )}
        </Card>
      </div>

      <Card className="mb-6 px-6 py-6">
        <h3 className="mb-3 text-xs font-semibold tracking-wide text-blue-700 uppercase">
          {t("quickLinks")}
        </h3>
        <div className="flex flex-col gap-2">
          <Link
            href="/orders"
            className="text-sm text-ink-700 hover:text-blue-700"
          >
            {t("viewOrderHistory")}
          </Link>
          <Link href="/" className="text-sm text-ink-700 hover:text-blue-700">
            {t("browseEvents")}
          </Link>
        </div>
      </Card>

      <Button variant="danger" fullWidth onClick={handleLogout}>
        {t("logout")}
      </Button>
    </div>
  );
}
