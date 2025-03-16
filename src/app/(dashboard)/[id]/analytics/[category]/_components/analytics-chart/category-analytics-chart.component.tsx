"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipIndicator,
} from "@/components/ui/chart";
import { Category } from "@/libs/db/schema";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useGetRecordsByCategoryQuery } from "@/libs/query/queries/records.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { AnalyticsLayoutParams } from "../../../../_shared/params.types";
import { useMemo } from "react";
import {
  formatTransactionDate,
  preprocessChartData,
  processValuePayload,
  TransactionDate,
} from "./utils";
import { formatCurrency } from "@/shared/utils/number.util";
import { cn } from "@/shared/utils/cn.util";

type CategoryViewerProps = {
  categoryId: Category["id"];
};

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const CategoryAnalyticsChart: React.FC<CategoryViewerProps> = ({
  categoryId,
}) => {
  const { id: sheetId } = useParams<AnalyticsLayoutParams>();
  const { data, isLoading, isError } = useGetRecordsByCategoryQuery(
    categoryId,
    sheetId
  );
  const statistics = useMemo(() => {
    if (!data) {
      return [];
    }

    return preprocessChartData(data);
  }, [data]);

  if (isError) {
    return (
      <div className="bg-accent text-destructive-foreground rounded px-4 py-2 font-mono text-sm">
        Error during fetching the required data
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-[200px]" />;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={statistics}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label: TransactionDate) => {
                return formatTransactionDate(label);
              }}
              formatter={(value) => {
                return (
                  <div
                    className={cn(
                      "[&>svg]:text-muted-foreground flex w-full flex-wrap items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5"
                    )}
                  >
                    <ChartTooltipIndicator color={chartConfig.amount.color} />
                    <div
                      className={cn(
                        "flex flex-1 items-center justify-between leading-none"
                      )}
                    >
                      <div className="grid gap-1.5">Amount</div>
                      {value !== undefined && (
                        <span className="text-foreground ml-2 font-mono font-medium tabular-nums">
                          {processValuePayload(value)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          }
        />

        <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />

        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
};
