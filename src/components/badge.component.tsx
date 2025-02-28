import { cn } from "@/shared/utils/cn.util";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <div className={cn("rounded bg-gray-100 px-2 py-1 text-sm", className)}>
    {children}
  </div>
);
