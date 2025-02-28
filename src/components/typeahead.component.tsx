import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

type Option<Value extends string> = {
  readonly label: string;
  readonly value: Value;
};

type TypeaheadProps<Options extends string[]> = {
  options: Option<Options[number]>[];
  placeholder: string;
  value: Options[number];
  onChange: (value: Options[number]) => void;
  disabled?: boolean;
};

export const Typeahead = <Options extends string[]>({
  options,
  placeholder,
  value,
  onChange,
  disabled,
}: TypeaheadProps<Options>) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
