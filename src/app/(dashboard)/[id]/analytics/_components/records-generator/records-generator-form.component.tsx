"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DateInput } from "@/components/date-input.component";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sheet } from "@/libs/db/schema";
import { useGenerateRandomTransactionsMutation } from "@/libs/query/queries/records.queries";
import {
  GenerateRandomTransactionsSchema,
  generateRandomTransactionsSchema,
} from "@/shared/schemas/record.schema";
import { endOfDay, formatDate, startOfDay } from "@/shared/utils/date.util";

import { CategoriesList } from "./_components/categories-list.component";
import { TotalInput } from "./_components/total-input.component";

type RecordsGeneratorFormProps = {
  sheetId: Sheet["id"];
  onSubmit?: () => void;
};

export const RecordsGeneratorForm: React.FC<RecordsGeneratorFormProps> = ({
  sheetId,
  onSubmit,
}) => {
  const form = useForm<GenerateRandomTransactionsSchema>({
    resolver: zodResolver(generateRandomTransactionsSchema),
    defaultValues: {
      categories: [],
      total: 100,
      period: {
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      },
    },
  });
  const { mutate } = useGenerateRandomTransactionsMutation(sheetId, onSubmit);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4 py-4"
        onSubmit={form.handleSubmit((value) => mutate(value))}
      >
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
        <TotalInput control={form.control} />

        <CategoriesList control={form.control} name="categories" />

        <Button type="submit">Generate</Button>
      </form>
    </Form>
  );
};
