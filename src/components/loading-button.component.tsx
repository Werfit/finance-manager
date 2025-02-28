"use client";
import { forwardRef, useEffect, useState } from "react";

import { cn } from "@/shared/utils/cn.util";

import { Spinner } from "./spinner.component";
import { Button } from "./ui/button";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
};

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, onClick, loading, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (loading !== undefined) {
        setIsLoading(loading);
      }
    }, [loading]);

    return (
      <Button
        {...props}
        ref={ref}
        className={cn(className)}
        onClick={async (event) => {
          const timeout = setTimeout(async () => {
            setIsLoading(true);
          }, 200);

          await Promise.resolve(onClick?.(event)).then(() => {
            clearTimeout(timeout);
            setIsLoading(false);
          });
        }}
      >
        {isLoading ? <Spinner /> : children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
