"use client";

import { DateGroupList } from "../records/date-group-list.component";
import { IncomeWidget } from "../widgets/income-widget.component";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useGroupedRecords } from "@/hooks/use-grouped-records.hook";
import { getSheetRecordsQuery } from "@/libs/query/queries/records.queries";
import { DashboardSkeleton } from "./dashboard-skeleton.component";
import { ErrorDisplay } from "@/components/error-display.component";
import { LoadingButton } from "@/components/loading-button.component";

type DashboardProps = {
  sheetId: string;
};

export const Dashboard: React.FC<DashboardProps> = ({ sheetId }) => {
  const {
    data: records,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getSheetRecordsQuery(sheetId));

  const groupedRecords = useGroupedRecords(records?.pages ?? []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <main>
      <div className="bg-background sticky top-0 mb-4">
        <IncomeWidget sheetId={sheetId} />
      </div>

      <DateGroupList groups={groupedRecords} />

      {hasNextPage && (
        <LoadingButton
          className="mt-2 w-full"
          onClick={() => fetchNextPage()}
          loading={isFetchingNextPage}
          disabled={!hasNextPage}
          variant="secondary"
        >
          Load more
        </LoadingButton>
      )}
    </main>
  );
};
