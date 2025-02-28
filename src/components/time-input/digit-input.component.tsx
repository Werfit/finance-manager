import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Input } from "../ui/input";
import { cn } from "@/shared/utils/cn.util";

type DigitInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "onChange" | "min" | "max"
> & {
  onChange: (value: number, event: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
};

export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  ({ value, onChange, min = 1, max = 9, ...props }, ref) => {
    const previousValue = useRef<string>("");

    const handleChange = useCallback(
      (value: number, event: ChangeEvent<HTMLInputElement>) => {
        previousValue.current = value.toString();
        onChange(value, event);
      },
      [min, onChange]
    );

    return (
      <Input
        type="number"
        value={value}
        maxLength={1}
        inputClassName="text-center"
        onChange={(event) => {
          let value = event.target.value;

          if (previousValue.current && previousValue.current.length > 0) {
            value = value.replace(previousValue.current, "");
          }

          value = value.length > 0 ? value[0] : value;

          if (value === "" || Number.isNaN(parseInt(value))) {
            handleChange(min, event);
            return;
          }

          const parsedValue = parseInt(value);
          const value_ = Math.min(Math.max(parsedValue, min), max);
          handleChange(value_, event);
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
