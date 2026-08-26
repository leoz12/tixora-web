import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TicketSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <Skeleton className="mx-auto mb-6 h-16 w-16 rounded-full" />
      <Skeleton className="mx-auto h-8 w-48" />
      <Skeleton className="mx-auto mt-3 mb-8 h-4 w-64" />

      <Card className="mx-6 gap-0 py-0 text-left card-shadow-lg sm:mx-10">
        <div className="space-y-3 p-6">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="ticket-notch" />
        <div className="p-6">
          <Skeleton className="h-4 w-full" />
        </div>
      </Card>
    </div>
  );
}
