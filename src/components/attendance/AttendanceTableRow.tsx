
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { AttendanceStatus } from "./AttendanceStatus";
import { type AttendanceRecord } from "./hooks/useFetchAttendance";
import { useLanguage } from "@/contexts/LanguageContext";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
}

export function AttendanceTableRow({ record }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  
  // Handle date formatting for both single dates and ranges
  const formatDate = (dateString: string) => {
    if (dateString.includes(" - ")) {
      const [start, end] = dateString.split(" - ");
      return `${format(new Date(start), "PP")} - ${format(new Date(end), "PP")}`;
    }
    return format(new Date(dateString), "PP");
  };

  return (
    <TableRow className="animate-fade-in transition-colors duration-200 hover:bg-gray-50">
      <TableCell className={isHindi ? "font-hindi" : ""}>
        {formatDate(record.date)}
      </TableCell>
      <TableCell>
        <AttendanceStatus 
          status={record.status as 'absent' | 'on_leave' | 'present'} 
          leaveType={record.leave_type} 
        />
      </TableCell>
      <TableCell className={isHindi ? "font-hindi" : ""}>
        {record.reason || "-"}
      </TableCell>
    </TableRow>
  );
}
