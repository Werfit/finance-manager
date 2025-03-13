import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type SimpleTooltipProps = {
  content: React.ReactNode | React.ReactNode[] | string;
  children: React.ReactNode;
};

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="left">{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
