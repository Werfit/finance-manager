import * as React from "react";

import { cn } from "@/shared/utils/cn.util";

type InputProps = React.ComponentProps<"input"> & {
  suffix?: React.ReactNode;
  inputClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suffix, inputClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "border-input placeholder:text-muted-foreground focus-within:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-within:ring-1 disabled:cursor-not-allowed md:text-sm",
          className
        )}
      >
        <input
          className={cn(
            "file:text-foreground w-full outline-hidden file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:opacity-50",
            inputClassName
          )}
          type={type}
          ref={ref}
          {...props}
        />
        {suffix}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
