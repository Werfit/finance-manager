import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import {
  getSheetRecordsQuery,
  getTotalAmountQuery,
} from "@/libs/query/queries/records.queries";
import { getSheetOptions } from "@/libs/query/queries/sheets.queries";
import { PageProps } from "@/shared/types/layout.type";

import { Dashboard } from "./_components/dashboard/dashboard.component";
import { SheetNavigation } from "./_components/navigation/sheet-navigation.component";

const Page: React.FC<PageProps<{ id: string }>> = async ({ params }) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchInfiniteQuery(getSheetRecordsQuery(id)),
    queryClient.prefetchQuery(getTotalAmountQuery(id)),
    queryClient.prefetchQuery(getSheetOptions(id)),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SheetNavigation sheetId={id} />
        <Dashboard sheetId={id} />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
