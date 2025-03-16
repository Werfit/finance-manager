import { MinusIcon } from "lucide-react";
import { useId, useState } from "react";

import { SimpleTooltip } from "@/components/simple-tooltip.component";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Category } from "@/libs/db/schema";
import {
  GenerateRandomTransactionsSchema,
  RangeObject,
} from "@/shared/schemas/record.schema";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MinMaxInput } from "@/components/min-max-input.component";
import { extractCategoryError } from "./utils/extract-category-error.util";

type CategoryInputProps = {
  category: Category;
  index: number;
  control: Control<GenerateRandomTransactionsSchema>;
};

export const CategoryInput: React.FC<CategoryInputProps> = ({
  category,
  index,
  control,
}) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <Accordion type="single" collapsible>
        <AccordionItem value={id}>
          <div className="flex items-center justify-between gap-1 py-0">
            <AccordionTrigger
              headerClassName="flex-1 py-0 overflow-hidden"
              className="text-muted-foreground inline cursor-pointer overflow-hidden py-0 text-sm font-bold text-nowrap text-ellipsis capitalize"
            >
              <SimpleTooltip content={category.name}>
                <span>{category.name}</span>
              </SimpleTooltip>
            </AccordionTrigger>

            <Button type="button" variant="ghost" size="icon">
              <MinusIcon />
            </Button>
          </div>

          <AccordionContent className="flex flex-col gap-4">
            <FormField
              control={control}
              name={`categories.${index}.amount`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Amount Range</FormLabel>
                  <FormDescription>
                    Min and max amount you want the range transaction amount to
                    be.
                  </FormDescription>
                  <FormControl>
                    <MinMaxInput {...field} />
                  </FormControl>

                  <FormMessage>
                    {extractCategoryError(fieldState.error)}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`categories.${index}.frequency`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Frequency Range</FormLabel>
                  <FormDescription>
                    How often a transaction can occur within a month.
                  </FormDescription>
                  <FormControl>
                    <MinMaxInput {...field} />
                  </FormControl>
                  <FormMessage>
                    {extractCategoryError(fieldState.error)}
                  </FormMessage>
                </FormItem>
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
