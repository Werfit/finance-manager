import { useMemo } from "react";
import { Control, useWatch } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenerateRandomTransactionsSchema } from "@/shared/schemas/record.schema";

type CategoriesListProps = {
  control: Control<GenerateRandomTransactionsSchema>;
};

export const TotalInput: React.FC<CategoriesListProps> = ({ control }) => {
  const categories = useWatch({
    name: "categories",
    control,
    defaultValue: [],
  });

  const [min, max] = useMemo(() => {
    const min = categories.reduce(
      (sum, category) => sum + category.frequency.min,
      0
    );
    const max = categories.reduce(
      (sum, category) => sum + category.frequency.max,
      0
    );

    return [min, max] as const;
  }, [categories]);

  return (
    <div className="flex flex-col gap-2">
      <Label>Amount of records to generate in a month</Label>
      <Input inputClassName="text-center" value={`${min} - ${max}`} disabled />
    </div>
  );
};
