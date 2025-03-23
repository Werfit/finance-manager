import { queryOptions, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getCategories } from "@/app/actions/categories.actions";
import { useToast } from "@/hooks/use-toast.hook";

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

export const useGetCategories = () => {
  const { toast } = useToast();

  const state = useQuery(getCategoriesOptions());

  useEffect(() => {
    if (state.isError) {
      toast({
        variant: "destructive",
        description: "Failed to fetch categories",
        title: "Error during fetching",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isError]);

  return state;
};
