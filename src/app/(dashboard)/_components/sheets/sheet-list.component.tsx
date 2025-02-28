"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getSheetsOptions } from "@/libs/query/queries/sheets.queries";
import { useQuery } from "@tanstack/react-query";
import { SheetCard } from "./sheet-card.component";
import { NewSheetButton } from "./new-sheet/new-sheet-button.component";

export const SheetList = () => {
  const { data: sheets, isPending } = useQuery(getSheetsOptions);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
      {sheets?.map((sheet) => <SheetCard key={sheet.id} sheet={sheet} />)}

      <NewSheetButton />
    </div>
  );
};
