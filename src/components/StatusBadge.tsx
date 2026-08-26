import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<Order["status"], string> = {
  paid: "bg-status-paid-bg text-status-paid",
  pending: "bg-status-pending-bg text-status-pending",
  expired: "bg-status-expired-bg text-status-expired",
  cancelled: "bg-status-cancelled-bg text-status-cancelled",
};

export default function StatusBadge({ status }: { status: Order["status"] }) {
  const t = useTranslations("OrderStatus");

  return (
    <Badge
      className={cn(
        "gap-1.5 px-3 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {t(status)}
    </Badge>
  );
}
