import { Category, Sheet, User } from "@/libs/db/schema";

export type CategoryList = {
  categories: Category[];
  total: number;
};

export type CreateCategoriesBatchProps = {
  userId: User["id"];
  sheetId: Sheet["id"];
  names: Category["name"][];
};
