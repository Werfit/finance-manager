"use server";

import { notFound } from "next/navigation";

import { getCategoryByIdQuery } from "@/libs/db/queries/categories/categories.queries";
import { getUserSheetQuery } from "@/libs/db/queries/sheets/sheet.queries";
import { Category, Sheet } from "@/libs/db/schema";
import { getServerUser } from "@/libs/supabase/utils/getServerUser.util";
import { tryCatch } from "@/libs/try-catch/try-catch";
import {
  fetchPredictionData,
  gatherSheetPredictionData,
} from "@/services/statistics.service";
import { serverEnvironment } from "@/shared/environment/server.environment";
import { ActionResponse } from "@/shared/types/action.type";

export const getPredictions = async (
  sheetId: Sheet["id"],
  categoryId: Category["id"]
): Promise<
  ActionResponse<{ predictedAmount: number; predictedPercentage: number }>
> => {
  const user = await getServerUser();

  const result = await tryCatch(async () =>
    getUserSheetQuery(sheetId, user.id)
  );

  if (!result.success) {
    notFound();
  }

  const categoryResult = await tryCatch(async () =>
    getCategoryByIdQuery(categoryId)
  );

  if (!categoryResult.success) {
    notFound();
  }

  const statistics = await tryCatch(async () =>
    gatherSheetPredictionData(categoryId, sheetId)
  );

  if (!statistics.success) {
    return {
      success: false,
      error: "Failed to gather current state of the category",
    };
  }

  const prediction = await fetchPredictionData(statistics.data);

  if (!prediction) {
    return {
      success: false,
      error: "Failed to fetch prediction data",
    };
  }

  return {
    success: true,
    data: {
      predictedAmount: prediction.predicted_next_month_spent,
      predictedPercentage: prediction.predicted_next_month_spent_percentage,
    },
  };
};

export const getActivityHealth = async (): Promise<
  ActionResponse<{ ok: boolean }>
> => {
  const result = await tryCatch(async () => {
    const response = await fetch(serverEnvironment.API_URL + "/health");

    if (!response.ok) {
      throw new Error("Failed to fetch activity health");
    }

    return response.json();
  });

  return {
    success: true,
    data: {
      ok: result.success,
    },
  };
};
