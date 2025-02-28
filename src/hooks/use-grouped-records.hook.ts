"use client";

import {
  RecordsList,
  RecordWithCategory,
} from "@/libs/db/queries/records/record.types";
import { InfiniteData } from "@tanstack/react-query";
import { useMemo } from "react";

export type DateRecordsGroup = {
  date: string;
  records: RecordWithCategory[];
};

const groupRecordsByDate = (
  records: RecordWithCategory[]
): DateRecordsGroup[] => {
  const groups: Record<string, RecordWithCategory[]> = {};

  // Group records by date
  records.forEach((record) => {
    const date = record.createdAt.toISOString().split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
  });

  // Convert to array format
  return Object.entries(groups).map(([date, records]) => ({
    date,
    records,
  }));
};

export const useGroupedRecords = (
  records: InfiniteData<RecordsList>["pages"]
) => {
  return useMemo(() => {
    return groupRecordsByDate(records.flatMap((page) => page.records));
  }, [records]);
};
