
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { AttendanceStatus } from "./AttendanceStatus";
import { useLanguage } from "@/contexts/LanguageContext";

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination';
  reason?: string;
  leave_type?: string;
}

interface AttendanceTableRowProps {
  record: AttendanceRecord;
}

export function AttendanceTableRow({ record }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PP");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <TableRow className="animate-fade-in transition-colors duration-200 hover:bg-gray-50">
      <TableCell className={isHindi ? "font-hindi" : ""}>
        {formatDate(record.date)}
      </TableCell>
      <TableCell>
        <AttendanceStatus status={record.status} />
      </TableCell>
      <TableCell className={isHindi ? "font-hindi" : ""}>
        {record.reason || "-"}
      </TableCell>
    </TableRow>
  );
}
