"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import dayjs from "dayjs";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  useCancelOrder,
  useContinuePayment,
  useDownloadTicket,
  useOrderDetail,
} from "@/lib/queries/orders";
import { orderKeys } from "@/lib/queries/queryKeys";
import { formatPrice, IMAGE_PLACEHOLDER } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import OrderDetailSkeleton from "@/components/skeletons/OrderDetailSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderDetailPageClientProps {
  orderId: string;
}

const SNAP_JS_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_SANDBOX === "false"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-6 px-5 py-5">
      <h3 className="mb-4 text-xs font-semibold tracking-wide text-blue-700 uppercase">
        {title}
      </h3>
      {children}
    </Card>
  );
}

export default function OrderDetailPageClient({
  orderId,
}: OrderDetailPageClientProps) {
  const t = useTranslations("OrderDetailPage");
  const common = useTranslations("Common");
  const { data: order, isLoading, isError, error } = useOrderDetail(orderId);
  const cancelOrder = useCancelOrder();
  const continuePayment = useContinuePayment();
  const downloadTicket = useDownloadTicket();
  const queryClient = useQueryClient();
  const [isPaying, setIsPaying] = useState(false);

  const openSnapPopup = (snapToken: string) => {
    if (!window.snap) {
      toast.error(t("paymentPopupFailed"));
      return;
    }

    const refreshOrder = () => {
      setIsPaying(false);
      void queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    };

    setIsPaying(true);
    window.snap.pay(snapToken, {
      onSuccess: refreshOrder,
      onPending: refreshOrder,
      onError: () => {
        setIsPaying(false);
        toast.error(t("paymentFailed"));
      },
      onClose: refreshOrder,
    });
  };

  const handleContinuePayment = () => {
    if (!order) return;
    continuePayment.mutate(order.order_id, {
      onSuccess: (data) => openSnapPopup(data.snap_token),
    });
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  // Backend returns 403/404 for orders that don't belong to the caller;
  // surface it as a generic error instead of leaking existence of the order.
  if (isError || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          &larr; {t("backToOrders")}
        </Link>
        <p className="mt-4 text-red-600">
          {isError
            ? (error?.message ?? t("errorFallback"))
            : t("orderNotFound")}
        </p>
      </div>
    );
  }

  const unitPrice = order.unit_price ?? order.total_price / order.quantity;
  const subtotal = unitPrice * order.quantity;
  const adminFee = order.admin_fee ?? order.total_price - subtotal;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Script
        src={SNAP_JS_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <Link
        href="/orders"
        className="mb-6 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        &larr; {t("backToOrders")}
      </Link>

      <div className="mb-6 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">
            {t("orderNumber", { orderId: order.order_id })}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {t("purchasedOn", {
              date: dayjs(order.purchased_at).format("D MMMM YYYY · HH:mm"),
            })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Event info */}
      <Card className="mb-6 flex-row gap-4 p-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-surface-alt">
          <Image
            src={order.event_image || IMAGE_PLACEHOLDER}
            alt={order.event_title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div>
          <h2 className="font-bold text-ink-900">{order.event_title}</h2>
          {order.event_date && (
            <p className="text-sm text-ink-500">
              {dayjs(order.event_date).format("dddd, D MMMM YYYY · HH:mm")}
            </p>
          )}
          {order.event_location && (
            <p className="text-sm text-ink-500">{order.event_location}</p>
          )}
        </div>
      </Card>

      <InfoSection title={t("ticketSection")}>
        <div className="space-y-2 text-sm text-ink-700">
          <div className="flex justify-between">
            <span>{t("referenceNumber")}</span>
            <span className="font-mono text-ink-900">
              {order.ticket_reference}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("quantity")}</span>
            <span className="text-ink-900">{order.quantity}</span>
          </div>
        </div>
      </InfoSection>

      <InfoSection title={t("priceBreakdown")}>
        <div className="space-y-2 text-sm text-ink-700">
          <div className="flex justify-between">
            <span>{t("unitPrice")}</span>
            <span className="text-ink-900">{formatPrice(unitPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("qty")}</span>
            <span className="text-ink-900">{order.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span className="text-ink-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("adminFee")}</span>
            <span className="text-ink-900">{formatPrice(adminFee)}</span>
          </div>
          <div className="my-1 border-t border-dashed border-line" />
          <div className="flex justify-between pt-1 text-lg font-bold">
            <span className="text-ink-900">{t("total")}</span>
            <span className="text-green-700">
              {formatPrice(order.total_price)}
            </span>
          </div>
        </div>
      </InfoSection>

      {/* Buyer & payment info */}
      {(order.buyer_name || order.buyer_email || order.payment_method) && (
        <InfoSection title={t("buyerAndPayment")}>
          <div className="space-y-2 text-sm text-ink-700">
            {order.buyer_name && (
              <div className="flex justify-between">
                <span>{t("name")}</span>
                <span className="text-ink-900">{order.buyer_name}</span>
              </div>
            )}
            {order.buyer_email && (
              <div className="flex justify-between">
                <span>{t("email")}</span>
                <span className="text-ink-900">{order.buyer_email}</span>
              </div>
            )}
            {order.payment_method && (
              <div className="flex justify-between">
                <span>{t("paymentMethod")}</span>
                <span className="text-ink-900">{order.payment_method}</span>
              </div>
            )}
          </div>
        </InfoSection>
      )}

      {order.status === "paid" && (
        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={downloadTicket.isPending}
          onClick={() => downloadTicket.mutate(order.order_id)}
        >
          {downloadTicket.isPending
            ? common("processing")
            : t("downloadTicket")}
        </Button>
      )}

      {order.status === "pending" && (
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleContinuePayment}
            disabled={continuePayment.isPending || isPaying}
          >
            {continuePayment.isPending || isPaying
              ? common("processing")
              : t("continuePayment")}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={<Button type="button" variant="danger" fullWidth />}
            >
              {t("cancelOrder")}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("cancelOrder")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("cancelOrderDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="secondary">
                  {t("keepOrder")}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="danger"
                  disabled={cancelOrder.isPending}
                  onClick={() => cancelOrder.mutate(order.order_id)}
                >
                  {cancelOrder.isPending ? t("cancelling") : t("confirmCancel")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
