import { and, count, desc, eq, getTableColumns, sql } from "drizzle-orm";

import { getServerUser } from "@/libs/supabase/utils/getServerUser.util";
import { CreateRecordSchema } from "@/shared/schemas/record.schema";
import { parseCsv } from "@/shared/utils/csv.util";

import { db } from "../../drizzle";
import {
  categoriesTable,
  recordsTable,
  Sheet,
  sheetsTable,
  User,
} from "../../schema";
import { RecordsList } from "./record.types";
import { processCSVRecords } from "./record.utils";

export const getTotalAmountQuery = async (sheetId: Sheet["id"]) => {
  const total = await db
    .select({
      sum: sql<string>`
        SUM(
          CASE
            WHEN ${categoriesTable.type} = 'income' THEN ${recordsTable.amount}
            WHEN ${categoriesTable.type} = 'expense' THEN -${recordsTable.amount}
            ELSE 0
          END
        )`,
    })
    .from(recordsTable)
    .innerJoin(categoriesTable, eq(recordsTable.categoryId, categoriesTable.id))
    .where(eq(recordsTable.sheetId, sheetId));

  return total[0].sum ?? 0; // Ensure a valid number is returned
};

export const getSheetRecordsQuery = async (
  sheetId: Sheet["id"],
  limit: number,
  page: number
): Promise<RecordsList> => {
  const offset = (page - 1) * limit;

  const records = await db
    .select({
      ...getTableColumns(recordsTable),
      category: categoriesTable,
    })
    .from(recordsTable)
    .where(eq(recordsTable.sheetId, sheetId))
    .leftJoin(categoriesTable, eq(categoriesTable.id, recordsTable.categoryId))
    .orderBy(desc(recordsTable.createdAt), desc(recordsTable.id))
    .offset(offset)
    .limit(limit);

  const total = await db
    .select({ count: count() })
    .from(recordsTable)
    .where(eq(recordsTable.sheetId, sheetId));

  const hasMore = total[0].count > offset + limit;

  return {
    records,
    total: total[0].count,
    hasMore,
  };
};

export const getSheetRecordsWithCategoriesQuery = async (
  sheetId: Sheet["id"]
) => {
  const user = await getServerUser();

  const sheets = await db
    .select()
    .from(sheetsTable)
    .where(and(eq(sheetsTable.userId, user.id), eq(sheetsTable.id, sheetId)));

  if (!sheets[0]) {
    return null;
  }

  const sheet = sheets[0];

  const records = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.sheetId, sheet.id))
    .leftJoin(categoriesTable, eq(categoriesTable.id, recordsTable.categoryId));

  return records;
};

export const createRecordQuery = async (
  data: CreateRecordSchema,
  sheetId: Sheet["id"]
) => {
  const records = await db
    .insert(recordsTable)
    .values({
      ...data,
      createdAt: new Date(data.createdAt),
      sheetId,
    })
    .returning();

  if (records.length === 0) {
    return null;
  }

  return records[0];
};

export const importRecordsQuery = async (
  file: File,
  sheetId: Sheet["id"],
  userId: User["id"]
) => {
  try {
    const rawRecords = await parseCsv(file);

    const processedRecordsInput = await processCSVRecords(rawRecords);

    if (!processedRecordsInput) {
      throw new Error("Failed to process records");
    }

    const categoryNames = new Set(
      processedRecordsInput.map((record) => record.categoryName.trim())
    );

    // Create categories first
    const categories = await db
      .insert(categoriesTable)
      .values(
        Array.from(categoryNames).map((name) => ({
          name,
          sheetId,
          userId,
        }))
      )
      .returning();

    const categoryMap = new Map(
      categories.map((category) => [category.name, category.id])
    );

    const records = await db
      .insert(recordsTable)
      .values(
        processedRecordsInput.map((record) => ({
          ...record,
          sheetId,
          categoryId: categoryMap.get(record.categoryName)!,
          createdAt: new Date(record.createdAt),
        }))
      )
      .returning();

    return records;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to import records");
  }
};
