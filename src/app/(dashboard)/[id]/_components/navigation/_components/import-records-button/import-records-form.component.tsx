"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FileInput } from "@/components/file-input.component";
import { LoadingButton } from "@/components/loading-button.component";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sheet } from "@/libs/db/schema";
import { useImportRecordsMutation } from "@/libs/query/queries/records.queries";
import {
  ImportRecordsSchema,
  importRecordsSchema,
} from "@/shared/schemas/record.schema";
type ImportRecordsFormProps = {
  onSubmit?: () => void;
  sheetId: Sheet["id"];
};

export const ImportRecordsForm = ({
  onSubmit,
  sheetId,
}: ImportRecordsFormProps) => {
  const form = useForm<ImportRecordsSchema>({
    resolver: zodResolver(importRecordsSchema),
  });
  const { mutate: importRecords, isPending } = useImportRecordsMutation(
    sheetId,
    onSubmit
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((formData) => {
          importRecords(formData.file as unknown as File);
        })}
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <FileInput
                  placeholder="Select a CSV file"
                  {...field}
                  value={field.value as unknown as File}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" loading={isPending}>
          Import
        </LoadingButton>
      </form>
    </Form>
  );
};
