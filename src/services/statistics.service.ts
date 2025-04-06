import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { getSpentInCategoryAmountQuery } from "@/libs/db/queries/records/record.queries";
import { getSpentInSheetAmountQuery } from "@/libs/db/queries/records/record.queries";
import { Category, Sheet } from "@/libs/db/schema";
import { logger } from "@/libs/logger/logger";
import { tryCatch } from "@/libs/try-catch/try-catch";
import { serverEnvironment } from "@/shared/environment/server.environment";

type PredictionStatistics = {
  totalSpent: number;
  totalSpentInMonth: number;
  totalSpentLast3Months: number;
  totalSpentLast6Months: number;
  totalSpentInCategory: number;
  totalSpentInCategoryInMonth: number;
  totalSpentInCategoryLastMonth: number;
  totalSpentInCategoryLast3Months: number;
  totalSpentInCategoryLast6Months: number;
  sheetSpendingTrend: number;
  categorySpendingTrend: number;
  categorySpentPercentage: number;
  categorySpentPercentageTrend: number;
};

export const fetchPredictionData = async (data: PredictionStatistics) => {
  const result = await tryCatch<{
    predicted_next_month_spent: number;
    predicted_next_month_spent_percentage: number;
  }>(async () => {
    const url = serverEnvironment.API_URL + "/predict";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total_spent: data.totalSpent,
        total_spent_in_sheet_last_month: data.totalSpentInMonth,
        total_spent_in_sheet_last_3_months: data.totalSpentLast3Months,
        average_spent_in_sheet_last_6_months: data.totalSpentLast6Months,
        sheet_spending_trend: data.sheetSpendingTrend,
        total_spent_in_category_last_month: data.totalSpentInCategoryLastMonth,
        total_spent_in_category_last_3_months:
          data.totalSpentInCategoryLast3Months,
        average_spent_in_category_last_6_months:
          data.totalSpentInCategoryLast6Months,
        category_spending_trend: data.categorySpendingTrend,
        category_spent_percentage_last_month: data.categorySpentPercentage,
        category_spent_percentage_trend: data.categorySpentPercentageTrend,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  });

  if (result.success) {
    return result.data;
  }

  logger.error(result.error.message);
  return null;
};

const getTrend = (totalSpentInMonth: number, totalSpentLastMonth: number) => {
  if (totalSpentInMonth === totalSpentLastMonth) {
    return 0;
  }

  return totalSpentInMonth < totalSpentLastMonth ? -1 : 1;
};

export const gatherSheetPredictionData = async (
  categoryId: Category["id"],
  sheetId: Sheet["id"]
): Promise<PredictionStatistics> => {
  const [
    totalSpent,
    totalSpentInMonth,
    totalSpentLastMonth,
    totalSpentLast3Months,
    totalSpentLast6Months,
  ] = await Promise.all([
    getSpentInSheetAmountQuery({
      sheetId,
    }),
    getSpentInSheetAmountQuery({
      sheetId,
      period: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
    }),
    getSpentInSheetAmountQuery({
      sheetId,
      period: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: startOfMonth(new Date()),
      },
    }),
    getSpentInSheetAmountQuery({
      sheetId,
      period: {
        from: startOfMonth(subMonths(new Date(), 3)),
        to: startOfMonth(new Date()),
      },
    }),
    getSpentInSheetAmountQuery({
      sheetId,
      period: {
        from: startOfMonth(subMonths(new Date(), 6)),
        to: startOfMonth(new Date()),
      },
    }),
  ]);

  const [
    totalSpentInCategory,
    totalSpentInCategoryInMonth,
    totalSpentInCategoryLastMonth,
    totalSpentInCategoryLast3Months,
    totalSpentInCategoryLast6Months,
  ] = await Promise.all([
    getSpentInCategoryAmountQuery({
      categoryId,
      sheetId,
    }),
    getSpentInCategoryAmountQuery({
      categoryId,
      sheetId,
      period: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
    }),
    getSpentInCategoryAmountQuery({
      categoryId,
      sheetId,
      period: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: startOfMonth(new Date()),
      },
    }),
    getSpentInCategoryAmountQuery({
      categoryId,
      sheetId,
      period: {
        from: startOfMonth(subMonths(new Date(), 3)),
        to: startOfMonth(new Date()),
      },
    }),
    getSpentInCategoryAmountQuery({
      categoryId,
      sheetId,
      period: {
        from: startOfMonth(subMonths(new Date(), 6)),
        to: startOfMonth(new Date()),
      },
    }),
  ]);

  const sheetSpendingTrend = getTrend(totalSpentInMonth, totalSpentLastMonth);

  const categorySpendingTrend = getTrend(
    totalSpentInCategoryInMonth,
    totalSpentInCategoryLastMonth
  );

  const categorySpentPercentage = totalSpentInCategory / totalSpent;
  const lastMonthSpentPercentage =
    totalSpentInCategoryLastMonth / totalSpentLastMonth;

  const categorySpentPercentageTrend = getTrend(
    categorySpentPercentage,
    lastMonthSpentPercentage
  );

  return {
    totalSpent,
    totalSpentInMonth,
    totalSpentLast3Months,
    totalSpentLast6Months,
    totalSpentInCategory,
    totalSpentInCategoryInMonth,
    totalSpentInCategoryLastMonth,
    totalSpentInCategoryLast3Months,
    totalSpentInCategoryLast6Months,
    sheetSpendingTrend,
    categorySpendingTrend,
    categorySpentPercentage,
    categorySpentPercentageTrend,
  };
};
