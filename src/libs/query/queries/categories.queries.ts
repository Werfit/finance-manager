import { getCategories } from "@/app/actions/categories.actions";
import { queryOptions } from "@tanstack/react-query";
import { CategoriesQueryKeys } from "../constants/keys.constants";

export const getCategoriesOptions = () =>
  queryOptions({
    queryKey: CategoriesQueryKeys.all,
    queryFn: async () => {
      const response = await getCategories();

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });
