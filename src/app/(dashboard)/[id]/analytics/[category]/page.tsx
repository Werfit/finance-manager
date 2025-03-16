import { Category, Sheet } from "@/libs/db/schema";
import { PageProps } from "@/shared/types/layout.type";

import { CategoryAnalyticsChart } from "./_components/analytics-chart/category-analytics-chart.component";
import { formatCurrency } from "@/shared/utils/number.util";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCategoryRecordsOptions } from "@/libs/query/queries/records.queries";
import {
  extractMonth,
  formatTransactionDate,
} from "./_components/analytics-chart/utils";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { SimpleTooltip } from "@/components/simple-tooltip.component";

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
        <table className="bg-accent text-accent-foreground w-full rounded shadow-xs transition-colors hover:bg-slate-200">
          <tbody>
            <tr className="*:p-4 *:font-semibold">
              <td className="w-full border-r text-sm">
                Prediction for the upcoming month (
                {formatTransactionDate(extractMonth(new Date()))})
              </td>
              <td className="border-l text-sm">{formatCurrency(1200)}</td>
            </tr>
          </tbody>
        </table>

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
