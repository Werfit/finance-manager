import { cn } from "@/shared/utils/cn.util";

type HintProps = React.ComponentProps<"p">;

export const Hint: React.FC<HintProps> = ({ className, ...props }) => (
  <p
    {...props}
    className={cn(
      "text-muted-foreground text-sm font-semibold italic",
      className
    )}
  />
);
