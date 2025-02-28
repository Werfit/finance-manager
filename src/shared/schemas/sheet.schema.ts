import { z } from "zod";

export const createSheetSchema = z.object({
  name: z.string().min(1),
});

export type CreateSheetSchema = z.infer<typeof createSheetSchema>;
