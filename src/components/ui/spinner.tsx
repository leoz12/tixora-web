import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  label?: string;
}

function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3" role="status">
      <span
        className={cn(
          "h-6 w-6 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600",
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { Spinner };
