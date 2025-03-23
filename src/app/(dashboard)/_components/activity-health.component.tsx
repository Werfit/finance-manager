"use client";
import { RadioIcon } from "lucide-react";

import { SimpleTooltip } from "@/components/simple-tooltip.component";
import { useGetActivityHealth } from "@/libs/query/queries/statistics.queries";
import { cn } from "@/shared/utils/cn.util";

export const ActivityHealth: React.FC = () => {
  const { isPending, data } = useGetActivityHealth();

  return (
    <div className="flex items-center justify-center">
      <SimpleTooltip content="Recommendation API Status">
        <RadioIcon
          className={cn("transition-colors", {
            "text-green-400": data && data.ok,
            "text-red-400": data && !data.ok,
            "animate-pulse text-yellow-500": isPending,
          })}
        />
      </SimpleTooltip>
    </div>
  );
};
