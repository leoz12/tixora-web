import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function EventCardSkeleton() {
  return (
    <Card className="gap-0 py-0">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-2 h-7 w-1/3" />
        <Skeleton className="mt-3 h-10 w-full rounded-xl" />
      </div>
    </Card>
  );
}
