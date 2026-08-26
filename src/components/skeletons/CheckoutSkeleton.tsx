import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 mb-8 h-9 w-64" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="px-5 py-5">
            <Skeleton className="mb-4 h-4 w-24" />
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 flex-shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>

          <Card className="px-5 py-5">
            <Skeleton className="mb-4 h-4 w-32" />
            <Skeleton className="h-10 w-full max-w-xs" />
          </Card>
        </div>

        <Card className="card-shadow-lg px-5 py-5">
          <Skeleton className="mb-4 h-3 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="mt-6 h-11 w-full rounded-xl" />
        </Card>
      </div>
    </div>
  );
}
