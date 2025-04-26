
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TraineeFiltersProps {
  onNameChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onDateChange: (value: Date | undefined) => void;
  onReset: () => void;
  disabled?: boolean;
}

export function TraineeFilters({
  onNameChange,
  onDistrictChange,
  onDateChange,
  onReset,
  disabled = false,
}: TraineeFiltersProps) {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    onNameChange(value);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDistrict(value);
    onDistrictChange(value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    onDateChange(date);
  };

  const handleReset = () => {
    setName("");
    setDistrict("");
    setDate(undefined);
    onReset();
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-medium mb-4">Filter Trainees</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Search by name"
            value={name}
            onChange={handleNameChange}
            disabled={disabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="district">Current Posting District</Label>
          <Input
            id="district"
            placeholder="Search by district"
            value={district}
            onChange={handleDistrictChange}
            disabled={disabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Filter by Arrival Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                {date ? format(date, "PPP") : "Select date"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset} disabled={disabled}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
