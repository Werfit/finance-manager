import { relations } from "drizzle-orm/relations";
import { usersInAuth, sheets, categories, records } from "./schema";

export const sheetsRelations = relations(sheets, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [sheets.userId],
		references: [usersInAuth.id]
	}),
	records: many(records),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	sheets: many(sheets),
}));

export const recordsRelations = relations(records, ({one}) => ({
	category: one(categories, {
		fields: [records.categoryId],
		references: [categories.id]
	}),
	sheet: one(sheets, {
		fields: [records.sheetId],
		references: [sheets.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	records: many(records),
}));