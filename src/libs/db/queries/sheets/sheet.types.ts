import { Sheet } from "@/libs/db/schema";

export type SheetWithRecordsAmount = Sheet & {
  recordsAmount: number;
};
