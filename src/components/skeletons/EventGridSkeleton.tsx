import EventCardSkeleton from "./EventCardSkeleton";

interface EventGridSkeletonProps {
  count?: number;
}

export default function EventGridSkeleton({
  count = 6,
}: EventGridSkeletonProps) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
