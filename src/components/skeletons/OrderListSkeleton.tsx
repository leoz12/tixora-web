import OrderCardSkeleton from "./OrderCardSkeleton";

interface OrderListSkeletonProps {
  count?: number;
}

export default function OrderListSkeleton({
  count = 4,
}: OrderListSkeletonProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}
