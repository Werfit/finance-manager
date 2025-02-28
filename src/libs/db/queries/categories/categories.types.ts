import { Category } from "@/libs/db/schema";

export type CategoryList = {
  categories: Category[];
  total: number;
};
