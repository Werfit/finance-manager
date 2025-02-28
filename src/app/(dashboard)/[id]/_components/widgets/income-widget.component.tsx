import { useQuery } from "@tanstack/react-query";

import { Sheet } from "@/libs/db/schema";
import { getTotalAmountQuery } from "@/libs/query/queries/records.queries";
import { cn } from "@/shared/utils/cn.util";
import { formatCurrency } from "@/shared/utils/number.util";

type IncomeWidgetProps = {
  sheetId: Sheet["id"];
  className?: string;
};

export const IncomeWidget: React.FC<IncomeWidgetProps> = ({
  className,
  sheetId,
}) => {
  const { data: totalAmount, isError } = useQuery(getTotalAmountQuery(sheetId));

  return (
    <h3
      className={cn(
        "after:bg-primary relative mx-auto w-fit py-1 text-xl font-medium after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-1/3 after:-translate-x-1/2 after:content-['']",
        className
      )}
    >
      {!isError && totalAmount !== undefined
        ? formatCurrency(totalAmount)
        : "NaN"}
    </h3>
  );
};
