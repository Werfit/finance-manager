"use client";

import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { forwardRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/utils/cn.util";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "suffix"
>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <Input
        {...props}
        className={cn("flex items-center pr-0", className)}
        ref={ref}
        type={isVisible ? "text" : "password"}
        suffix={
          isVisible ? (
            <Button
              size="icon"
              type="button"
              variant="flat"
              className="text-muted-foreground hover:text-inherit"
              onClick={() => setIsVisible(false)}
            >
              <EyeClosedIcon />
            </Button>
          ) : (
            <Button
              size="icon"
              type="button"
              variant="flat"
              className="text-muted-foreground hover:text-inherit"
              onClick={() => setIsVisible(true)}
            >
              <EyeIcon />
            </Button>
          )
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
