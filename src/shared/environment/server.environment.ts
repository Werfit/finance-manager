import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string(),
  API_URL: z.string(),
});

const environmentObject: Record<
  keyof z.infer<typeof environmentSchema>,
  unknown
> = {
  DATABASE_URL: process.env.DATABASE_URL,
  API_URL: process.env.API_URL,
};

export const serverEnvironment = environmentSchema.parse(environmentObject);
