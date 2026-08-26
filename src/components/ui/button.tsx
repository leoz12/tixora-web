import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Variant names and their mapping follow DESIGN.md's Buttons spec:
 * primary = green (every buy/confirm action), secondary = white/blue outline,
 * danger = red (destructive), ghost = transparent low-emphasis.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none disabled:text-ink-400 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 disabled:bg-green-100",
        secondary:
          "border border-blue-200 bg-surface text-blue-700 hover:bg-blue-50 disabled:border-line disabled:bg-line-soft",
        danger:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:bg-red-100",
        ghost: "text-ink-500 hover:bg-surface-sunken disabled:bg-transparent",
        link: "text-blue-700 underline-offset-4 hover:underline",
        // Solid blue pill — the chip/pagination "active" treatment from
        // DESIGN.md's Primary color role, reused by ui/pagination.tsx.
        outline:
          "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-100",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-[0.8rem]",
        lg: "h-11 px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-9 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
