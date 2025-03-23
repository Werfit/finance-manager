import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";

import { SimpleTooltip } from "@/components/simple-tooltip.component";
import { Button } from "@/components/ui/button";
import { Category, Sheet } from "@/libs/db/schema";
import { getCategoryRecordsOptions } from "@/libs/query/queries/records.queries";
import { PageProps } from "@/shared/types/layout.type";

import { CategoryAnalyticsChart } from "./_components/analytics-chart/category-analytics-chart.component";
import { PredictionBadge } from "./_components/prediction-badge/prediction-badge.component";

const Page: React.FC<
  PageProps<{ id: Sheet["id"]; category: Category["id"] }>
> = async ({ params }) => {
  const parameters = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getCategoryRecordsOptions(parameters.category, parameters.id)
  );

  return (
    <div className="flex flex-col gap-4">
      <section>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoryAnalyticsChart categoryId={parameters.category} />
        </HydrationBoundary>
      </section>

      <section>
        <PredictionBadge
          sheetId={parameters.id}
          categoryId={parameters.category}
        />

        <footer className="mt-2 flex justify-end gap-1">
          <SimpleTooltip content="Mark as incorrect">
            <Button variant="destructive" size="icon">
              <XIcon />
            </Button>
          </SimpleTooltip>

          <SimpleTooltip content="Mark as correct">
            <Button variant="success" size="icon">
              <CheckIcon />
            </Button>
          </SimpleTooltip>
        </footer>
      </section>
    </div>
  );
};

export default Page;
