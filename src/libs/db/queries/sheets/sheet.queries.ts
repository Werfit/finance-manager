import { and, count, desc, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/libs/db/drizzle";
import { recordsTable, Sheet, sheetsTable } from "@/libs/db/schema";
import { User } from "@/libs/db/schema";

import { SheetWithRecordsAmount } from "./sheet.types";

export const createSheetQuery = async (name: string, userId: User["id"]) => {
  const result = await db
    .insert(sheetsTable)
    .values({
      name,
      userId,
    })
    .returning();

  if (result.length === 0) {
    return null;
  }

  return result[0];
};

export const getSheetsAndCountRecordsQuery = async (
  userId: User["id"]
): Promise<SheetWithRecordsAmount[]> => {
  const result = await db
    .select({
      id: sheetsTable.id,
      name: sheetsTable.name,
      createdAt: sheetsTable.createdAt,
      recordsAmount: count(recordsTable.id),
      userId: sheetsTable.userId,
    })
    .from(sheetsTable)
    .where(eq(sheetsTable.userId, userId))
    .leftJoin(recordsTable, eq(sheetsTable.id, recordsTable.sheetId))
    .groupBy(sheetsTable.id)
    .orderBy(desc(sheetsTable.createdAt));

  return result;
};

export const getSheetQuery = async (sheetId: Sheet["id"]) => {
  const result = await db
    .select({
      ...getTableColumns(sheetsTable),
      records: count(),
    })
    .from(sheetsTable)
    .leftJoin(recordsTable, eq(recordsTable.sheetId, sheetsTable.id))
    .where(eq(sheetsTable.id, sheetId))
    .groupBy(sheetsTable.id);

  if (result.length === 0) {
    return null;
  }

  return result[0];
};

export const getUserSheetQuery = async (
  sheetId: Sheet["id"],
  userId: User["id"]
) => {
  const result = await db
    .select()
    .from(sheetsTable)
    .where(and(eq(sheetsTable.id, sheetId), eq(sheetsTable.userId, userId)));

  if (result.length === 0) {
    return null;
  }

  return result[0];
};
