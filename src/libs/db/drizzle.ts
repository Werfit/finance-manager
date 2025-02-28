import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnvironment } from "@/shared/environment/server.environment";

export const client = postgres(serverEnvironment.DATABASE_URL, {
  prepare: false,
});
export const db = drizzle({ client });
