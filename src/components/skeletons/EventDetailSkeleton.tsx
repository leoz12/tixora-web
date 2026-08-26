import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function EventDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-32" />

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Skeleton className="h-64 w-full rounded-2xl sm:h-96" />
          <Skeleton className="mt-6 h-9 w-4/5" />

          <div className="mt-5 grid grid-cols-1 gap-3 border-y border-line py-5 sm:grid-cols-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div>
          <Card className="card-shadow-lg px-6 py-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-9 w-32" />
            <Skeleton className="mt-2 h-3 w-16" />
            <Skeleton className="mt-6 h-11 w-full rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}
