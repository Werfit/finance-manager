import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Dashboard } from "./_components/dashboard/dashboard.component";
import {
  getSheetRecordsQuery,
  getTotalAmountQuery,
} from "@/libs/query/queries/records.queries";
import { SheetNavigation } from "./_components/navigation/sheet-navigation.component";

import { PageProps } from "@/shared/types/layout.type";
import { getSheetOptions } from "@/libs/query/queries/sheets.queries";

const Page: React.FC<PageProps<{ id: string }>> = async ({ params }) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery(getSheetRecordsQuery(id));
  await queryClient.prefetchQuery(getTotalAmountQuery(id));
  await queryClient.prefetchQuery(getSheetOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SheetNavigation sheetId={id} />
      <Dashboard sheetId={id} />
    </HydrationBoundary>
  );
};

export default Page;
