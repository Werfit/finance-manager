import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  getActivityHealth,
  getPredictions,
} from "@/app/actions/statistics.actions";

import { Category, Sheet } from "../../db/schema";
import { PredictionQueryKeys } from "../constants/keys.constants";

export const getPredictionOptions = (
  sheetId: Sheet["id"],
  categoryId: Category["id"]
) =>
  queryOptions({
    queryKey: PredictionQueryKeys.bySheetAndCategoryId(sheetId, categoryId),
    queryFn: async () => {
      const response = await getPredictions(sheetId, categoryId);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

export const useGetActivityHealth = () =>
  useQuery({
    queryKey: ["activity-health"],
    queryFn: async () => {
      const response = await getActivityHealth();

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    retry: true,
  });
