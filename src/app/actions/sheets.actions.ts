"use server";

import {
  createSheetQuery,
  getSheetQuery,
  getSheetsAndCountRecordsQuery,
} from "@/libs/db/queries/sheets/sheet.queries";
import { SheetWithRecordsAmount } from "@/libs/db/queries/sheets/sheet.types";
import { Sheet, User } from "@/libs/db/schema";
import { getServerUser } from "@/libs/supabase/utils/getServerUser.util";
import { ActionResponse } from "@/shared/types/action.type";

export const createDefaultSheet = async (
  userId: User["id"]
): Promise<ActionResponse<Sheet>> => {
  try {
    const sheet = await createSheetQuery("Default", userId);

    if (!sheet) {
      throw new Error("Failed to create default sheet");
    }

    return {
      success: true,
      data: sheet,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to create default sheet",
    };
  }
};

export const createSheet = async (
  name: Sheet["name"]
): Promise<ActionResponse<Sheet>> => {
  const user = await getServerUser();

  try {
    const sheet = await createSheetQuery(name, user.id);

    if (!sheet) {
      throw new Error("Failed to create a sheet");
    }

    return {
      success: true,
      data: sheet,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to create a sheet",
    };
  }
};

export const getSheets = async (): Promise<
  ActionResponse<SheetWithRecordsAmount[]>
> => {
  const user = await getServerUser();

  try {
    const sheets = await getSheetsAndCountRecordsQuery(user.id);

    return {
      success: true,
      data: sheets,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to get sheets",
    };
  }
};

export const getSheet = async (
  sheetId: Sheet["id"]
): Promise<ActionResponse<Sheet>> => {
  try {
    const sheet = await getSheetQuery(sheetId);

    if (!sheet) {
      throw new Error("Sheet not found");
    }

    return {
      success: true,
      data: sheet,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to get sheet",
    };
  }
};
