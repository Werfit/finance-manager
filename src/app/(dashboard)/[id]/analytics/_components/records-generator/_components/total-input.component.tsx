import { NumberInput } from "@/components/number-input.component";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GenerateRandomTransactionsSchema } from "@/shared/schemas/record.schema";
import { useEffect } from "react";
import {
  Control,
  FieldArrayPath,
  useFormContext,
  useWatch,
} from "react-hook-form";

type CategoriesListProps = {
  control: Control<GenerateRandomTransactionsSchema>;
};

export const TotalInput: React.FC<CategoriesListProps> = ({ control }) => {
  const { watch, setValue } =
    useFormContext<GenerateRandomTransactionsSchema>();
  const categories = useWatch({
    name: "categories",
    control,
    defaultValue: [],
  });
  const total = watch("total");

  useEffect(() => {
    const maxFrequency = categories.reduce(
      (sum, category) => sum + category.frequency.max,
      0
    );

    if (maxFrequency > total) {
      setValue("total", maxFrequency);
    }
  }, [categories]);

  return (
    <FormField
      control={control}
      name="total"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Total number of records to generate</FormLabel>
          <FormControl>
            <NumberInput {...field} min={0} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
