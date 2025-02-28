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
