import { Badge } from "@/components/badge.component";
import { DateRecordsGroup } from "@/hooks/use-grouped-records.hook";
import { CategoryType } from "@/libs/db/shared/enums";
import { formatDate } from "@/shared/utils/date.util";
import { formatCurrency } from "@/shared/utils/number.util";

import { RecordList } from "./record-list.component";

type DateGroupListProps = {
  groups: DateRecordsGroup[];
};

export const DateGroupList: React.FC<DateGroupListProps> = ({ groups }) => (
  <div className="flex flex-col gap-2">
    {groups.map((group) => (
      <div key={group.date}>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-bold">
            {formatDate(new Date(group.date))}
          </h3>

          <Badge className="bg-accent text-accent-foreground text-sm font-bold">
            {formatCurrency(
              group.records.reduce((acc, record) => {
                if (!record.category) {
                  return acc;
                }

                if (record.category.type === CategoryType.EXPENSE) {
                  return acc - record.amount;
                }

                return acc + record.amount;
              }, 0)
            )}
          </Badge>
        </div>
        <RecordList records={group.records} />
      </div>
    ))}

    {groups.length === 0 && (
      <p className="text-muted-foreground text-center text-sm">
        No records found
      </p>
    )}
  </div>
);
