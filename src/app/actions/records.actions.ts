"use server";

import { revalidatePath } from "next/cache";

import { createCategoriesBatch } from "@/libs/db/queries/categories/categories.queries";
import {
  createMultipleRecordsQuery,
  createRecordQuery,
  createRecordsBatch,
  getRecordsByCategoryQuery,
  getSheetRecordsQuery,
  getTotalAmountQuery,
} from "@/libs/db/queries/records/record.queries";
import { RecordsList } from "@/libs/db/queries/records/record.types";
import { processCSVRecords } from "@/libs/db/queries/records/record.utils";
import { getUserSheetQuery } from "@/libs/db/queries/sheets/sheet.queries";
import { Category, Record, Sheet } from "@/libs/db/schema";
import { getServerUser } from "@/libs/supabase/utils/getServerUser.util";
import { generateCategoryRandomTransactions } from "@/services/records.service";
import {
  CreateRecordSchema,
  GenerateRandomTransactionsSchema,
  generateRandomTransactionsSchema,
} from "@/shared/schemas/record.schema";
import { ActionResponse } from "@/shared/types/action.type";
import { parseCsv } from "@/shared/utils/csv.util";

export const getTotalAmount = async (
  sheetId: Sheet["id"]
): Promise<ActionResponse<number>> => {
  try {
    const total = await getTotalAmountQuery(sheetId);

    if (!total) {
      return {
        success: true,
        data: 0,
      };
    }

    return {
      success: true,
      data: parseFloat(total),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch total amount",
    };
  }
};

export const getSheetRecords = async (
  sheetId: Sheet["id"],
  page: number = 1,
  limit: number = 10
): Promise<ActionResponse<RecordsList>> => {
  try {
    const records = await getSheetRecordsQuery(sheetId, limit, page);
    return {
      success: true,
      data: records,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch records",
    };
  }
};

export const createRecord = async (
  data: CreateRecordSchema,
  sheetId: Sheet["id"]
): Promise<ActionResponse<Record>> => {
  try {
    const response = await createRecordQuery(data, sheetId);

    if (!response) {
      throw new Error("Failed to create record");
    }

    revalidatePath(`${sheetId}/statistics`);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to create record",
    };
  }
};

export const importRecords = async (
  file: File,
  sheetId: Sheet["id"]
): Promise<ActionResponse<Record[]>> => {
  const user = await getServerUser();

  try {
    const rawRecords = await parseCsv(file);
    const processedRecordsInput = await processCSVRecords(rawRecords);

    if (!processedRecordsInput) {
      throw new Error("Failed to process records");
    }

    const categoryNames = new Set(
      processedRecordsInput.map((record) => record.categoryName.trim())
    );

    const categories = await createCategoriesBatch({
      userId: user.id,
      names: Array.from(categoryNames),
      sheetId,
    });

    const categoryMap = new Map(
      categories.map((category) => [category.name, category.id])
    );

    const response = await createRecordsBatch({
      sheetId,
      records: processedRecordsInput.map((record) => ({
        ...record,
        categoryId: categoryMap.get(record.categoryName)!,
        createdAt: new Date(record.createdAt),
      })),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to import records",
    };
  }
};

export const generateRandomTransactions = async (
  data: GenerateRandomTransactionsSchema,
  sheetId: Sheet["id"]
): Promise<
  ActionResponse<{
    created: number;
  }>
> => {
  const { success, error } =
    await generateRandomTransactionsSchema.safeParseAsync(data);
  if (!success) {
    return {
      success: false,
      error: error.format()._errors.join("\n"),
    };
  }

  const user = await getServerUser();
  const sheet = await getUserSheetQuery(sheetId, user.id);

  if (!sheet) {
    return {
      success: false,
      error: "Sheet was not found",
    };
  }

  try {
    const records = data.categories.reduce<Omit<Record, "id">[]>(
      (generated, category) => [
        ...generated,
        ...generateCategoryRandomTransactions({
          amount: category.amount,
          frequency: category.frequency,
          totalTransactions: data.total,
          period: data.period,
          categoryId: category.categoryId,
          sheetId: sheet.id,
        }),
      ],
      []
    );

    // One bulk operation per time
    const chunkSize = 5000;
    let successfullyCreatedRecordsAmount = 0;

    for (let i = 0; i < records.length; i += chunkSize) {
      const recordsInWork = records.slice(i, i + chunkSize);
      // TODO: Should be added in a queue
      try {
        await createMultipleRecordsQuery(recordsInWork);
        successfullyCreatedRecordsAmount += recordsInWork.length;
      } catch (error) {
        console.error(error);
      }
    }

    return {
      success: true,
      data: {
        created: successfullyCreatedRecordsAmount,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to generate random transactions",
    };
  }
};

export const getRecordsByCategory = async (
  categoryId: Category["id"],
  sheetId: Sheet["id"]
): Promise<ActionResponse<Record[]>> => {
  const user = await getServerUser();

  try {
    const records = await getRecordsByCategoryQuery({
      sheetId,
      categoryId,
      userId: user.id,
    });

    return {
      success: true,
      data: records,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch the category records",
    };
  }
};
