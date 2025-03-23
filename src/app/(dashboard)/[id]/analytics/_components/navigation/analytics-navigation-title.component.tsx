"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { SimpleTooltip } from "@/components/simple-tooltip.component";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSheetOptions } from "@/libs/query/queries/sheets.queries";

import { AnalyticsLayoutParams } from "../../../_shared/params.types";
import { useParams } from "next/navigation";

export const AnalyticsNavigationTitle: React.FC = () => {
  const { id: sheetId } = useParams<AnalyticsLayoutParams>();
  const { data: sheet, isPending } = useQuery(getSheetOptions(sheetId));

  return (
    <>
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/${sheetId}`}>
          <ChevronLeftIcon />
        </Link>
      </Button>

      {isPending ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        <SimpleTooltip
          content={`Sheet contains ${sheet?.records ?? 0} records`}
        >
          <h6 className="text-muted-foreground text-sm font-bold capitalize">
            {sheet?.name}
          </h6>
        </SimpleTooltip>
      )}
    </>
  );
};
