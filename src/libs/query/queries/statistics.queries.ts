import { queryOptions } from "@tanstack/react-query";
import { Sheet } from "../../db/schema";
import { getPredictions } from "@/app/actions/statistics.actions";
import { PredictionQueryKeys } from "../constants/keys.constants";

export const getPredictionOptions = (sheetId: Sheet["id"]) =>
  queryOptions({
    queryKey: PredictionQueryKeys.bySheetId(sheetId),
    queryFn: async () => {
      const response = await getPredictions(sheetId);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });
