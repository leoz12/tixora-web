import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function OrderCardSkeleton() {
  return (
    <Card className="flex-row gap-4 p-4">
      <Skeleton className="h-16 w-16 flex-shrink-0 rounded-xl sm:h-24 sm:w-24" />

      <div className="min-w-0 flex-1 border-l border-line pl-4">
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/4" />
        <Skeleton className="mt-3 h-4 w-24" />
      </div>
    </Card>
  );
}
