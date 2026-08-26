import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-9 w-32" />

      <Card className="mb-6 px-6 py-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <Card className="px-6 py-6 text-center">
          <Skeleton className="mx-auto mb-2 h-3 w-20" />
          <Skeleton className="mx-auto h-8 w-12" />
        </Card>
        <Card className="px-6 py-6 text-center">
          <Skeleton className="mx-auto mb-2 h-3 w-20" />
          <Skeleton className="mx-auto h-8 w-16" />
        </Card>
      </div>

      <Card className="mb-6 px-6 py-6">
        <Skeleton className="mb-3 h-3 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Card>
    </div>
  );
}
