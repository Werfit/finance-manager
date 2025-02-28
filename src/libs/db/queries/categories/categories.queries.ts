import { db } from "../../drizzle";
import { categoriesTable } from "../../schema";

export const getCategoriesQuery = async () => {
  const categories = await db.select().from(categoriesTable);

  return categories;
};
