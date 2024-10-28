import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200",
        secondary:
          "border-gray-400 bg-gray-50 text-gray-600 hover:bg-gray-100",
        destructive:
          "border-red-300 bg-red-100 text-red-700 hover:bg-red-200",
        outline: "border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
