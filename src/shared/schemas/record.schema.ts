import { z } from "zod";

export const createRecordSchema = z.object({
  amount: z.coerce.number({
    required_error: "Amount is required",
  }),
  categoryId: z.string({
    required_error: "Category is required",
  }),
  createdAt: z.date({
    required_error: "Created at is required",
  }),
});

export type CreateRecordSchema = z.infer<typeof createRecordSchema>;

export const importRecordsSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "text/csv", {
      message: "File must be a CSV file",
    })
    .refine((file) => file.size > 0 && file.size < 5 * 1024 * 1024, {
      message: "File must be a non-empty CSV file and less than 5MB",
    }),
});

export type ImportRecordsSchema = z.infer<typeof importRecordsSchema>;

export const importedRecordsSchema = z.array(
  z.object({
    amount: z.coerce.number({
      required_error: "Amount is required",
    }),
    createdAt: z.coerce.date({
      required_error: "Created at is required",
    }),
    categoryName: z.string({
      required_error: "Category name is required",
    }),
    description: z.string({}).optional(),
  })
);

export type ImportedRecordsSchema = z.infer<typeof importedRecordsSchema>;
