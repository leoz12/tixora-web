import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Order } from "@/types";
import { formatPrice, IMAGE_PLACEHOLDER } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations("OrderCard");

  return (
    <Link href={`/orders/${order.order_id}`}>
      <Card className="flex-row gap-4 p-4 transition-transform hover:-translate-y-0.5 hover:shadow-lg">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-alt sm:h-24 sm:w-24">
          <Image
            src={order.event_image || IMAGE_PLACEHOLDER}
            alt={order.event_title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 64px, 96px"
          />
        </div>

        <div className="min-w-0 flex-1 border-l border-line pl-4">
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:justify-between sm:gap-2">
            <h3 className="line-clamp-2 text-lg font-bold text-ink-900">
              {order.event_title}
            </h3>
            <StatusBadge status={order.status} />
          </div>

          <p className="mt-1 text-sm text-ink-500">
            {dayjs(order.purchased_at).format("D MMMM YYYY · HH:mm")}
          </p>

          <div className="mt-2 flex items-center gap-4 text-sm text-ink-500">
            <span>{t("qty", { quantity: order.quantity })}</span>
            <span className="font-bold text-green-700">
              {formatPrice(order.total_price)}
            </span>
          </div>

          <span className="mt-3 inline-block text-sm font-semibold text-blue-700">
            {t("viewDetails")}
          </span>
        </div>
      </Card>
    </Link>
  );
}
