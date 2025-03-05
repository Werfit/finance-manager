"use client";

import { RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="absolute top-1/2 left-1/2 flex w-sm -translate-1/2 flex-col items-center justify-center gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          It is likely happened due to the prediction API VPS. Try again in a
          minute. If the problem still persists, contact the developer
        </p>
      </div>
      <p className=""></p>
      <Button
        className="flex w-full items-center gap-1"
        onClick={() => reset()}
        size="lg"
      >
        <RotateCcwIcon /> Try again
      </Button>
    </div>
  );
}
