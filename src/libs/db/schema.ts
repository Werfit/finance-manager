import { pgEnum, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

import { CategoryTypes } from "./shared/enums";
import { float } from "./types/float.type";

const usersTable = authUsers;

export type User = typeof usersTable.$inferSelect;

export const sheetsTable = pgTable("sheets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Sheet = typeof sheetsTable.$inferSelect;

export const categoryType = pgEnum("category_type", CategoryTypes);

export const categoriesTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  type: categoryType(),
});

export type Category = typeof categoriesTable.$inferSelect;

export const recordsTable = pgTable("records", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: float("amount").notNull(),
  sheetId: uuid("sheet_id")
    .references(() => sheetsTable.id)
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categoriesTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Record = typeof recordsTable.$inferSelect;
