
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { AttendanceStatus } from "./AttendanceStatus";
import { type AttendanceRecord } from "./hooks/useFetchAttendance";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
}

export function AttendanceTableRow({ record }: AttendanceTableRowProps) {
  // Handle date formatting for both single dates and ranges
  const formatDate = (dateString: string) => {
    if (dateString.includes(" - ")) {
      const [start, end] = dateString.split(" - ");
      return `${format(new Date(start), "PP")} - ${format(new Date(end), "PP")}`;
    }
    return format(new Date(dateString), "PP");
  };

  return (
    <TableRow>
      <TableCell>{formatDate(record.date)}</TableCell>
      <TableCell>
        <AttendanceStatus 
          status={record.status as 'absent' | 'on_leave' | 'present'} 
          leaveType={record.leave_type} 
        />
      </TableCell>
      <TableCell>{record.reason || "-"}</TableCell>
    </TableRow>
  );
}
