import { Skeleton } from "@/components/ui/skeleton";

const SkeletonArray = Array.from({ length: 3 }, (_, index) => index);

export const DashboardSkeleton = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <Skeleton className="h-10 w-20" />

    {SkeletonArray.map((index) => (
      <Skeleton key={index} className="h-10 w-full" />
    ))}
  </div>
);
