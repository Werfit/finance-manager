import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getSheetOptions } from "@/libs/query/queries/sheets.queries";
import { PageProps } from "@/shared/types/layout.type";

import { AnalyticsNavigation } from "./_components/navigation/analytics-navigation.component";
import { AnalyticsProvider } from "./_context/analytics.context";

const Page: React.FC<PageProps<{ id: string }>> = async ({ params }) => {
  const searchParams = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getSheetOptions(searchParams.id));

  return (
    <div className="mx-auto max-w-6xl">
      <AnalyticsProvider sheetId={searchParams.id}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AnalyticsNavigation />
        </HydrationBoundary>
      </AnalyticsProvider>
    </div>
  );
};

export default Page;
