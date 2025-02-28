"use server";

import { revalidatePath } from "next/cache";

import {
  createRecordQuery,
  getSheetRecordsQuery,
  getTotalAmountQuery,
  importRecordsQuery,
} from "@/libs/db/queries/records/record.queries";
import { RecordsList } from "@/libs/db/queries/records/record.types";
import { Record, Sheet } from "@/libs/db/schema";
import { getServerUser } from "@/libs/supabase/utils/getServerUser.util";
import { CreateRecordSchema } from "@/shared/schemas/record.schema";
import { ActionResponse } from "@/shared/types/action.type";

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
    const response = await importRecordsQuery(file, sheetId, user.id);

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
