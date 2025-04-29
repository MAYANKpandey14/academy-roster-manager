
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  className?: string;
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | undefined;
  onSelect?: (date: Date | undefined) => void;
}

export function DatePicker({ 
  date, 
  setDate, 
  className,
  mode = "single",
  selected,
  onSelect
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>तारीख चुनें</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {mode === "single" && (
            <Calendar
              mode="single"
              selected={selected as Date || date}
              onSelect={(newDate) => {
                if (onSelect) {
                  onSelect(newDate);
                } else if (setDate) {
                  setDate(newDate);
                }
              }}
              initialFocus
              className="pointer-events-auto"
            />
          )}
          
          {mode === "range" && (
            <Calendar
              mode="range"
              selected={selected as any}
              onSelect={(newDate) => {
                if (onSelect) onSelect(newDate as any);
                else if (setDate) setDate(newDate as any);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          )}
          
          {mode === "multiple" && (
            <Calendar
              mode="multiple"
              selected={selected as Date[] || date ? [date] : []}
              onSelect={(newDate) => {
                if (onSelect) onSelect(newDate as any);
                else if (setDate) setDate((newDate as Date[])?.[0]);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
