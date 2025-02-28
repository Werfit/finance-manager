import {
  pgTable,
  uuid,
  text,
  timestamp,
  foreignKey,
  numeric,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";

export const categories = pgTable("categories", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const sheets = pgTable(
  "sheets",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [authUsers.id],
      name: "sheets_user_id_users_id_fk",
    }),
  ]
);

export const records = pgTable(
  "records",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    amount: numeric().notNull(),
    sheetId: uuid("sheet_id").notNull(),
    categoryId: uuid("category_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "records_category_id_categories_id_fk",
    }),
    foreignKey({
      columns: [table.sheetId],
      foreignColumns: [sheets.id],
      name: "records_sheet_id_sheets_id_fk",
    }),
  ]
);
