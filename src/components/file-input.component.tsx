"use client";

import { FileIcon, UploadIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { Button } from "./ui/button";

type FileInputProps = {
  value?: File;
  onChange?: (file: File | null) => void;
} & Omit<React.ComponentProps<"input">, "onChange" | "value">;

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
      <>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          {...props}
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onChange?.(file);
            } else {
              onChange?.(null);
            }
          }}
        />

        <Button
          type="button"
          variant="outline"
          className="text-muted-foreground h-20 w-full flex-col items-center justify-center gap-1"
          onClick={() => inputRef.current?.click()}
        >
          {!value ? (
            <>
              <UploadIcon className="!size-8" />
              <small className="text-muted-foreground font-bold">Upload</small>
            </>
          ) : (
            <>
              <FileIcon className="!size-8" />
              <small className="text-muted-foreground font-bold">
                {value.name}
              </small>
            </>
          )}
        </Button>
      </>
    );
  }
);

FileInput.displayName = "FileInput";
