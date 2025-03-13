"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DateInput } from "@/components/date-input.component";
import { NumberInput } from "@/components/number-input.component";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  GenerateRandomTransactionsSchema,
  generateRandomTransactionsSchema,
} from "@/shared/schemas/record.schema";
import { formatDate } from "@/shared/utils/date.util";

import { CategoriesList } from "./_components/categories-list.component";

export const RecordsGeneratorForm = () => {
  const form = useForm<GenerateRandomTransactionsSchema>({
    resolver: zodResolver(generateRandomTransactionsSchema),
    defaultValues: {
      categories: [],
      total: 100,
    },
  });

  return (
    <form className="flex flex-col gap-y-4 py-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period to generate records</FormLabel>
              <FormControl>
                <DateInput
                  mode="range"
                  {...field}
                  selected={{
                    from: field.value.from,
                    to: field.value.to,
                  }}
                  onSelect={(range) => field.onChange(range)}
                >
                  <Button variant="outline" className="w-full">
                    {!field.value ? (
                      <span>Select</span>
                    ) : (
                      <span>
                        {formatDate(field.value.from)} -{" "}
                        {formatDate(field.value.to)}
                      </span>
                    )}
                  </Button>
                </DateInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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

        <CategoriesList control={form.control} name="categories" />

        <Button>Generate</Button>
      </Form>
    </form>
  );
};
