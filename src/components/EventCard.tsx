import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Event } from "@/types";
import { formatPrice, cn, IMAGE_PLACEHOLDER } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
  canPurchase: boolean;
  priority?: boolean;
}

export default function EventCard({
  event,
  canPurchase,
  priority,
}: EventCardProps) {
  const t = useTranslations("EventCard");
  const common = useTranslations("Common");
  const sellingFast =
    event.total_tickets > 0 &&
    event.available_tickets / event.total_tickets < 0.15 &&
    event.available_tickets > 0;
  const soldOut = event.available_tickets <= 0;

  return (
    <Card className="group gap-0 py-0 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full bg-surface-alt">
        <Image
          src={event.image_url || IMAGE_PLACEHOLDER}
          alt={event.title}
          fill
          className={cn("object-cover", soldOut && "grayscale")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
        <Badge className="absolute top-3 left-3 bg-white/95 px-3 py-1 text-[11px] font-semibold text-blue-700 shadow-sm">
          {event.category.name}
        </Badge>
        {(sellingFast || soldOut) && (
          <Badge
            className={cn(
              "absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm",
              soldOut ? "bg-ink-500" : "bg-amber-600",
            )}
          >
            {soldOut ? t("soldOut") : t("sellingFast")}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-lg font-bold text-ink-900">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{event.location}</p>
        <p className="mt-0.5 text-sm text-ink-500">
          {dayjs(event.event_date).format("D MMMM YYYY · HH:mm")}
        </p>

        <div className="mt-2 text-sm">
          <span
            className={cn(
              "font-semibold",
              sellingFast || soldOut ? "text-amber-700" : "text-ink-500",
            )}
          >
            {common("ticketsLeft", { count: event.available_tickets })}
          </span>
          <span className="ml-2 text-ink-400">
            {common("ofTotal", { total: event.total_tickets })}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="text-xl font-extrabold text-green-700">
            {formatPrice(event.price)}
          </span>
        </div>

        {soldOut ? (
          <Button variant="secondary" disabled fullWidth className="mt-3">
            {t("soldOut")}
          </Button>
        ) : canPurchase ? (
          <Link href={`/events/${event.id}`} className="mt-3">
            <Button variant="primary" fullWidth>
              {t("bookNow")}
            </Button>
          </Link>
        ) : (
          <Link href="/login" className="mt-3">
            <Button variant="secondary" fullWidth>
              {t("signInToBook")}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
