import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function OrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-28" />

      <div className="mb-6 flex items-start justify-between gap-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <Card className="mb-6 flex-row gap-4 p-4">
        <Skeleton className="h-24 w-24 flex-shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>

      {[0, 1].map((i) => (
        <Card key={i} className="mb-6 px-5 py-5">
          <Skeleton className="mb-4 h-3 w-20" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}

      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
