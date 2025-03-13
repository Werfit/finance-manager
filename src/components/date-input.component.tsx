import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DateInputProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof Calendar>;

export const DateInput: React.FC<DateInputProps> = ({ children, ...props }) => (
  <Popover>
    <PopoverTrigger asChild>{children}</PopoverTrigger>
    <PopoverContent>
      <Calendar {...props} />
    </PopoverContent>
  </Popover>
);
