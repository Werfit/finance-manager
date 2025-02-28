import { RecordWithCategory } from "@/libs/db/queries/records/record.types";
import { cn } from "@/shared/utils/cn.util";
import { formatCurrency } from "@/shared/utils/number.util";

type RecordProps = {
  data: RecordWithCategory;
  className?: string;
};

export const Record: React.FC<RecordProps> = ({ data, className }) => {
  const categoryName = data.category?.name ?? "No category";

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded px-2 py-1",
        className
      )}
    >
      {categoryName}

      <span
        className={cn(
          "text-sm font-medium",
          data.amount > 0 && "text-green-600"
        )}
      >
        {formatCurrency(data.amount)}
      </span>
    </div>
  );
};
