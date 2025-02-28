"use server";

import { notFound } from "next/navigation";

import { getSheetRecordsWithCategoriesQuery } from "@/libs/db/queries/records/record.queries";
import { Category, Record as UserRecord, Sheet } from "@/libs/db/schema";
import { ActionResponse } from "@/shared/types/action.type";

type ProcessedCategory = Category & {
  rollingMean: number;
  lastMonthSpent: number;
};

type PredictedCategory = Omit<ProcessedCategory, "createdAt"> & {
  prediction: number;
};

const fetchPredictions = async (
  categories: ProcessedCategory[]
): Promise<PredictedCategory[]> => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      categories: categories.map((category) => ({
        month_number: nextMonth.getMonth() + 1,
        year: nextMonth.getFullYear(),
        category_id: category.id,
        category_name: category.name,
        last_month_spent: category.lastMonthSpent,
        rolling_mean: category.rollingMean,
      })),
    }),
  });

  const result = (await response.json()) as {
    predictions: {
      category_id: string;
      category_name: string;
      last_month_spent: number;
      rolling_mean: number;
      predicted_expense: number;
    }[];
  };

  return result.predictions.map((result) => ({
    id: result.category_id,
    name: result.category_name,
    lastMonthSpent: result.last_month_spent,
    rollingMean: result.rolling_mean,
    prediction: result.predicted_expense,
  }));
};

export const getPredictions = async (
  sheetId: Sheet["id"]
): Promise<ActionResponse<PredictedCategory[]>> => {
  try {
    const records = await getSheetRecordsWithCategoriesQuery(sheetId);

    if (!records) {
      notFound();
    }

    const groupedRecords = records.reduce(
      (acc, record) => {
        const category = record.categories;
        if (!category) {
          return acc;
        }

        if (!acc[category.id]) {
          acc[category.id] = {
            category: category,
            records: [],
          };
        }

        acc[category.id].records.push(record.records);
        return acc;
      },
      {} as Record<
        Category["id"],
        {
          category: Category;
          records: UserRecord[];
        }
      >
    );

    const results = Object.entries(groupedRecords).map(
      ([_, { records, category }]): Category & {
        lastMonthSpent: number;
        rollingMean: number;
      } => {
        const sortedRecords = records.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // Підрахунок lastMonthSpent та rollingMean для кожної категорії
        const totalSpentByMonth = sortedRecords.reduce(
          (acc, record) => {
            const month = `${record.createdAt.getFullYear()}-${record.createdAt.getMonth()}`;
            acc[month] = (acc[month] || 0) + record.amount;
            return acc;
          },
          {} as Record<string, number>
        );

        const months = Object.entries(totalSpentByMonth);
        let lastMonthSpent = 0;
        let rollingMean = 0;

        if (months.length > 1) {
          lastMonthSpent = months[months.length - 2][1];
        }

        if (months.length >= 3) {
          const recentMonths = months.slice(-3).map(([_, spent]) => spent);
          rollingMean =
            recentMonths.reduce((sum, spent) => sum + spent, 0) /
            recentMonths.length;
        }

        return {
          ...category,
          lastMonthSpent,
          rollingMean,
        };
      }
    );

    return {
      success: true,
      data: await fetchPredictions(results),
    };
  } catch (error_) {
    const error = error_ as Error;
    return {
      success: false,
      error: error.message,
    };
  }
};
