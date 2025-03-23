import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getSheetOptions } from "@/libs/query/queries/sheets.queries";
import { LayoutProps } from "@/shared/types/layout.type";

import { AnalyticsLayoutParams } from "../_shared/params.types";
import { CategoriesList } from "./_components/analytics-viewer/categories-list.component";
import { AnalyticsNavigation } from "./_components/navigation/analytics-navigation.component";

const Layout: React.FC<LayoutProps<AnalyticsLayoutParams>> = async ({
  children,
  params,
}) => {
  const searchParams = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getSheetOptions(searchParams.id));

  return (
    <div className="mx-auto h-[calc(100vh-4rem)] max-w-6xl space-y-4 overflow-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AnalyticsNavigation />
        <div className="grid h-full grid-cols-3 gap-x-24">
          <div className="col-span-1 h-full space-y-2 overflow-hidden">
            <h4 className="font-bold">Categories</h4>

            <CategoriesList />
          </div>

          <div className="col-span-2 space-y-2">
            <h4 className="font-bold">Information</h4>

            {children}
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Layout;
