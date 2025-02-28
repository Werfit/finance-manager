"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Sheet } from "@/libs/db/schema";
import { getPredictionOptions } from "@/libs/query/queries/statistics.queries";

import { formatCurrency } from "@/shared/utils/number.util";
import { useQuery } from "@tanstack/react-query";

type CategoriesTableProps = {
  sheetId: Sheet["id"];
};

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  sheetId,
}) => {
  const { data, isLoading } = useQuery(getPredictionOptions(sheetId));

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-bold">Predicted expenses:</h4>

      {isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Last Month Spent</TableHead>
              <TableHead>Rolling Mean</TableHead>
              <TableHead>Prediction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-6" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      {data && !isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Last Month Spent</TableHead>
              <TableHead>Rolling Mean</TableHead>
              <TableHead>Prediction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((category) => (
              <TableRow
                className="odd:bg-white even:bg-slate-100"
                key={category.id}
              >
                <TableCell>{category.name}</TableCell>
                <TableCell>{formatCurrency(category.lastMonthSpent)}</TableCell>
                <TableCell>{formatCurrency(category.rollingMean)}</TableCell>
                <TableCell>{formatCurrency(category.prediction)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
