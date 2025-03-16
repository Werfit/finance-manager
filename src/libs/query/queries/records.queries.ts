import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createRecord,
  generateRandomTransactions,
  getRecordsByCategory,
  getSheetRecords,
  getTotalAmount,
  importRecords,
} from "@/app/actions/records.actions";
import { toast, useToast } from "@/hooks/use-toast.hook";
import { Category, Sheet } from "@/libs/db/schema";
import {
  CreateRecordSchema,
  GenerateRandomTransactionsSchema,
} from "@/shared/schemas/record.schema";

import {
  PredictionQueryKeys,
  RecordsQueryKeys,
} from "../constants/keys.constants";

export const getTotalAmountQuery = (sheetId: Sheet["id"]) =>
  queryOptions({
    queryKey: RecordsQueryKeys.bySheetIdTotalAmount(sheetId),
    queryFn: async () => {
      const response = await getTotalAmount(sheetId);

      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });

export const getSheetRecordsQuery = (sheetId: Sheet["id"]) =>
  infiniteQueryOptions({
    queryKey: RecordsQueryKeys.bySheetId(sheetId),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getSheetRecords(sheetId, pageParam);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasMore ? lastPageParam + 1 : undefined;
    },
    initialPageParam: 1,
  });

export const useCreateRecordMutation = (
  sheetId: Sheet["id"],
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateRecordSchema) => {
      const response = await createRecord(data, sheetId);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RecordsQueryKeys.bySheetId(sheetId),
      });
      queryClient.invalidateQueries({
        queryKey: RecordsQueryKeys.bySheetIdTotalAmount(sheetId),
      });
      queryClient.invalidateQueries({
        queryKey: PredictionQueryKeys.bySheetId(sheetId),
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });
};

export const useImportRecordsMutation = (
  sheetId: Sheet["id"],
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await importRecords(file, sheetId);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RecordsQueryKeys.bySheetId(sheetId),
      });
      queryClient.invalidateQueries({
        queryKey: RecordsQueryKeys.bySheetIdTotalAmount(sheetId),
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });
};

export const useGenerateRandomTransactionsMutation = (
  sheetId: Sheet["id"],
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: GenerateRandomTransactionsSchema) => {
      const response = await generateRandomTransactions(value, sheetId);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RecordsQueryKeys.bySheetId(sheetId),
      });
      queryClient.invalidateQueries({
        queryKey: RecordsQueryKeys.bySheetIdTotalAmount(sheetId),
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });
};

export const getCategoryRecordsOptions = (
  categoryId: Category["id"],
  sheetId: Sheet["id"]
) =>
  queryOptions({
    queryKey: RecordsQueryKeys.byCategoryId(categoryId),
    queryFn: async () => {
      const response = await getRecordsByCategory(categoryId, sheetId);

      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });

export const useGetRecordsByCategoryQuery = (
  categoryId: Category["id"],
  sheetId: Sheet["id"]
) => {
  return useQuery(getCategoryRecordsOptions(categoryId, sheetId));
};
