"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/libs/query/queries/categories.queries";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnalyticsLayoutParams } from "../../../_shared/params.types";

export const CategoriesList = () => {
  const { isLoading, data, isError } = useGetCategories();
  const { id: sheetId, category: selectedCategoryId } =
    useParams<AnalyticsLayoutParams>();

  return (
    <aside className="no-scrollbar h-full overflow-y-auto">
      {isError && (
        <div className="text-destructive bg-accent rounded-md px-4 py-2 font-mono">
          Failed to load
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col *:border-b-2 *:last:border-none">
          {data?.categories?.map((category) => (
            <Link
              key={category.id}
              className="hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent/50 cursor-pointer px-4 py-2 text-left transition-colors"
              href={`/${sheetId}/analytics/${category.id}`}
              data-selected={category.id === selectedCategoryId}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
};
