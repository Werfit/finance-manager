import { eq } from "drizzle-orm";

import { db } from "../../drizzle";
import { categoriesTable, Category } from "../../schema";
import { CreateCategoriesBatchProps } from "./categories.types";

export const getCategoriesQuery = async () => {
  const categories = await db.select().from(categoriesTable);

  return categories;
};

export const getCategoryByIdQuery = async (id: Category["id"]) => {
  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, id));

  return category;
};

export const createCategoriesBatch = async ({
  names,
  userId,
  sheetId,
}: CreateCategoriesBatchProps) => {
  const categories = await db
    .insert(categoriesTable)
    .values(
      names.map((name) => ({
        name,
        sheetId,
        userId,
      }))
    )
    .returning();

  return categories;
};
