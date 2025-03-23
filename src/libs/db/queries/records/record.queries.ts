import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  lte,
  sql,
} from "drizzle-orm";

import { CreateRecordSchema } from "@/shared/schemas/record.schema";

import { db } from "../../drizzle";
import {
  categoriesTable,
  Record,
  recordsTable,
  Sheet,
  sheetsTable,
  User,
} from "../../schema";
import {
  CreateRecordsBatchProps,
  GetRecordsByCategoryProps,
  GetSpentInCategoryAmountProps,
  GetSpentInSheetAmountProps,
  RecordsList,
} from "./record.types";

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
  sheetId: Sheet["id"],
  userId: User["id"]
) => {
  const sheets = await db
    .select()
    .from(sheetsTable)
    .where(and(eq(sheetsTable.userId, userId), eq(sheetsTable.id, sheetId)));

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

export const createMultipleRecordsQuery = async (
  data: Omit<Record, "id">[]
) => {
  await db.insert(recordsTable).values(data);
};

export const createRecordsBatch = async ({
  sheetId,
  records,
}: CreateRecordsBatchProps) => {
  const result = await db
    .insert(recordsTable)
    .values(
      records.map((record) => ({
        ...record,
        sheetId,
      }))
    )
    .returning();

  return result;
};

export const getRecordsByCategoryQuery = async ({
  sheetId,
  userId,
  categoryId,
}: GetRecordsByCategoryProps) => {
  const records = await db
    .select({ ...getTableColumns(recordsTable) })
    .from(recordsTable)
    .leftJoin(
      sheetsTable,
      and(
        eq(sheetsTable.id, recordsTable.sheetId),
        eq(sheetsTable.userId, userId)
      )
    )
    .where(
      and(eq(recordsTable.categoryId, categoryId), eq(sheetsTable.id, sheetId))
    );

  return records;
};

export const getSpentInSheetAmountQuery = async ({
  sheetId,
  period,
}: GetSpentInSheetAmountProps) => {
  const getCondition = () => {
    if (period) {
      return and(
        eq(recordsTable.sheetId, sheetId),
        gte(recordsTable.createdAt, period.from),
        lte(recordsTable.createdAt, period.to)
      );
    }

    return and(eq(recordsTable.sheetId, sheetId));
  };

  const records = await db
    .select({ sum: sql<number>`SUM(${recordsTable.amount})` })
    .from(recordsTable)
    .where(getCondition());

  return records[0].sum ?? 0;
};

export const getSpentInCategoryAmountQuery = async ({
  categoryId,
  sheetId,
  period,
}: GetSpentInCategoryAmountProps) => {
  const getCondition = () => {
    if (period) {
      return and(
        eq(recordsTable.categoryId, categoryId),
        eq(recordsTable.sheetId, sheetId),
        gte(recordsTable.createdAt, period.from),
        lte(recordsTable.createdAt, period.to)
      );
    }

    return and(
      eq(recordsTable.categoryId, categoryId),
      eq(recordsTable.sheetId, sheetId)
    );
  };

  const records = await db
    .select({ sum: sql<number>`SUM(${recordsTable.amount})` })
    .from(recordsTable)
    .where(getCondition());

  return records[0].sum ?? 0;
};
