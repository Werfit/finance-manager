import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/utils/cn.util";

import { DigitInput } from "./digit-input.component";

type InputGroupProps = {
  max: number;
  min: number;
  value: string;
  onChange: (value: number) => void;
  onBlur?: (index: number) => void;
};

export type InputGroupRef = {
  focusFirstInput: () => void;
  focusSecondInput: () => void;
};

export const InputGroup = forwardRef<InputGroupRef, InputGroupProps>(
  ({ max, min, value: value_, onChange, onBlur }, ref) => {
    const [value, setValue] = useState(value_);
    const firstInput = useRef<HTMLInputElement>(null);
    const secondInput = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusFirstInput: () => firstInput.current?.focus(),
      focusSecondInput: () => secondInput.current?.focus(),
    }));

    const changeHandler = useCallback(
      (digit: number, index: number) => {
        const newValue = digit.toString();
        const newDigits = value.toString().split("");
        newDigits[index] = newValue;

        setValue(newDigits.join(""));
        onChange(parseInt(newDigits.join("")));

        onBlur?.(index);
        if (index === 0) {
          secondInput.current?.focus();
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [setValue, value]
    );

    return (
      <div className="flex items-center">
        <DigitInput
          ref={firstInput}
          className={cn(
            "focus-within:border-ring h-9 w-9 rounded-r-none focus-within:ring-0"
          )}
          max={parseInt(max.toString()[0])}
          min={min}
          value={parseInt(value[0])}
          onChange={(value) => changeHandler(value, 0)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              secondInput.current?.focus();
            }

            if (event.key === "ArrowLeft") {
              onBlur?.(0);
            }
          }}
        />
        <DigitInput
          ref={secondInput}
          className={cn(
            "focus-within:border-ring h-9 w-9 rounded-l-none focus-within:ring-0"
          )}
          min={0}
          value={parseInt(value[1])}
          onChange={(value) => changeHandler(value, 1)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              firstInput.current?.focus();
            }

            if (event.key === "ArrowRight") {
              onBlur?.(1);
            }
          }}
        />
      </div>
    );
  }
);

InputGroup.displayName = "Input Group";
