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
    .object({
      type: z.string(),
      size: z.number(),
    })
    // .instanceof(File)
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

export const rangeObject = z
  .object({
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
  })
  .refine(({ min, max }) => min === null || max === null || min <= max, {
    message: "Min value must be less than max value",
    path: [],
  });

export type RangeObject = z.infer<typeof rangeObject>;

export const generateRandomTransactionsSchema = z
  .object({
    total: z.number().positive("Amount must be greater than 0"),
    period: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .refine(({ from, to }) => from.getTime() < to.getTime(), {
        path: [],
        message: "Incorrect period range",
      }),
    categories: z.array(
      z.object({
        categoryId: z.string().uuid("Incorrect category selected"),
        amount: rangeObject,
        frequency: rangeObject,
      })
    ),
  })
  .refine(
    ({ total, categories }) => {
      const minSum = categories.reduce(
        (sum, category) => sum + category.frequency.min,
        0
      );
      const maxSum = categories.reduce(
        (sum, category) => sum + category.frequency.max,
        0
      );

      return total > minSum && total >= maxSum;
    },
    {
      message:
        "Total amount must be bigger than sum of the categories min/max values",
      path: ["total"],
    }
  );

export type GenerateRandomTransactionsSchema = z.infer<
  typeof generateRandomTransactionsSchema
>;
