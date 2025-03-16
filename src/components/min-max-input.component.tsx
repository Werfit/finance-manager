import { cn } from "@/shared/utils/cn.util";
import { Label } from "./ui/label";
import { NumberInput } from "./number-input.component";

type Value = {
  min: number | null;
  max: number | null;
};

type MinMaxInputProps = {
  inputClassName?: string;
  className?: string;
  value: Value;
  onChange: (value: Value) => void;
};

export const MinMaxInput: React.FC<MinMaxInputProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label>Min</Label>

          <NumberInput
            value={value.min}
            onChange={(min) =>
              onChange({
                min,
                max: value.max,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Max</Label>
          <NumberInput
            value={value.max}
            onChange={(max) =>
              onChange({
                max,
                min: value.min,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
