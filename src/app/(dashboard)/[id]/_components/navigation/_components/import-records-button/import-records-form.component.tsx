"use client";

import {
  importRecordsSchema,
  ImportRecordsSchema,
} from "@/shared/schemas/record.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FileInput } from "@/components/file-input.component";

import { useImportRecordsMutation } from "@/libs/query/queries/records.queries";
import { LoadingButton } from "@/components/loading-button.component";
import { Sheet } from "@/libs/db/schema";
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
          importRecords(formData.file);
        })}
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <FileInput placeholder="Select a CSV file" {...field} />
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
