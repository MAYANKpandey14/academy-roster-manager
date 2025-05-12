
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Calendar as CalendarIcon } from "lucide-react";
import { ApprovalStatus, AttendanceStatus } from "@/types/attendance";
import { cn } from "@/lib/utils";

export interface AttendanceFilters {
  startDate?: Date;
  endDate?: Date;
  status?: AttendanceStatus | null;
  approvalStatus?: ApprovalStatus | null;
}

interface AttendanceFiltersProps {
  onFilterChange: (filters: AttendanceFilters) => void;
  className?: string;
}

export function AttendanceFilters({ onFilterChange, className }: AttendanceFiltersProps) {
  const { isHindi } = useLanguage();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (type: 'start' | 'end', date?: Date) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value as AttendanceStatus | null);
  };

  const handleApprovalStatusChange = (value: string | null) => {
    setApprovalStatus(value as ApprovalStatus | null);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      startDate,
      endDate,
      status,
      approvalStatus,
    });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus(null);
    setApprovalStatus(null);
    onFilterChange({});
    setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (startDate) count++;
    if (endDate) count++;
    if (status) count++;
    if (approvalStatus) count++;
    return count;
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span className={isHindi ? "font-hindi" : ""}>
              {isHindi ? "फिल्टर" : "Filters"}
            </span>
            {getActiveFilterCount() > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4 space-y-4" align="start">
          <h3 className="font-medium text-lg">
            {isHindi ? "उपस्थिति फ़िल्टर" : "Attendance Filters"}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "प्रारंभ तिथि" : "Start Date"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span className={isHindi ? "font-hindi" : ""}>
                        {isHindi ? "तिथि चुनें" : "Pick a date"}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateChange('start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "अंतिम तिथि" : "End Date"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span className={isHindi ? "font-hindi" : ""}>
                        {isHindi ? "तिथि चुनें" : "Pick a date"}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateChange('end', date)}
                    disabled={(date) => 
                      startDate ? date < startDate : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className={isHindi ? "font-hindi" : ""}>
              {isHindi ? "स्थिति" : "Status"}
            </Label>
            <Select 
              value={status || ''} 
              onValueChange={(val) => handleStatusChange(val || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isHindi ? "स्थिति चुनें" : "Select status"
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {isHindi ? "सभी" : "All"}
                </SelectItem>
                <SelectItem value="absent">
                  {isHindi ? "अनुपस्थित" : "Absent"}
                </SelectItem>
                <SelectItem value="leave">
                  {isHindi ? "छुट्टी" : "Leave"}
                </SelectItem>
                <SelectItem value="on_leave">
                  {isHindi ? "छुट्टी पर" : "On Leave"}
                </SelectItem>
                <SelectItem value="suspension">
                  {isHindi ? "निलंबित" : "Suspension"}
                </SelectItem>
                <SelectItem value="resignation">
                  {isHindi ? "इस्तीफा" : "Resignation"}
                </SelectItem>
                <SelectItem value="termination">
                  {isHindi ? "समाप्ति" : "Termination"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Approval Status */}
          <div className="space-y-2">
            <Label className={isHindi ? "font-hindi" : ""}>
              {isHindi ? "अनुमोदन स्थिति" : "Approval Status"}
            </Label>
            <Select 
              value={approvalStatus || ''} 
              onValueChange={(val) => handleApprovalStatusChange(val || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isHindi ? "अनुमोदन स्थिति चुनें" : "Select approval status"
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {isHindi ? "सभी" : "All"}
                </SelectItem>
                <SelectItem value="pending">
                  {isHindi ? "लंबित" : "Pending"}
                </SelectItem>
                <SelectItem value="approved">
                  {isHindi ? "स्वीकृत" : "Approved"}
                </SelectItem>
                <SelectItem value="rejected">
                  {isHindi ? "अस्वीकृत" : "Rejected"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              onClick={handleClearFilters}
            >
              {isHindi ? "फिल्टर साफ़ करें" : "Clear Filters"}
            </Button>
            <Button onClick={handleApplyFilters}>
              {isHindi ? "फिल्टर लागू करें" : "Apply Filters"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
