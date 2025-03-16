import { queryOptions, useQuery } from "@tanstack/react-query";

import { getCategories } from "@/app/actions/categories.actions";

import { CategoriesQueryKeys } from "../constants/keys.constants";
import { useToast } from "@/hooks/use-toast.hook";
import { useEffect } from "react";

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
  }, [state.isError]);

  return state;
};
