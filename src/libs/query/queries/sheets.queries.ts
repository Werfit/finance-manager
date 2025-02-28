import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createSheet, getSheet, getSheets } from "@/app/actions/sheets.actions";
import { useToast } from "@/hooks/use-toast.hook";
import { Sheet } from "@/libs/db/schema";
import { CreateSheetSchema } from "@/shared/schemas/sheet.schema";

import { SheetsQueryKeys } from "../constants/keys.constants";

export const getSheetsOptions = queryOptions({
  queryKey: SheetsQueryKeys.all,
  queryFn: async () => {
    const response = await getSheets();

    if (!response.success) {
      throw new Error(response.error);
    }

    return response.data;
  },
});

export const getSheetOptions = (sheetId: Sheet["id"]) =>
  queryOptions({
    queryKey: SheetsQueryKeys.bySheetId(sheetId),
    queryFn: async () => {
      const response = await getSheet(sheetId);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

export const useCreateSheetMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSheetSchema) => {
      const response = await createSheet(data.name);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onError: (error) => {
      toast({
        title: "Failed to create sheet",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SheetsQueryKeys.all });
      onSuccess?.();
    },
  });
};
