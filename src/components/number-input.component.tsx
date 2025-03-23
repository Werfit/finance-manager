import { forwardRef } from "react";

import { Input } from "./ui/input";

type NumberInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> & {
  value?: number | null;
  onChange?: (value: number | null) => void;
};

export const NumberInput: React.FC<NumberInputProps> = forwardRef<
  HTMLInputElement,
  NumberInputProps
>(({ value, onChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const cursorPosition = input.selectionStart || 0;
    const prevValue = input.value;

    // Remove all non-digit characters from input
    const rawValue = input.value.replace(/[^\d-]/g, "");

    if (rawValue === "" || rawValue === "-") {
      onChange?.(null);
      return;
    }

    const parsedValue = parseInt(rawValue, 10);
    if (!Number.isNaN(parsedValue)) {
      onChange?.(parsedValue);

      // Calculate new cursor position
      requestAnimationFrame(() => {
        const newValue = parsedValue.toLocaleString();
        const prevDigitsBeforeCursor = prevValue
          .slice(0, cursorPosition)
          .replace(/[^\d-]/g, "").length;
        let newCursorPosition = 0;
        let digitCount = 0;

        // Find position after the same number of digits in new value
        for (let i = 0; i < newValue.length; i++) {
          if (/\d/.test(newValue[i])) {
            digitCount++;
          }
          if (digitCount === prevDigitsBeforeCursor) {
            newCursorPosition = i + 1;
            break;
          }
        }

        input.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    }
  };

  return (
    <Input
      type="text"
      value={value !== null ? value?.toLocaleString() : ""}
      onChange={handleChange}
      ref={ref}
      {...props}
    />
  );
});

NumberInput.displayName = "NumberInput";
