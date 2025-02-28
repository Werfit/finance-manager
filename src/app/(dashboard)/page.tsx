import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getSheetsOptions } from "@/libs/query/queries/sheets.queries";
import { QueryClient } from "@tanstack/react-query";
import { Navigation } from "./_components/navigation.component";
import { SheetList } from "./_components/sheets/sheet-list.component";

const Page = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getSheetsOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Navigation
        title={
          <h6 className="text-muted-foreground text-sm font-bold">Sheets</h6>
        }
      />
      <SheetList />
    </HydrationBoundary>
  );
};

export default Page;
