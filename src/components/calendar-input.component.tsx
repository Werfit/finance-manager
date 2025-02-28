import { Calendar } from "./ui/calendar";

import { CalendarIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn.util";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { formatDate } from "@/shared/utils/date.util";

type CalendarInputProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const CalendarInput: React.FC<CalendarInputProps> = ({
  date,
  setDate,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => setDate(date ?? new Date())}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
