import { Category, Record, Sheet, User } from "@/libs/db/schema";

export type RecordWithCategory = Record & {
  category: Category | null;
};

export type RecordsList = {
  records: RecordWithCategory[];
  total: number;
  hasMore: boolean;
};

export type CreateRecordsBatchProps = {
  sheetId: Sheet["id"];
  records: Omit<Record, "id" | "sheetId">[];
};

export type GetRecordsByCategoryProps = {
  categoryId: Category["id"];
  sheetId: Sheet["id"];
  userId: User["id"];
};
