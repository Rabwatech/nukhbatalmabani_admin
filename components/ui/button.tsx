import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-obsidian transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-desert-gold text-obsidian hover:bg-desert-gold/90",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-stone-gray/30 bg-obsidian/50 text-elegant-white hover:bg-stone-gray/20 hover:text-elegant-white",
        secondary: "bg-stone-gray/20 text-elegant-white hover:bg-stone-gray/30",
        ghost:
          "text-elegant-white hover:bg-stone-gray/20 hover:text-elegant-white",
        link: "text-desert-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
