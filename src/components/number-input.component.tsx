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
>(({ value, onChange, ...props }, ref) => (
  <Input
    type="number"
    value={value ?? ""}
    onChange={(event) => {
      if (event.target.value === "") {
        onChange?.(null);
      }

      if (Number.isNaN(parseFloat(event.target.value))) {
        return;
      }

      onChange?.(parseFloat(event.target.value));
    }}
    ref={ref}
    {...props}
  />
));

NumberInput.displayName = "NumberInput";
