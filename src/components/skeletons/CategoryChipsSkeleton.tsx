import { Skeleton } from "@/components/ui/skeleton";

const CHIP_WIDTHS = ["w-14", "w-20", "w-16", "w-24", "w-16", "w-20"];

export default function CategoryChipsSkeleton() {
  return (
    <div className="flex gap-2">
      {CHIP_WIDTHS.map((width, i) => (
        <Skeleton key={i} className={`h-8 shrink-0 rounded-full ${width}`} />
      ))}
    </div>
  );
}
