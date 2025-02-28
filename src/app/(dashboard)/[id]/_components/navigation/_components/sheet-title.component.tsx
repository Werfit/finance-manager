"use client";

import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Sheet } from "@/libs/db/schema";
import { getSheetOptions } from "@/libs/query/queries/sheets.queries";

type SheetTitleProps = {
  sheetId: Sheet["id"];
};

export const SheetTitle: React.FC<SheetTitleProps> = ({ sheetId }) => {
  const { data: sheet, isPending } = useQuery(getSheetOptions(sheetId));

  if (isPending) {
    return <Skeleton className="h-4 w-24" />;
  }

  return (
    <h6 className="text-muted-foreground text-sm font-bold">{sheet?.name}</h6>
  );
};
