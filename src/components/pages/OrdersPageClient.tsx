"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOrders } from "@/lib/queries/orders";
import OrderCard from "@/components/OrderCard";
import OrderListSkeleton from "@/components/skeletons/OrderListSkeleton";
import NumberedPagination from "@/components/NumberedPagination";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type StatusFilter = "all" | "pending" | "paid" | "expired" | "cancelled";

const FILTER_VALUES: StatusFilter[] = [
  "all",
  "pending",
  "paid",
  "expired",
  "cancelled",
];

export default function OrdersPageClient() {
  const t = useTranslations("OrdersPage");
  const common = useTranslations("Common");
  const statusLabels = useTranslations("OrderStatus");

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, isError, error } = useOrders(
    page,
    statusFilter === "all" ? undefined : statusFilter,
  );

  const handleFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold text-ink-900 sm:text-4xl">
        {t("title")}
      </h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_VALUES.map((value) => (
          <Button
            key={value}
            variant={statusFilter === value ? "outline" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange(value)}
            className={cn(
              "rounded-full",
              statusFilter !== value && "bg-surface-sunken text-ink-500",
            )}
          >
            {statusLabels(value)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <OrderListSkeleton />
      ) : isError ? (
        <p className="text-red-600">
          {error?.message ?? t("errorFallback")}
        </p>
      ) : data?.data.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-xl font-semibold text-ink-700">
            {t("noOrdersYet")}
          </p>
          <p className="mt-1 text-sm text-ink-500">{t("bookEventHint")}</p>
        </div>
      ) : (
        <div className="mb-8 flex flex-col gap-4">
          {data?.data.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      )}

      {data && data.pagination.total_pages > 1 && (
        <NumberedPagination
          page={page}
          totalPages={data.pagination.total_pages}
          onPageChange={setPage}
          prevLabel={common("prev")}
          nextLabel={common("next")}
        />
      )}
    </div>
  );
}
