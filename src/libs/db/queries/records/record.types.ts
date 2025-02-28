import { Category, Record } from "@/libs/db/schema";

export type RecordWithCategory = Record & {
  category: Category | null;
};

export type RecordsList = {
  records: RecordWithCategory[];
  total: number;
  hasMore: boolean;
};
