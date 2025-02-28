import { relations } from "drizzle-orm/relations";
import { sheets, categories, records } from "./schema";
import { authUsers } from "drizzle-orm/supabase";

export const sheetsRelations = relations(sheets, ({ one, many }) => ({
  usersInAuth: one(authUsers, {
    fields: [sheets.userId],
    references: [authUsers.id],
  }),
  records: many(records),
}));

export const usersInAuthRelations = relations(authUsers, ({ many }) => ({
  sheets: many(sheets),
}));

export const recordsRelations = relations(records, ({ one }) => ({
  category: one(categories, {
    fields: [records.categoryId],
    references: [categories.id],
  }),
  sheet: one(sheets, {
    fields: [records.sheetId],
    references: [sheets.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  records: many(records),
}));
