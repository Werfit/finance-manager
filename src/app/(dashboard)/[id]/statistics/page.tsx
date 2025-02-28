import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Sheet } from "@/libs/db/schema";
import { getPredictionOptions } from "@/libs/query/queries/statistics.queries";
import { PageProps } from "@/shared/types/layout.type";

import { CategoriesTable } from "./_components/categories-table.component";
import { StatisticsNavigation } from "./_components/statistics-navigation.component";

const Page: React.FC<
  PageProps<{
    id: Sheet["id"];
  }>
> = async ({ params }) => {
  const searchParams = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getPredictionOptions(searchParams.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatisticsNavigation sheetId={searchParams.id} />
      <CategoriesTable sheetId={searchParams.id} />
    </HydrationBoundary>
  );
};

export default Page;
