import { Category, Sheet } from "../../db/schema";

export const PredictionQueryKeys = {
  all: ["all"] as const,
  bySheetId: (sheetId: Sheet["id"]) =>
    [...PredictionQueryKeys.all, sheetId] as const,
} as const;

export const SheetsQueryKeys = {
  all: ["sheets"] as const,
  bySheetId: (sheetId: Sheet["id"]) =>
    [...SheetsQueryKeys.all, sheetId] as const,
} as const;

export const RecordsQueryKeys = {
  all: ["records"] as const,
  byCategoryId: (categoryId: Category["id"]) =>
    [...RecordsQueryKeys.all, categoryId] as const,
  bySheetId: (sheetId: Sheet["id"]) =>
    [...RecordsQueryKeys.all, sheetId] as const,
  bySheetIdTotalAmount: (sheetId: Sheet["id"]) =>
    [...RecordsQueryKeys.all, sheetId, "totalAmount"] as const,
} as const;

export const CategoriesQueryKeys = {
  all: ["categories"] as const,
} as const;
