"use client";

import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/libs/db/schema";
import { Sheet } from "@/libs/db/schema";
import { getPredictionOptions } from "@/libs/query/queries/statistics.queries";
import { formatCurrency } from "@/shared/utils/number.util";

import { extractMonth } from "../analytics-chart/utils";
import { formatTransactionDate } from "../analytics-chart/utils";

type PredictionBadgeProps = {
  sheetId: Sheet["id"];
  categoryId: Category["id"];
};

export const PredictionBadge: React.FC<PredictionBadgeProps> = ({
  sheetId,
  categoryId,
}) => {
  const { data, isLoading, isError } = useQuery(
    getPredictionOptions(sheetId, categoryId)
  );

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (isError) {
    return (
      <div className="text-destructive-foreground bg-accent rounded p-2 text-sm">
        Failed to fetch the prediction for the next month.
      </div>
    );
  }

  return (
    <table className="bg-accent text-accent-foreground w-full rounded shadow-xs transition-colors hover:bg-slate-200">
      <tbody>
        <tr className="*:p-4 *:font-semibold">
          <td className="w-full border-r border-b text-sm">
            Prediction for the upcoming percentage (
            {formatTransactionDate(extractMonth(new Date()))})
          </td>
          <td className="border-b border-l text-sm">
            {(data?.predictedPercentage ?? 0) * 100}%
          </td>
        </tr>
        <tr className="*:p-4 *:font-semibold">
          <td className="w-full border-r text-sm">
            Prediction for the upcoming month (
            {formatTransactionDate(extractMonth(new Date()))})
          </td>
          <td className="border-l text-sm">
            {formatCurrency(data?.predictedAmount ?? 0)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
