"use server";

import { getCategoriesQuery } from "@/libs/db/queries/categories/categories.queries";
import { CategoryList } from "@/libs/db/queries/categories/categories.types";
import { ActionResponse } from "@/shared/types/action.type";

export const getCategories = async (): Promise<
  ActionResponse<CategoryList>
> => {
  try {
    const categories = await getCategoriesQuery();
    return {
      data: {
        categories,
        total: categories.length,
      },
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch categories",
    };
  }
};
