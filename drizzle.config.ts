import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schemaFilter: ["public"],
  schema: "./src/libs/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
