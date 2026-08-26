"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOrderDetail } from "@/lib/queries/orders";
import { formatPrice, cn } from "@/lib/utils";
import TicketSkeleton from "@/components/skeletons/TicketSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutSuccessClient() {
  const t = useTranslations("CheckoutSuccessPage");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";

  const { data: order, isLoading, isError } = useOrderDetail(orderId);

  if (!orderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-ink-900">
          {t("orderRefMissingTitle")}
        </h1>
        <p className="mt-2 mb-6 text-ink-500">{t("orderRefMissingDesc")}</p>
        <Link
          href="/orders"
          className="text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          {t("goToOrders")}
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <TicketSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-ink-900">
          {t("couldntConfirmTitle")}
        </h1>
        <p className="mt-2 mb-6 text-ink-500">{t("couldntConfirmDesc")}</p>
        <Link
          href="/orders"
          className="text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          {t("goToOrders")}
        </Link>
      </div>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div
        className={cn(
          "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl",
          isPaid
            ? "bg-status-paid-bg text-status-paid"
            : "bg-status-pending-bg text-status-pending",
        )}
      >
        {isPaid ? "✓" : "…"}
      </div>

      <h1 className="text-3xl font-extrabold text-ink-900">
        {isPaid ? t("paidTitle") : t("pendingTitle")}
      </h1>
      <p className="mt-2 mb-8 text-ink-500">
        {isPaid ? t("paidDesc") : t("pendingDesc")}
      </p>

      {/* E-ticket */}
      <Card className="mx-6 gap-0 py-0 text-left card-shadow-lg sm:mx-10">
        <div className="p-6">
          <p className="text-xs font-semibold tracking-wide text-ink-400 uppercase">
            {t("admitOne")}
          </p>
          <h2 className="mt-1 text-xl font-bold text-ink-900">
            {order.event_title}
          </h2>
          <div className="mt-4 flex justify-between text-sm text-ink-500">
            <span>{t("orderId")}</span>
            <span className="font-mono text-ink-900">{order.order_id}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-ink-500">
            <span>{t("quantity")}</span>
            <span className="text-ink-900">{order.quantity}</span>
          </div>
        </div>
        <div className="ticket-notch" />
        <div className="flex items-center justify-between p-6">
          <span className="text-xs font-semibold tracking-wide text-ink-400 uppercase">
            {t("totalPaid")}
          </span>
          <span className="text-xl font-bold text-green-700">
            {formatPrice(order.total_price)}
          </span>
        </div>
      </Card>

      <div className="mt-8 flex flex-col gap-3">
        <Link href={`/orders/${order.order_id}`}>
          <Button variant="primary" fullWidth>
            {t("viewOrderDetails")}
          </Button>
        </Link>
        <Link href="/" className="text-sm text-ink-500 hover:text-blue-700">
          {t("browseMoreEvents")}
        </Link>
      </div>
    </div>
  );
}
