"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useEventDetail } from "@/lib/queries/events";
import { useCreateOrder } from "@/lib/queries/orders";
import { useAuthStore } from "@/lib/store/auth.store";
import { formatPrice, IMAGE_PLACEHOLDER } from "@/lib/utils";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SNAP_JS_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_SANDBOX === "false"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
        {n}
      </span>
      <p className="text-sm font-semibold text-ink-900">{label}</p>
    </div>
  );
}

export default function CheckoutPageClient() {
  const t = useTranslations("CheckoutPage");
  const common = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") ?? "";

  const { user } = useAuthStore();
  const { data: event, isLoading, isError, error } = useEventDetail(eventId);
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [quantity, setQuantity] = useState(1);
  const [isPaying, setIsPaying] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () =>
    setQuantity((q) => Math.min(event?.available_tickets ?? q + 1, q + 1));

  const openSnapPopup = (orderId: string, snapToken: string) => {
    if (!window.snap) {
      toast.error(t("paymentPopupFailed"));
      return;
    }

    setIsPaying(true);
    window.snap.pay(snapToken, {
      onSuccess: () => router.push(`/checkout/success?order_id=${orderId}`),
      onPending: () => router.push(`/checkout/success?order_id=${orderId}`),
      onError: () => {
        setIsPaying(false);
        toast.error(t("paymentFailed"));
      },
      onClose: () => setIsPaying(false),
    });
  };

  const handleProceedToPayment = () => {
    if (!event || !user) return;

    const trimmedName = buyerName.trim();
    const trimmedEmail = buyerEmail.trim();

    if (trimmedName.length < 3) {
      toast.error(t("buyerNameInvalid"));
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      toast.error(t("buyerEmailInvalid"));
      return;
    }

    createOrder(
      {
        event_id: event.id,
        quantity,
        buyer_email: trimmedEmail,
        buyer_name: trimmedName,
      },
      {
        onSuccess: (data) => openSnapPopup(data.order_id, data.snap_token),
      },
    );
  };

  if (isLoading || !user) {
    return <CheckoutSkeleton />;
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          &larr; {t("backToEvents")}
        </Link>
        <p className="mt-4 text-red-600">
          {isError
            ? (error?.message ?? t("errorFallback"))
            : t("eventNotFound")}
        </p>
      </div>
    );
  }

  if (event.available_tickets <= 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-xl text-ink-500">
          {t("eventSoldOut", { title: event.title })}
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          &larr; {t("backToEvents")}
        </Link>
      </div>
    );
  }

  const unitPrice = event.price;
  const subtotal = unitPrice * quantity;
  const adminFee = event.admin_fee;
  const total = subtotal + adminFee;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Script
        src={SNAP_JS_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <Link
        href={`/events/${event.id}`}
        className="text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        &larr; {t("backToEvent")}
      </Link>

      <h1 className="mt-4 mb-8 text-3xl font-extrabold text-ink-900">
        {t("title")}
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="px-5 py-5">
            <StepLabel n={1} label={t("stepEvent")} />
            <div className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                <Image
                  src={event.image_url || IMAGE_PLACEHOLDER}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div>
                <h2 className="font-bold text-ink-900">{event.title}</h2>
                <p className="text-sm text-ink-500">
                  {dayjs(event.event_date).format("dddd, D MMMM YYYY · HH:mm")}
                </p>
              </div>
            </div>
          </Card>

          <Card className="px-5 py-5">
            <StepLabel n={2} label={t("stepBuyerInfo")} />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="buyer-name">{t("buyerNameLabel")}</Label>
                <Input
                  id="buyer-name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder={t("buyerNamePlaceholder")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="buyer-email">{t("buyerEmailLabel")}</Label>
                <Input
                  id="buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder={t("buyerEmailPlaceholder")}
                />
              </div>
            </div>
          </Card>

          <Card className="px-5 py-5">
            <StepLabel n={3} label={t("stepQuantity")} />
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="border border-line text-ink-700"
              >
                &minus;
              </Button>
              <span className="w-8 text-center text-lg font-bold text-ink-900">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleIncrease}
                disabled={quantity >= event.available_tickets}
                className="border border-line text-ink-700"
              >
                +
              </Button>
              <span className="text-sm text-ink-400">
                {t("available", { count: event.available_tickets })}
              </span>
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 card-shadow-lg px-5 py-5">
            <p className="mb-4 text-xs font-semibold tracking-wide text-ink-400 uppercase">
              {t("priceAndPayment")}
            </p>
            <div className="space-y-2 text-sm text-ink-700">
              <div className="flex justify-between">
                <span>{t("unitPrice")}</span>
                <span>{formatPrice(unitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("qty")}</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("adminFee")}</span>
                <span>{formatPrice(adminFee)}</span>
              </div>
              <div className="my-2 border-t border-dashed border-line" />
              <div className="flex justify-between pt-1 text-lg font-bold text-ink-900">
                <span>{t("total")}</span>
                <span className="text-green-700">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              className="mt-6"
              onClick={handleProceedToPayment}
              disabled={isPending || isPaying}
            >
              {isPending || isPaying
                ? common("processing")
                : t("proceedToPayment")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
