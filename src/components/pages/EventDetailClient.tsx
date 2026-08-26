"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEventDetail } from "@/lib/queries/events";
import { useAuthStore } from "@/lib/store/auth.store";
import { formatPrice, cn, IMAGE_PLACEHOLDER } from "@/lib/utils";
import EventDetailSkeleton from "@/components/skeletons/EventDetailSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventDetailClientProps {
  eventId: string;
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
    >
      &larr; {label}
    </Link>
  );
}

export default function EventDetailClient({
  eventId,
}: EventDetailClientProps) {
  const t = useTranslations("EventDetailPage");
  const common = useTranslations("Common");
  const { isAuthenticated } = useAuthStore();
  const { data: event, isLoading, isError, error } = useEventDetail(eventId);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <BackLink href="/" label={t("backToEvents")} />
        <p className="mt-4 text-red-600">
          {error?.message ?? t("errorFallback")}
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <BackLink href="/" label={t("backToEvents")} />
        <p className="mt-6 text-center text-xl text-ink-500">
          {t("notFound")}
        </p>
      </div>
    );
  }

  const soldOut = event.available_tickets <= 0;
  const lowAvailability =
    !soldOut &&
    event.total_tickets > 0 &&
    event.available_tickets / event.total_tickets < 0.15;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <BackLink href="/" label={t("backToEvents")} />

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Card className="relative h-64 w-full gap-0 bg-surface-alt py-0 sm:h-96">
            <Image
              src={event.image_url || IMAGE_PLACEHOLDER}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <Badge className="absolute top-4 left-4 bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              {event.category.name}
            </Badge>
          </Card>

          <h1 className="mt-6 text-3xl font-extrabold text-ink-900 sm:text-4xl">
            {event.title}
          </h1>

          <dl className="mt-5 grid grid-cols-1 gap-3 border-y border-line py-5 text-sm sm:grid-cols-2">
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 font-semibold text-ink-400">
                {t("venue")}
              </dt>
              <dd className="text-ink-700">{event.location}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 font-semibold text-ink-400">
                {t("date")}
              </dt>
              <dd className="text-ink-700">
                {dayjs(event.event_date).format("dddd, D MMMM YYYY · HH:mm")}
              </dd>
            </div>
          </dl>

          <p className="mt-5 whitespace-pre-line text-ink-700">
            {event.description}
          </p>
        </div>

        <div>
          <Card className="sticky top-24 card-shadow-lg px-6 py-6">
            <div className="text-sm">
              <span
                className={cn(
                  "font-semibold",
                  lowAvailability ? "text-amber-700" : "text-ink-500",
                )}
              >
                {common("ticketsLeft", { count: event.available_tickets })}
              </span>
              <span className="ml-2 text-ink-400">
                {common("ofTotal", { total: event.total_tickets })}
              </span>
            </div>

            <div className="mt-2 text-3xl font-extrabold text-green-700">
              {formatPrice(event.price)}
            </div>
            <p className="text-sm text-ink-400">{t("perTicket")}</p>

            <div className="mt-6">
              {soldOut ? (
                <Button variant="secondary" fullWidth disabled>
                  {t("soldOut")}
                </Button>
              ) : isAuthenticated ? (
                <Link href={`/checkout?eventId=${event.id}`}>
                  <Button variant="primary" fullWidth>
                    {t("bookNow")}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="secondary" fullWidth>
                    {t("signInToBook")}
                  </Button>
                </Link>
              )}
            </div>

            <p className="mt-4 text-xs text-ink-400">{t("bookingNotice")}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
