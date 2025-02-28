import { RecordWithCategory } from "@/libs/db/queries/records/record.types";

import { Record } from "./record.component";

type RecordListProps = {
  records: RecordWithCategory[];
};

export const RecordList: React.FC<RecordListProps> = ({ records }) => {
  return (
    <div className="flex flex-col">
      {records.map((record) => (
        <Record
          key={record.id}
          data={record}
          className="border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-100"
        />
      ))}
    </div>
  );
};
