"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CalendarInput } from "@/components/calendar-input.component";
import { LoadingButton } from "@/components/loading-button.component";
import { TimeInput } from "@/components/time-input.component";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateRecordMutation } from "@/libs/query/queries/records.queries";
import {
  CreateRecordSchema,
  createRecordSchema,
} from "@/shared/schemas/record.schema";

import { CategoryInput } from "../../../category-input/category-input.component";

type NewRecordFormProps = {
  onSubmit?: () => void;
  sheetId: string;
};

export const NewRecordForm: React.FC<NewRecordFormProps> = ({
  onSubmit,
  sheetId,
}) => {
  const form = useForm<CreateRecordSchema>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      amount: 0,
      categoryId: undefined,
      createdAt: new Date(),
    },
  });

  const { mutate: createRecord, isPending } = useCreateRecordMutation(
    sheetId,
    onSubmit
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (data) => {
          createRecord(data);
        })}
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e. g. 100"
                  // TODO: Implement a correct numeric input, without using `tel` type
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <CalendarInput date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <TimeInput
                  value={field.value}
                  onChange={(value) => {
                    const previousDate = new Date(field.value);
                    previousDate.setHours(value.getHours(), value.getMinutes());

                    field.onChange(previousDate);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" loading={isPending}>
          Create
        </LoadingButton>
      </form>
    </Form>
  );
};
