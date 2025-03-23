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

export type GetSpentInSheetAmountProps = {
  sheetId: Sheet["id"];
  period?: {
    from: Date;
    to: Date;
  };
};

export type GetSpentInCategoryAmountProps = {
  categoryId: Category["id"];
  sheetId: Sheet["id"];
  period?: {
    from: Date;
    to: Date;
  };
};
